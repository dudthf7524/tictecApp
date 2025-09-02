import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import { RootStackParamList } from '../../AppInner';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import { useTranslation } from 'react-i18next';
import StaticKeyboardView from '../components/StaticKeyboardView';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({ navigation }: SignInScreenProps) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const languages = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'zh', label: '中文' },
    { code: 'vi', label: 'Tiếng Việt' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setModalVisible(false);
  };

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if (!email) {
      return Alert.alert(t('alert'), t('emailRequired'));
    }
    if (!password) {
      return Alert.alert(t('alert'), t('passwordRequired'));
    }
    try {
      console.log(Config.API_URL)
      const response = await axios.post(`${Config.API_URL}/login/aaa`, {
        user_id: email,
        user_password: password,
      });
      Alert.alert(t('alert'), t('loginSuccess'));
      dispatch(
        userSlice.actions.setUser({
          user_code: response.data.data.user_code,
          user_name: response.data.data.user_name,
          accessToken: response.data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      );

    } catch (error) {
      const errorResponse = (error as AxiosError<{ message: string }>).response;
      if (errorResponse) {
        Alert.alert(t('alert'), errorResponse.data.message);
      }
    }
  }, [email, password, t, dispatch]);

  const canGoNext = email && password;

  return (
    <StaticKeyboardView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('signIn')}</Text>
          <TouchableOpacity style={styles.languageButtonContainer} onPress={() => setModalVisible(true)}>
            <Text style={styles.languageButton}>🌐</Text>
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

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('emailPlaceholder')}
            placeholderTextColor="#888"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            returnKeyType="next"
            onChangeText={onChangeEmail}
            onSubmitEditing={() => passwordRef.current?.focus()}
            ref={emailRef}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t('password')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('passwordPlaceholder')}
            placeholderTextColor="#888"
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            value={password}
            onChangeText={onChangePassword}
            returnKeyType="done"
            ref={passwordRef}
            onSubmitEditing={onSubmit}
          />
        </View>

        <View style={styles.buttonZone}>
          <Pressable
            style={[
              styles.loginButton,
              canGoNext && styles.loginButtonActive,
            ]}
            onPress={onSubmit}
            disabled={!canGoNext}
          >
            <Text style={styles.loginButtonText}>{t('signIn')}</Text>
          </Pressable>
        </View>
      </View>
    </StaticKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  languageButtonContainer: {
    position: 'absolute',
    right: 0,
  },
  languageButton: {
    fontSize: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
  },
  buttonZone: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#cbd5e1',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonActive: {
    backgroundColor: '#2563eb',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  languageOption: {
    padding: 10,
  },
  languageOptionText: {
    fontSize: 18,
  }
});

export default SignIn;