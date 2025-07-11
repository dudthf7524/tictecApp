// pages/Attendance.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // 위치 아이콘
import Today from '../subPages/Today';
import { RootStackParamList } from '../../AppInner';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';

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

  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const timeDetail = useSelector((state: RootState) => state.time.timeDetail);
  const attendanceToday = useSelector((state: RootState) => state.attendance.attendanceToday);

  const hasStarted = !!attendanceToday?.attendance_start_time;
  const hasEnded = !!attendanceToday?.attendance_end_time;

  const toMapScreen = () => {
    navigation.navigate('MapScreen');
  };

  const attendance = async () => {
    if (!timeDetail) {
      Alert.alert('알림', '지정된 출근/퇴근 시간이 존재하지 않습니다.\n관리자에게 문의 해주세요.');
      return;
    }

    if (attendanceToday?.attendance_id) {
      Alert.alert('알림', '이미 출근 기록이 존재합니다.');
      return;
    }

    // // if (!isWithinRadius) {
    // //     alert('근무지 반경 외부입니다. 출근할 수 없습니다.');
    // //     return;
    // // }

    const now = dayjs(); // 여기에 새로 선언
    const attendance_start_date = now.format('YYYY-MM-DD');
    const attendance_start_time = now.format('HH:mm');

    var attendance_start_state = "";

    if (timeDetail?.start_time < attendance_start_time) {
      attendance_start_state = "지각";
    } else {
      attendance_start_state = "정상";
    }

    const data = {
      attendance_start_date: attendance_start_date,
      attendance_start_time: attendance_start_time,
      attendance_start_state: attendance_start_state,
      start_time: timeDetail.start_time,
      rest_start_time: timeDetail.rest_start_time,
      rest_end_time: timeDetail.rest_end_time,
    }

    try {
      const response = await axios.post(`${Config.API_URL}/app/attendance/register`,
        data
        ,
        {
          headers: { authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.status === 200) {
        Alert.alert('알림', response.data.message);
        navigation.navigate('TimeTable')
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{ message: string }>).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }

  const leaveWork = async () => {
    if (!timeDetail) {
      Alert.alert('알림', '지정된 출근/퇴근 시간이 존재하지 않습니다.\n관리자에게 문의 해주세요.');
      return;
    }

    const now = dayjs(); // 여기에 새로 선언
    const attendance_end_date = now.format('YYYY-MM-DD');
    const attendance_end_time = now.format('HH:mm');
    var attendance_end_state = "퇴근";

    const data = {
      attendance_id: attendanceToday?.attendance_id,
      attendance_end_date: attendance_end_date,
      attendance_end_time: attendance_end_time,
      attendance_end_state: attendance_end_state,
    }

    try {
      const response = await axios.post(`${Config.API_URL}/app/attendance/update`,
        data
        ,
        {
          headers: { authorization: `Bearer ${accessToken}` },
        },
      );

      if (response.status === 200) {
        Alert.alert('알림', response.data.message);
        navigation.navigate('TimeTable')
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{ message: string }>).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
            onPress={attendance}
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
            onPress={leaveWork}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="log-out" size={28} color={!hasStarted || hasEnded ? '#9ca3af' : '#ef4444'}
              />
              <Text style={[styles.buttonText, { color: !hasStarted || hasEnded ? '#9ca3af' : '#ef4444' },]}>퇴근</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
