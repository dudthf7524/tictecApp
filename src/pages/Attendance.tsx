// pages/Attendance.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // 위치 아이콘
// import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import Today from '../subPages/Today';
import { RootStackParamList } from '../../AppInner';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../store';
import attendanceSlice from '../slices/attendance';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import axios, { AxiosError } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from '../slices/user';
// import BottomBar from '../components/BottomBar'; // 하단 네비게이션 바
// import MyLocation from './MyLocation'; // 위치 모달 컴포넌트
// import Today from '../components/Today';
// import {
//   TIME_DETAIL_REQUEST,
//   ATTENDANCE_TODAY_REQUEST,
//   ATTENDANCE_REGISTER_REQUEST,
//   ATTENDANCE_UPDATE_REQUEST,
// } from '../reducers/attendanceActions';

const timeDetail = {
  start_time: "09:00",
  end_time: "18:00",
  rest_start_time: "12:00",
  rest_end_time: "13:00"
}

const attendanceToday = {
  attendance_start_date: "2025-07-07",
  attendance_start_time: "09:00",
  attendance_end_date: "2025-07-07",
  attendance_end_time: "09:00",
}

type SignInScreenProps = NativeStackScreenProps<RootStackParamList>;

const Attendance = ({ navigation }: SignInScreenProps) => {
  //   const dispatch = useDispatch();
  const dispatch = useAppDispatch();

  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const attendanceToday = useSelector((state: RootState) => state.attendance.attendanceToday);

  useEffect(() => {
    async function getAttendanceToday() {
      try {
        const response = await axios.get(
          `${Config.API_URL}/app/attendance/today`,
          {
            headers: { authorization: `Bearer ${accessToken}` },
          },
        );
        dispatch(attendanceSlice.actions.getAttendanceToday(response.data));
      } catch (error) {
        console.error('시간 정보 불러오기 실패:', error);
        const errorResponse = (error as AxiosError<{ message: string }>).response;
        console.error(errorResponse?.status)
        if (errorResponse?.status === 419) {
          const token = await EncryptedStorage.getItem('refreshToken');
          console.log(token)
          if (!token) {
            Alert.alert('알림', '로그아웃 되었습니다.');
            return;
          }

          const response = await axios.post(
            `${Config.API_URL}/login/refreshToken`,
            {},
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );

          dispatch(
            userSlice.actions.setUser({
              user_code: response.data.data.user_code,
              user_name: response.data.data.user_name,
              accessToken: response.data.data.accessToken,
            })
          );
        }
      }
    }

    getAttendanceToday();
  }, [accessToken, dispatch]);

  //   const { timeDetail } = useSelector((state: any) => state.time);
  //   const { attendanceToday } = useSelector((state: any) => state.attendance);

  //   useEffect(() => {
  //     dispatch({ type: TIME_DETAIL_REQUEST });
  //     dispatch({ type: ATTENDANCE_TODAY_REQUEST });
  //   }, []);

  //   const handleCheckIn = () => {
  //     if (!timeDetail) return Alert.alert('알림', '출근 시간이 설정되지 않았습니다.');
  //     if (attendanceToday?.attendance_id) return Alert.alert('알림', '이미 출근 기록이 있습니다.');

  //     const now = dayjs();
  //     const attendance_start_time = now.format('HH:mm');
  //     const attendance_start_state =
  //       timeDetail?.start_time < attendance_start_time ? '지각' : '정상';

  //     const data = {
  //       attendance_start_date: now.format('YYYY-MM-DD'),
  //       attendance_start_time,
  //       attendance_start_state,
  //       start_time: timeDetail.start_time,
  //       rest_start_time: timeDetail.rest_start_time,
  //       rest_end_time: timeDetail.rest_end_time,
  //     };

  //     dispatch({ type: ATTENDANCE_REGISTER_REQUEST, data });
  //   };

  //   const handleCheckOut = () => {
  //     if (!timeDetail) return Alert.alert('알림', '퇴근 시간이 설정되지 않았습니다.');
  //     const now = dayjs();
  //     const data = {
  //       attendance_id: attendanceToday?.attendance_id,
  //       attendance_end_date: now.format('YYYY-MM-DD'),
  //       attendance_end_time: now.format('HH:mm'),
  //       attendance_end_state: '퇴근',
  //     };
  //     dispatch({ type: ATTENDANCE_UPDATE_REQUEST, data });
  //   };

  const hasStarted = !!attendanceToday?.attendance_start_time;
  const hasEnded = !!attendanceToday?.attendance_end_time;

  const toMapScreen = () => {
    navigation.navigate('MapScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>오늘 17:00 이후 퇴근 처리됩니다. 지각 주의하세요!</Text>
        </View>

        <Today />

        <TouchableOpacity style={styles.locationBtn} onPress={toMapScreen}>
          <Icon name="map-pin" size={20} color="#4F46E5" />
          <Text style={styles.locationText}>GPS</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            disabled={hasStarted && !hasEnded}
            style={[
              styles.actionButton,
              hasStarted && !hasEnded && styles.disabled,
            ]}
            onPress={() => Alert.alert("출근 버튼 눌림")}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="log-in" size={28} color={hasStarted && !hasEnded ? '#9ca3af' : '#10b981'} />
              <Text style={[styles.buttonText, { color: hasStarted && !hasEnded ? '#9ca3af' : '#10b981' }]}>출근</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!hasStarted || hasEnded}
            style={[
              styles.actionButton,
              (!hasStarted || hasEnded) && styles.disabled,
            ]}
            onPress={() => Alert.alert("퇴근 버튼 눌림")}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="log-out" size={28} color={!hasStarted || hasEnded ? '#9ca3af' : '#ef4444'}
              />
              <Text style={[styles.buttonText, { color: !hasStarted || hasEnded ? '#9ca3af' : '#ef4444' },]}>퇴근</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// const InfoBlock = ({ title, value }: { title: string; value: string }) => (
//   <View style={{ marginBottom: 12 }}>
//     <Text style={styles.infoTitle}>{title}</Text>
//     <Text style={styles.infoValue}>{value}</Text>
//   </View>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center'
  },
  noticeBox: {
    backgroundColor: '#e0edff',
    borderColor: '#90caff',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flex: 1
  },
  noticeText: { color: '#2563eb', fontSize: 14 },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    marginTop: 20,
    flex: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 20,
  },
  timeInfoBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  recordBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    flex: 4
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  active: {
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  disabled: {
    borderColor: '#ccc',
    color: '#f3f4f6',
    backgroundColor: '#f3f4f6',
  },
  buttonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    height: '90%',
  },
});

export default Attendance;
