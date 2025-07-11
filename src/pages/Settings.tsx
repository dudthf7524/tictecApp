import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Settings = () => {
  return (
    <View style={styles.container} >
      <View style={styles.contentContainer}>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="user" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>프로필 설정</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="bell" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>알림 설정</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="lock" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>비밀번호 변경</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="info" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>앱 정보</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="log-out" size={20} color="#e74c3c" />
            <Text style={[styles.actionLabel, { color: '#e74c3c' }]}>로그아웃</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
});
