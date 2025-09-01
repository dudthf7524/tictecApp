// pages/Attendance.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Feather'; // 위치 아이콘
import Today from '../subPages/Today';
import { RootStackParamList } from '../../AppInner';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../store';
import workPlaceSlice from '../slices/workPlace';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList>;

const Attendance = React.memo(({ navigation }: SignInScreenProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const timeDetail = useSelector((state: RootState) => state.time.timeDetail);
  const attendanceToday = useSelector((state: RootState) => state.attendance.attendanceToday);
  const isWithinRadius = useSelector((state: RootState) => state.workPlace.isWithinRadius);

  const hasStarted = !!attendanceToday?.attendance_start_time;
  const hasEnded = !!attendanceToday?.attendance_end_time;

  const toMapScreen = () => {
    navigation.navigate('MapScreen');
  };

  const checkGPSPermission = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve(true);
          } else {
            Alert.alert(
              t('alert'), 
              'GPS 권한이 필요합니다. 설정에서 위치 권한을 허용해주세요.',
              [{ text: '확인', onPress: () => resolve(false) }]
            );
          }
        }).catch(() => {
          Alert.alert(
            t('alert'),
            'GPS 권한 확인 중 오류가 발생했습니다.',
            [{ text: '확인', onPress: () => resolve(false) }]
          );
        });
      } else {
        // iOS의 경우 위치 정보 요청
        Geolocation.getCurrentPosition(
          () => resolve(true),
          () => {
            Alert.alert(
              t('alert'),
              'GPS 권한이 필요합니다. 설정에서 위치 권한을 허용해주세요.',
              [{ text: '확인', onPress: () => resolve(false) }]
            );
          },
          { timeout: 5000 }
        );
      }
    });
  };

  const attendance = async () => {
    // 위치 확인
    if (!isWithinRadius) {
      Alert.alert(
        t('alert'), 
        '회사 반경 안에 있지 않습니다. GPS 페이지에서 위치를 확인해주세요.',
        [{ text: '확인' }]
      );
      return;
    }

    // GPS 권한 확인
    const hasGPSPermission = await checkGPSPermission();
    if (!hasGPSPermission) {
      return;
    }

    if (!timeDetail) {
      Alert.alert(t('alert'), t('noTimeInfo'));
      return;
    }

    if (attendanceToday?.attendance_id) {
      Alert.alert(t('alert'), t('alreadyGoToWork'));
      return;
    }

    const now = dayjs();
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
      end_time:timeDetail.end_time,
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
        // 출근 성공 후 위치 상태 초기화
        dispatch(workPlaceSlice.actions.setIsWithinRadius(false));
        Alert.alert(t('alert'), response.data.message);
        navigation.navigate('TimeTable')
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{ message: string }>).response;
      if (errorResponse) {
        Alert.alert(t('alert'), errorResponse.data.message);
      }
    }
  }

  const leaveWork = async () => {
    // 위치 확인
    if (!isWithinRadius) {
      Alert.alert(
        t('alert'), 
        '회사 반경 안에 있지 않습니다. GPS 페이지에서 위치를 확인해주세요.',
        [{ text: '확인' }]
      );
      return;
    }

    // GPS 권한 확인
    const hasGPSPermission = await checkGPSPermission();
    if (!hasGPSPermission) {
      return;
    }

    if (!timeDetail) {
      Alert.alert(t('alert'), t('noTimeInfo'));
      return;
    }

    const now = dayjs();
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
        // 퇴근 성공 후 위치 상태 초기화
        dispatch(workPlaceSlice.actions.setIsWithinRadius(false));
        Alert.alert(t('alert'), response.data.message);
        navigation.navigate('TimeTable')
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{ message: string }>).response;
      if (errorResponse) {
        Alert.alert(t('alert'), errorResponse.data.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>{t('notice')}</Text>
        </View> */}
        <View style={styles.noticeBar}>
          <Text style={styles.noticeText}>{t('notice')}</Text>
        </View>
        
        <Today />

        {/* <TouchableOpacity style={styles.locationBtn} onPress={toMapScreen}>
          <Icon name="map-pin" size={20} color="#4F46E5" />
          <Text style={styles.locationText}>GPS</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.actionButton} onPress={toMapScreen}>
          <View style={styles.actionContent}>
            <Icon name="map-pin" size={20} color="#4F46E5" />
            <Text style={styles.actionLabel}>GPS</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity disabled={hasStarted && !hasEnded} style={styles.actionButton} onPress={attendance}>
          <View style={styles.actionContent}>
            <Text style={[styles.actionLabel, { color: hasStarted && !hasEnded ? '#9ca3af' : '#10b981' }]}>{t('goToWork')}</Text>
          </View>
          <Icon name="log-in" size={20} color={hasStarted && !hasEnded ? '#9ca3af' : '#10b981'} />
        </TouchableOpacity>

        <TouchableOpacity disabled={!hasStarted || hasEnded} style={styles.actionButton} onPress={leaveWork}>
          <View style={styles.actionContent}>
            <Text style={[styles.actionLabel, { color: !hasStarted || hasEnded ? '#9ca3af' : '#ef4444' }]}>{t('leaveWork')}</Text>
          </View>
          <Icon name="log-out" size={20} color={!hasStarted || hasEnded ? '#9ca3af' : '#ef4444'} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
  noticeBar: {
    backgroundColor: '#fef3c7',
    padding: 18,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#facc15',
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
  noticeText: {
    // color: '#2563eb',
    color: '#92400e',
    fontWeight: '600',
    fontSize: 15,
  },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#ffffff',
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

export default Attendance;