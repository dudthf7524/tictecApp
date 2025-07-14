import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { useAppDispatch } from '../store';
import Config from 'react-native-config';
import { RootState } from '../store/reducer';
import timeSlice from '../slices/time';
import attendanceSlice from '../slices/attendance';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

const TimeTable = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const timeDetail = useSelector((state: RootState) => state.time.timeDetail);
  const attendanceToday = useSelector((state: RootState) => state.attendance.attendanceToday);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 시간 정보 가져오기
      const timeResponse = await axios.get(`${Config.API_URL}/app/time/detail`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      dispatch(timeSlice.actions.getTime(timeResponse.data));

      // 출근 정보 가져오기
      const attendanceResponse = await axios.get(`${Config.API_URL}/app/attendance/today`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      dispatch(attendanceSlice.actions.getAttendanceToday(attendanceResponse.data));
    } catch (error) {
      const err = error as AxiosError;
      console.error('데이터 로드 실패:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, accessToken]);

  // 탭이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.loadingContainer]}>
  //       <ActivityIndicator size="large" color="#2563eb" />
  //       <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.content}>
        <View style={styles.timeInfoBox}>
          <InfoBlock icon="calendar" title={t('companyGoToWorkTime')} value={timeDetail?.start_time || t('notSet')} />
          <InfoBlock icon="calendar" title={t('companyLeaveWorkTime')} value={timeDetail?.end_time || t('notSet')} />
          <InfoBlock
            icon="coffee"
            title={t('breakTime')}
            value={
              timeDetail?.rest_start_time && timeDetail?.rest_end_time
                ? `${timeDetail.rest_start_time} ~ ${timeDetail.rest_end_time}`
                : t('notSet')
            }
          />
        </View>

        <View style={styles.recordBox}>
          <InfoBlock icon="log-in" iconColor="#10b981" title={t('goToWorkDate')} value={attendanceToday?.attendance_start_date || t('beforeGoToWork')} />
          <InfoBlock icon="clock" title={t('goToWorkTime')} value={attendanceToday?.attendance_start_time || t('beforeGoToWork')} />
          <InfoBlock icon="log-out" iconColor="#ef4444" title={t('leaveWorkDate')} value={attendanceToday?.attendance_end_date || t('beforeGoToWork')} />
          <InfoBlock icon="clock" title={t('leaveWorkTime')} value={attendanceToday?.attendance_end_time || t('beforeGoToWork')} />
        </View>
      </View>
    </View>
  );
});

const InfoBlock = React.memo(({
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
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
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