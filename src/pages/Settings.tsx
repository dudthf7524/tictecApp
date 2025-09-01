import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import userSlice from '../slices/user';
import { useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';

const Settings = React.memo(() => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const languages = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setModalVisible(false);
  };
  const onLogout = useCallback(async () => {
    try {
      await axios.post(`${Config.API_URL}/user/logout`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      Alert.alert(t('alert'), t('logoutSuccess'));
      dispatch(userSlice.actions.setUser({ name: '', email: '', accessToken: '' }));
      // @ts-ignore
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const err = error as AxiosError;
      console.error(err.response?.data || err.message);
    }
  }, [accessToken, dispatch, t]);
  return (
    <View style={styles.container}>

      <View style={styles.contentContainer}>
        {/* <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="user" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>{t('profileSettings')}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="bell" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>{t('notificationSettings')}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="lock" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>{t('passwordChange')}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
          <View style={styles.actionContent}>
            <Icon name="globe" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>{t('languageSettings')}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <Icon name="info" size={20} color="#4B5563" />
            <Text style={styles.actionLabel}>{t('appInfo')}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
          <View style={styles.actionContent}>
            <Icon name="log-out" size={20} color="#e74c3c" />
            <Text style={[styles.actionLabel, { color: '#e74c3c' }]}>{t('logout')}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="x" size={24} color="#333" />
            </TouchableOpacity>

            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={styles.languageOption}
                onPress={() => changeLanguage(language.code)}
              >
                <Text style={styles.languageOptionText}>{language.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
});

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    width: '100%',
    height: '90%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  languageOption: {
    padding: 10,
  },
  languageOptionText: {
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
});