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
  attendance_end_time: "12:00",
}

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const Attendance = ({ navigation }: SignInScreenProps) => {
  //   const dispatch = useDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);

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

  //   const hasStarted = !!attendanceToday?.attendance_start_time;
  //   const hasEnded = !!attendanceToday?.attendance_end_time;

  const toMapScreen = useCallback(() => {
    navigation.navigate('MapScreen');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>오늘 17:00 이후 퇴근 처리됩니다. 지각 주의하세요!</Text>
        </View>

        <Today />

        <TouchableOpacity style={styles.locationBtn} onPress={toMapScreen}>
          <Icon name="map-pin" size={18} color="#2563eb" />
          <Text style={styles.locationText}>현재 위치 찾기</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            // disabled={hasStarted && !hasEnded}
            // onPress={handleCheckIn}
            style={[
              styles.actionButton,
              // hasStarted && !hasEnded ? styles.disabled : styles.active,
            ]}
          >
            <Text style={styles.buttonText}>출근</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // disabled={!hasStarted || hasEnded}
            // onPress={handleCheckOut}
            style={[
              styles.actionButton,
              // !hasStarted || hasEnded ? styles.disabled : styles.active,
            ]}
          >
            <Text style={styles.buttonText}>퇴근</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* <BottomBar /> */}

      <Modal visible={showLocationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <MyLocation closeModal={() => setShowLocationModal(false)} /> */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const InfoBlock = ({ title, value }: { title: string; value: string }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
    gap: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    marginTop: 20,
    flex: 4
  },
  locationText: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 14,
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
    borderWidth: 1,
  },
  active: {
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  disabled: {
    borderColor: '#ccc',
    backgroundColor: '#f3f4f6',
  },
  buttonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16,
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
