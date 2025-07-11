import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { useAppDispatch } from '../store';
import Config from 'react-native-config';
import { RootState } from '../store/reducer';
import timeSlice from '../slices/time';
import attendanceSlice from '../slices/attendance';

const TimeTable = () => {
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const timeDetail = useSelector((state: RootState) => state.time.timeDetail);
  const attendanceToday = useSelector((state: RootState) => state.attendance.attendanceToday);

  useEffect(() => {
    async function getTimeDetail() {
      try {
        const response = await axios.get(`${Config.API_URL}/app/time/detail`, {
          headers: { authorization: `Bearer ${accessToken}` },
        });
        dispatch(timeSlice.actions.getTime(response.data));
      } catch (error) {
        const err = error as AxiosError;
        console.error('시간 정보 실패:', err.response?.data || err.message);
      }
    }
    getTimeDetail();
  }, [dispatch]);

  useEffect(() => {
    async function getAttendanceToday() {
      try {
        const response = await axios.get(`${Config.API_URL}/app/attendance/today`, {
          headers: { authorization: `Bearer ${accessToken}` },
        });
        dispatch(attendanceSlice.actions.getAttendanceToday(response.data));
      } catch (error) {
        const err = error as AxiosError;
        console.error('출근 정보 실패:', err.response?.data || err.message);
      }
    }
    getAttendanceToday();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.content}>
        <View style={styles.timeInfoBox}>
          <InfoBlock icon="calendar" title="회사 출근 시간" value={timeDetail?.start_time || '출근시간 미정'} />
          <InfoBlock icon="calendar" title="회사 퇴근 시간" value={timeDetail?.end_time || '퇴근시간 미정'} />
          <InfoBlock
            icon="coffee"
            title="휴게 시간"
            value={
              timeDetail?.rest_start_time && timeDetail?.rest_end_time
                ? `${timeDetail.rest_start_time} ~ ${timeDetail.rest_end_time}`
                : '휴게시간 미정'
            }
          />
        </View>

        <View style={styles.recordBox}>
          <InfoBlock icon="log-in" iconColor="#10b981" title="출근 날짜" value={attendanceToday?.attendance_start_date || '출근 전'} />
          <InfoBlock icon="clock" title="출근 시간" value={attendanceToday?.attendance_start_time || '출근 전'} />
          <InfoBlock icon="log-out" iconColor="#ef4444" title="퇴근 날짜" value={attendanceToday?.attendance_end_date || '퇴근 전'} />
          <InfoBlock icon="clock" title="퇴근 시간" value={attendanceToday?.attendance_end_time || '퇴근 전'} />
        </View>
      </View>
    </View>
  );
};

const InfoBlock = ({
  icon,
  title,
  value,
  iconColor = '#6b7280',
}: {
  icon: string;
  title: string;
  value: string;
  iconColor?: string;
}) => (
  <View style={styles.infoBlock}>
    <View style={styles.iconLabelRow}>
      <Icon name={icon} size={16} color={iconColor} style={styles.icon} />
      <Text style={styles.infoTitle}>{title}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  timeInfoBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  recordBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
  },
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
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
});

export default TimeTable;
