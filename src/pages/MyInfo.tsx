import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
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

  console.log("userDeatil", userDetail)

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${Config.API_URL}/app/user/detail`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      console.log('data', response.data)
      const {
        user_code,
        user_name,
        user_nickname,
        user_hire_date,
        user_position,
        user_birth_date,
        user_annual_leave,
        user_blood_type,
        user_phone,
        user_postcode,
        user_address_basic,
        user_address_detail
      } = response.data;
      const country_name = response.data.country.country_name;
      const department_name = response.data.department.department_name;
      const education_level_name = response.data.education_level.education_level_name;
      dispatch(userInfoSlice.actions.getUserInformation({
        user_code,
        user_name,
        user_nickname,
        user_hire_date,
        user_position,
        country_name,
        department_name,
        education_level_name,
        user_birth_date,
        user_annual_leave,
        user_blood_type,
        user_phone,
        user_postcode,
        user_address_basic,
        user_address_detail
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="user" size={20} color="#667eea" />
            <Text style={styles.cardTitle}>개인 정보</Text>
          </View>
          <InfoBlock icon="user" title="이름" value={userDetail?.user_name || ''} />
          <InfoBlock icon="briefcase" title="직책" value={userDetail?.user_position || ''} />
          <InfoBlock icon="smile" title={t('nickname')} value={userDetail?.user_nickname || ''} />
          <InfoBlock icon="calendar" title="생년월일" value={formatDate(userDetail?.user_birth_date || '')} />
          <InfoBlock icon="droplet" title="혈액형" value={userDetail?.user_blood_type || ''} />
          <InfoBlock icon="phone" title="전화번호" value={userDetail?.user_phone || ''} />
        </View>

        {/* Work Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="briefcase" size={20} color="#667eea" />
            <Text style={styles.cardTitle}>근무 정보</Text>
          </View>
          <InfoBlock icon="calendar" title="입사일" value={formatDate(userDetail?.user_hire_date || '')} />
          <InfoBlock icon="users" title="부서" value={userDetail?.department_name || ''} />
          <InfoBlock icon="award" title="학력" value={userDetail?.education_level_name || ''} />
          <InfoBlock icon="clock" title="연차수" value={`${userDetail?.user_annual_leave || 0}일`} />
        </View>

        {/* Location Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="map-pin" size={20} color="#667eea" />
            <Text style={styles.cardTitle}>위치 정보</Text>
          </View>
          <InfoBlock icon="globe" title="국적" value={userDetail?.country_name || ''} />
          <InfoBlock icon="map" title="우편번호" value={userDetail?.user_postcode || ''} />
          <InfoBlock icon="home" title="기본주소" value={userDetail?.user_address_basic || ''} />
          <InfoBlock icon="navigation" title="상세주소" value={userDetail?.user_address_detail || ''} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const InfoBlock = React.memo(({ icon, title, value }: { icon: string; title: string; value: string }) => (
  <View style={styles.infoBlock}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={18} color="#667eea" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  </View>
));


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginLeft: 8,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
});

export default MyInfo;
