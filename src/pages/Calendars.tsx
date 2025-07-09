import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type VacationInfo = {
  name: string;
  reason: string;
  period: string;
  date: string; // 'YYYY-MM-DD'
};

const Calendars = () => {
  const vacationList: VacationInfo[] = [
    {
      name: '김철수',
      reason: '가족 여행',
      period: '2025-07-15 ~ 2025-07-16',
      date: '2025-07-15',
    },
    {
      name: '이영희',
      reason: '개인 사정',
      period: '2025-07-15 ~ 2025-07-15',
      date: '2025-07-15',
    },
    {
      name: '이영희',
      reason: '개인 사정',
      period: '2025-07-15 ~ 2025-07-15',
      date: '2025-07-15',
    },
    {
      name: '이영희',
      reason: '개인 사정',
      period: '2025-07-15 ~ 2025-07-15',
      date: '2025-07-15',
    },
    {
      name: '이영희',
      reason: '개인 사정',
      period: '2025-07-15 ~ 2025-07-15',
      date: '2025-07-15',
    },
    {
      name: '이영희',
      reason: '개인 사정',
      period: '2025-07-15 ~ 2025-07-15',
      date: '2025-07-15',
    },
    {
      name: '박지민',
      reason: '휴식',
      period: '2025-07-22 ~ 2025-07-22',
      date: '2025-07-22',
    },
  ];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const markedDates = vacationList.reduce((acc, cur) => {
    acc[cur.date] = { marked: true, dotColor: '#1abc9c' };
    return acc;
  }, {} as { [key: string]: any });

  const vacationOfDay = vacationList.filter((item) => item.date === selectedDate);

  return (
    <ScrollView style={styles.wrapper}>

      <View style={styles.container}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...markedDates,
            ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#2563eb' } } : {}),
          }}
          dayComponent={({ date, state }) => {
            const isVacation = vacationList.some((v) => v.date === date.dateString);

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

        <View style={styles.vacationBox}>
          {selectedDate ? (
            vacationOfDay.length > 0 ? (
              <>
                <Text style={styles.vacationTitle}>
                  ✈️ {selectedDate} 휴가자 목록
                </Text>
                {vacationOfDay.map((item, index) => (
                  <View key={index} style={styles.vacationItem}>
                    <Text style={styles.vacationName}>👤 {item.name}</Text>
                    <Text style={styles.vacationPeriod}>📅 {item.period}</Text>
                    <Text style={styles.vacationReason}>📝 {item.reason}</Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.noVacation}>선택한 날짜에 휴가자가 없습니다.</Text>
            )
          ) : (
            <Text style={styles.noVacation}>날짜를 선택하면 휴가 정보를 볼 수 있어요.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
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
  noVacation: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default Calendars;
