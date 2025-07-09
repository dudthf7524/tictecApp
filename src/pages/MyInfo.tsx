import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { RootState } from '../store/reducer';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';

const userDetail = {
  user_name: "최영솔",
  user_position: "직원",
  user_nickname: "cys",
  user_hire_date: "2025-09-09"
}



const MyInfo = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();
  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);

  // const dispatch = useDispatch();
  // const { userDetail } = useSelector((state) => state.user);

  // useEffect(() => {
  //   dispatch({ type: USER_DETAIL_REQUEST });
  // }, [dispatch]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 프로필 정보 */}
        <View style={styles.profileContainer}>
          <Text style={styles.name}>{userDetail?.user_name}</Text>
          <Text style={styles.position}>{userDetail?.user_position}</Text>
        </View>

        {/* 사용자 정보 */}
        <View style={styles.infoContainer}>
          <InfoRow label="닉네임" value={userDetail?.user_nickname} />
          <InfoRow label="입사일" value={formatDate(userDetail?.user_hire_date)} />
        </View>

        {/* 기능 버튼 */}

        <View style={styles.actionsContainer}>
          {/* <ActionButton icon="edit" label="정보 수정" onPress={() => {}} />
          <ActionButton icon="key" label="비밀번호 변경" onPress={() => {}} /> */}
          <ActionButton icon="log-out" label="로그아웃" onPress={onLogout} />
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ActionButton = ({ icon , label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={styles.actionContent}>
      <Icon name={icon} size={20} color="#4B5563" />
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const formatDate = (dateString :string) => {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-');
  return `${y}년 ${m}월 ${d}일`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',

  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
    justifyContent: 'space-between',
    flex: 8
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  infoValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 10,
  },
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
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
});

export default MyInfo;
