import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { useAppDispatch } from '../store';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import userInfoSlice from '../slices/userInfo';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

const MyInfo = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const userDetail = useSelector((state: RootState) => state.userInfo.userDetail);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${Config.API_URL}/app/user/detail`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { user_code, user_name, user_nickname, user_hire_date, user_position } = response.data;
      dispatch(userInfoSlice.actions.getUserInformation({
        user_code,
        user_name,
        user_nickname,
        user_hire_date,
        user_position
      }));
    } catch (error) {
      const err = error as AxiosError;
      console.error(t('employeeInfoFailed'), err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, accessToken, t]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${y}${t('year')} ${m}${t('month')} ${d}${t('date')}`;
  };

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.loadingContainer]}>
  //       <ActivityIndicator size="large" color="#2563eb" />
  //       <Text style={styles.loadingText}>{t('loadingUserInfo')}</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <InfoBlock icon="user" title={t('name')} value={userDetail?.user_name || ''} />
          <InfoBlock icon="smile" title={t('nickname')} value={userDetail?.user_nickname || ''} />
          <InfoBlock icon="briefcase" title={t('position')} value={userDetail?.user_position || ''} />
          <InfoBlock icon="calendar" title={t('hireDate')} value={formatDate(userDetail?.user_hire_date || '')} />
        </View>
      </ScrollView>
    </View>
  );
});

const InfoBlock = React.memo(({ icon, title, value }: { icon: string; title: string; value: string }) => (
  <View style={styles.infoBlock}>
    <Icon name={icon} size={20} color="#6366f1" style={styles.icon} />
    <View>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    // borderWidth: 1,
    // borderColor: '#e5e7eb',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.06,
    // shadowRadius: 6,
    // elevation: 3,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  icon: {
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
});

export default MyInfo;
