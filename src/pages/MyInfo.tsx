import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { useAppDispatch } from '../store';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Feather';
import userInfoSlice from '../slices/userInfo';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

const MyInfo = React.memo(() => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const userDetail = useSelector((state: RootState) => state.userInfo.userDetail);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
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

  // 탭이 포커스될 때마다 사용자 정보 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const onLogout = useCallback(async () => {
    try {
      await axios.post(`${Config.API_URL}/user/logout`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      Alert.alert(t('alert'), t('logoutSuccess'));
      dispatch(userSlice.actions.setUser({ name: '', email: '', accessToken: '' }));
      // @ts-ignore
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const err = error as AxiosError;
      console.error(err.response?.data || err.message);
    }
  }, [accessToken, dispatch, t]);

  const handleSelectLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      [t('korean')]: 'ko',
      [t('english')]: 'en', 
      [t('japanese')]: 'ja'
    };
    
    const languageCode = languageMap[lang] || 'ko';
    i18n.changeLanguage(languageCode);
    Alert.alert(t('languageSelection'), t('languageChangeConfirm', { lang }));
    setLanguageModalVisible(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${y}${t('year')} ${m}${t('month')} ${d}${t('date')}`;
  };

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.loadingContainer]}>
  //       <ActivityIndicator size="large" color="#2563eb" />
  //       <Text style={styles.loadingText}>사용자 정보를 불러오는 중...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <Icon name="user" size={16} color="#6B7280" style={{ marginRight: 6 }} />
              <Text style={styles.infoLabel}>{t('name')}</Text>
            </View>
            <Text style={styles.infoValue}>{userDetail?.user_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <Icon name="smile" size={16} color="#6B7280" style={{ marginRight: 6 }} />
              <Text style={styles.infoLabel}>{t('nickname')}</Text>
            </View>
            <Text style={styles.infoValue}>{userDetail?.user_nickname}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <Icon name="briefcase" size={16} color="#6B7280" style={{ marginRight: 6 }} />
              <Text style={styles.infoLabel}>{t('position')}</Text>
            </View>
            <Text style={styles.infoValue}>{userDetail?.user_position}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <Icon name="calendar" size={16} color="#6B7280" style={{ marginRight: 6 }} />
              <Text style={styles.infoLabel}>{t('hireDate')}</Text>
            </View>
            <Text style={styles.infoValue}>{formatDate(userDetail?.user_hire_date ?? '')}</Text>
          </View>
        </View>

        {/* <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
            <View style={styles.actionContent}>
              <Icon name="log-out" size={20} color="#4B5563" />
              <Text style={styles.actionLabel}>{t('logout')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setLanguageModalVisible(true)}>
            <View style={styles.actionContent}>
              <Icon name="globe" size={20} color="#4B5563" />
              <Text style={styles.actionLabel}>{t('languageSettings')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center' },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  contentContainer: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  infoContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    justifyContent: 'space-between',
    flex: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: { color: '#6B7280', fontSize: 14 },
  infoValue: { color: '#111827', fontSize: 16, fontWeight: '500' },
  actionsContainer: { marginTop: 10 },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  actionContent: { flexDirection: 'row', alignItems: 'center' },
  actionLabel: { marginLeft: 8, fontSize: 14, color: '#1F2937' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  modalOption: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: { fontSize: 16, color: '#1F2937' },
});

export default MyInfo;
