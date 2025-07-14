import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';
import { useAppDispatch } from '../store';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import vacationSlice from '../slices/vacation';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';


type SignInScreenProps = NativeStackScreenProps<RootStackParamList>;

const Calendars = React.memo(({ navigation }: SignInScreenProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const vacationLists = useSelector((state: RootState) => state.vacation.vacationList);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getVacationStateText = (state: number) => {
    switch (state) {
      case 0:
        return t('requested');
      case 1:
        return t('approved');
      case -1:
        return t('rejected');
      default:
        return '';
    }
  };

  const getVacationStateColor = (state: number) => {
    switch (state) {
      case 1:
        return '#10B981'; // 초록색 (승인)
      case 0:
        return '#6B7280'; // 회색 (요청됨)
      case -1:
        return '#EF4444'; // 빨간색 (거절됨)
      default:
        return '#6B7280';
    }
  };

  const getVacationDotColor = (dateString: string) => {
    const vacation = vacationLists.find(v => v.start_date === dateString);
    if (vacation) {
      return getVacationStateColor(vacation.vacation_state);
    }
    return '#1abc9c'; // 기본 색상
  };

  const markedDates = vacationLists.reduce((acc, cur) => {
    acc[cur.start_date] = { 
      marked: true, 
      dotColor: getVacationStateColor(cur.vacation_state)
    };
    return acc;
  }, {} as { [key: string]: any });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: '#2563eb',
    };
  }

  const vacationOfDay = vacationLists.filter((item) => item.start_date === selectedDate);

  const toVacationRegister = () => {
    navigation.navigate('VacationRegister');
  };

  const fetchVacationData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${Config.API_URL}/app/vacation/list`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      dispatch(vacationSlice.actions.getVacation(response.data));
    } catch (error) {
      const err = error as AxiosError;
      console.error('휴가 정보 실패:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, accessToken]);

  // 탭이 포커스될 때마다 휴가 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchVacationData();
    }, [fetchVacationData])
  );

  // if (isLoading) {
  //   return (
  //     <View style={[styles.wrapper, styles.loadingContainer]}>
  //       <ActivityIndicator size="large" color="#2563eb" />
  //       <Text style={styles.loadingText}>휴가 정보를 불러오는 중...</Text>
  //     </View>
  //   );
  // }

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          dayComponent={({ date, state }) => {
            const isVacation = vacationLists.some((v) => v.start_date === date.dateString);
            return (
              <TouchableOpacity
                onPress={() => setSelectedDate(date.dateString)}
                style={styles.dayContainer}
              >
                <Text
                  style={[
                    styles.dayText,
                    state === 'disabled' && styles.disabledText,
                  ]}
                >
                  {date.day}
                </Text>
                {isVacation && (
                  <MaterialCommunityIcons
                    name="airplane"
                    size={16}
                    color="#1abc9c"
                    style={{ marginTop: 2 }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            todayTextColor: '#2563eb',
            dayTextColor: '#111',
            textDisabledColor: '#d9e1e8',
            arrowColor: '#2563eb',
            monthTextColor: '#2563eb',
            textMonthFontWeight: 'bold',
            textDayFontWeight: '500',
          }}
        />

        <TouchableOpacity style={styles.actionButton} onPress={toVacationRegister}>
          <View style={styles.actionContent}>
            <Icon name="plus" size={20} color="#2563eb" />
            <Text style={[styles.actionLabel, { color: '#2563eb' }]}>{t('vacationRegister')}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.vacationBox}>
          {selectedDate ? (
            vacationOfDay.length > 0 ? (
              <>
                <Text style={styles.vacationTitle}>
                  ✈️ {selectedDate} {t('vacationApprovalStatus')}
                </Text>
                {vacationOfDay.map((item, index) => (
                  <View key={index} style={styles.vacationItem}>
                    <Text style={styles.vacationName}>👤 {item.user.user_name}</Text>
                    <Text style={styles.vacationPeriod}>📅 {item.start_date} ~ {item.end_date}</Text>
                    <Text style={styles.vacationReason}>📝 {item.reason}</Text>
                    <Text style={[
                      styles.vacationState,
                      { color: getVacationStateColor(item.vacation_state) }
                    ]}>
                      상태: {getVacationStateText(item.vacation_state)}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.noVacation}>{t('noVacationerOnSelectedDate')}</Text>
            )
          ) : (
            <Text style={styles.noVacation}>{t('selectDateForVacationInfo')}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
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
  container: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  disabledText: {
    color: '#ccc',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginHorizontal: 16,
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
  vacationBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  vacationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },
  vacationItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  vacationName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  vacationPeriod: {
    fontSize: 13,
    marginBottom: 2,
    color: '#374151',
  },
  vacationReason: {
    fontSize: 13,
    color: '#6b7280',
  },
  vacationState: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
  noVacation: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default Calendars;