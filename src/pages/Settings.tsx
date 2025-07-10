import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Settings = () => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.item}>
        <Icon name="user" size={20} color="#555" />
        <Text style={styles.itemText}>프로필 설정</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Icon name="bell" size={20} color="#555" />
        <Text style={styles.itemText}>알림 설정</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Icon name="lock" size={20} color="#555" />
        <Text style={styles.itemText}>비밀번호 변경</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Icon name="info" size={20} color="#555" />
        <Text style={styles.itemText}>앱 정보</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Icon name="log-out" size={20} color="#e74c3c" />
        <Text style={[styles.itemText, { color: '#e74c3c' }]}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});
