import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import { RootStackParamList } from '../../AppInner';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if (!email) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      console.log(Config.API_URL)
      const response = await axios.post(`${Config.API_URL}/login/aaa`, {
        user_id: email,
        user_password: password,
      });
      Alert.alert('알림', '로그인 되었습니다.');
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
        Alert.alert('알림', errorResponse.data.message);
      }
    }
    // Alert.alert('로그인 완료', `${email}님 환영합니다!`);
    // navigation.navigate('SignUp');
  }, [email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const canGoNext = email && password;

  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <Text style={styles.title}>로그인</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.textInput}
            placeholder="이메일을 입력해주세요"
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
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.textInput}
            placeholder="비밀번호를 입력해주세요"
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
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>

          <Pressable onPress={toSignUp}>
            <Text style={styles.signUpText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 40,
    textAlign: 'center',
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
  signUpText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SignIn;