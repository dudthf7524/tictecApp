import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
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
      const timeResponse = await axios.get(`${Config.API_URL}/app/time/detail`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      dispatch(timeSlice.actions.getTime(timeResponse.data));

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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.boxContainer}>
          <View style={styles.box}>
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

          <View style={styles.box}>
            <InfoBlock icon="log-in" iconColor="#10b981" title={t('goToWorkDate')} value={attendanceToday?.attendance_start_date || t('beforeGoToWork')} />
            <InfoBlock icon="clock" title={t('goToWorkTime')} value={attendanceToday?.attendance_start_time || t('beforeGoToWork')} />
            <InfoBlock icon="log-out" iconColor="#ef4444" title={t('leaveWorkDate')} value={attendanceToday?.attendance_end_date || t('beforeGoToWork')} />
            <InfoBlock icon="clock" title={t('leaveWorkTime')} value={attendanceToday?.attendance_end_time || t('beforeGoToWork')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const InfoBlock = React.memo(({
  icon,
  title,
  value,
  iconColor = '#4b5563',
}: {
  icon: string;
  title: string;
  value: string;
  iconColor?: string;
}) => (
  <View style={styles.infoBlock}>
    <Icon name={icon} size={18} color={iconColor} style={styles.icon} />
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
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  box: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

export default TimeTable;
