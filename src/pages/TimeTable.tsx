import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
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
import StaticKeyboardView from '../components/StaticKeyboardView';

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

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.loadingContainer]}>
  //       <ActivityIndicator size="large" color="#2563eb" />
  //       <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
  //     </View>
  //   );
  // }

  return (
    <StaticKeyboardView>
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollContainer} 
        // showsVerticalScrollIndicator={false}
        >
          {/* Company Schedule Card */}

          {/* Status Summary Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Icon name="activity" size={20} color="#667eea" />
              <Text style={styles.statusTitle}>오늘 근무 상태</Text>
            </View>
            <View style={styles.statusContent}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: attendanceToday?.attendance_start_time ? '#10b981' : '#e5e7eb' }]} />
                <Text style={styles.statusText}>출근</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: attendanceToday?.attendance_end_time ? '#ef4444' : '#e5e7eb' }]} />
                <Text style={styles.statusText}>퇴근</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="briefcase" size={20} color="#667eea" />
              <Text style={styles.cardTitle}>회사 근무 시간</Text>
            </View>
            <InfoBlock
              icon="sunrise"
              iconColor="#10b981"
              title="출근 시간"
              value={timeDetail?.start_time || '미설정'}
            />
            <InfoBlock
              icon="sunset"
              iconColor="#ef4444"
              title="퇴근 시간"
              value={timeDetail?.end_time || '미설정'}
            />
            <InfoBlock
              icon="coffee"
              iconColor="#f59e0b"
              title="휴가 시간"
              value={
                timeDetail?.rest_start_time && timeDetail?.rest_end_time
                  ? `${timeDetail.rest_start_time} ~ ${timeDetail.rest_end_time}`
                  : '미설정'
              }
            />
          </View>

          {/* Today's Attendance Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="user-check" size={20} color="#667eea" />
              <Text style={styles.cardTitle}>오늘 출근 현황</Text>
            </View>
            <View style={styles.attendanceRow}>
              <View style={styles.attendanceColumn}>
                <InfoBlock
                  icon="log-in"
                  iconColor="#10b981"
                  title="출근 일자"
                  value={attendanceToday?.attendance_start_date || '출근 전'}
                />
                <InfoBlock
                  icon="clock"
                  iconColor="#10b981"
                  title="출근 시간"
                  value={attendanceToday?.attendance_start_time || '출근 전'}
                />
              </View>
              <View style={styles.attendanceColumn}>
                <InfoBlock
                  icon="log-out"
                  iconColor="#ef4444"
                  title="퇴근 일자"
                  value={attendanceToday?.attendance_end_date || '퇴근 전'}
                />
                <InfoBlock
                  icon="clock"
                  iconColor="#ef4444"
                  title="퇴근 시간"
                  value={attendanceToday?.attendance_end_time || '퇴근 전'}
                />
              </View>
            </View>
          </View>


        </View>
      </SafeAreaView>
    </StaticKeyboardView>
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
  <TouchableOpacity style={styles.infoBlock} activeOpacity={0.7}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={18} color={iconColor} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
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
  statusCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginLeft: 8,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a5568',
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
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default TimeTable;
