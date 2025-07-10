import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyInfo from './src/pages/MyInfo';
import { useState, useEffect } from 'react';
import SignIn from './src/pages/SignIn';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Attendance from './src/pages/Attendance';
import MapScreen from './src/pages/MapScreen';
import TimeTable from './src/pages/TimeTable';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { useAppDispatch } from './src/store';
import { ActivityIndicator, Alert, StatusBar, Text, View } from 'react-native';
import userSlice from './src/slices/user';
import Company from './src/intro/Company';
import Project from './src/intro/Project';
import Calendars from './src/pages/Calendars';
import Settings from './src/pages/Settings';

// 네비게이터 타입 정의
export type RootStackParamList = {
    SignIn: undefined;
    MainTabs: undefined;
    MapScreen: undefined;
    TimeTable: undefined;
};

// export type MainTabParamList = {
//     TimeTable: undefined;
//     Attendance: undefined;
//     Settings: undefined;
//     MapScreen: { lat: number; lng: number }; // 예: 지도에 좌표 전달
// };

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#888888',
                headerStyle: {
                    backgroundColor: '#2563eb', // ✅ 헤더 배경색
                },
                headerTintColor: '#ffffff', // ✅ 헤더 타이틀과 아이콘 색 (뒤로가기 화살표 등)
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
            }}>
            <Tab.Screen
                name="TimeTable"
                component={TimeTable}
                options={{
                    title: '시간표',
                    headerTitleAlign: 'center',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => <MaterialIcons name="access-time" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="Attendance"
                component={Attendance}
                options={{
                    title: '출근/퇴근',
                    headerTitleAlign: 'center',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => <MaterialIcons name="gps-fixed" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="MyInfo"
                component={MyInfo}
                options={{
                    title: '내 정보',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color }) => <FontAwesome6 name="chalkboard-user" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="Calendars"
                component={Calendars}
                options={{
                    title: '달력',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: '설정',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color }) => <Feather name="settings" size={20} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

function AppInner() {
    const dispatch = useAppDispatch();
    const [isAuthLoading, setAuthLoading] = useState(true);
    const [ProjectIntro, setProjectIntro] = useState(true);
    const isLoggedIn = useSelector((state: RootState) => !!state.user.accessToken);
    const [introStep, setIntroStep] = useState<'company' | 'project' | 'done'>('company');

    useEffect(() => {
        axios.interceptors.response.use(
            response => {
                console.log(response);
                return response;
            },
            async error => {
                const { config, response: { status } } = error;
                console.log(error)
                if (status === 419) {
                    if (error.response.data.code === 'expired') {
                        const originalRequest = config;
                        const refreshToken = await EncryptedStorage.getItem('refreshToken');
                        if (!refreshToken) return;
                        const { data } = await axios.post(
                            `${Config.API_URL}/login/refreshToken`,
                            {},
                            {
                                headers: { authorization: `Bearer ${refreshToken}` },
                            }
                        );
                        // 토큰 재발급
                        dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
                        // 원래 요청
                        originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
                        return axios(originalRequest);
                    }
                }
                // 419에러 외에는 기존읜 catch(error)로
                return Promise.reject(error);
            }
        )
    })

    useEffect(() => {
        if (introStep !== 'done') return;
        const getTokenAndRefresh = async () => {
            try {
                const refreshToken = await EncryptedStorage.getItem('refreshToken');
                if (!refreshToken) return;

                const response = await axios.post(
                    `${Config.API_URL}/login/refreshToken`,
                    {},
                    {
                        headers: { authorization: `Bearer ${refreshToken}` },
                    }
                );

                dispatch(
                    userSlice.actions.setUser({
                        user_code: response.data.data.user_code,
                        user_name: response.data.data.user_name,
                        accessToken: response.data.data.accessToken,
                    })
                );
            } catch (error) {
                // Alert.alert('알림', '로그인 세션이 만료되었습니다.');
            } finally {
                setTimeout(() => setAuthLoading(false), 1000);
            }
        };

        getTokenAndRefresh();
    }, [dispatch, introStep]);

    if (introStep === 'company') {
        return <Company onFinish={() => setIntroStep('project')} />;
    }

    if (introStep === 'project') {
        return <Project onFinish={() => setIntroStep('done')} />;
    }

    if (introStep === 'done' && isAuthLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ marginTop: 15, fontSize: 16, color: '#555' }}>로그인 상태 확인 중입니다...</Text>
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
            <NavigationContainer>
                <RootStack.Navigator>
                    {isLoggedIn ? (
                        <>
                            <RootStack.Screen
                                name="MainTabs"
                                component={MainTabs}
                                options={{ headerShown: false }}
                            />
                            <RootStack.Screen
                                name="MapScreen"
                                component={MapScreen}
                                options={{
                                    title: '지도',
                                    headerTitleAlign: 'center',
                                    headerStyle: { backgroundColor: '#2563eb' },
                                    headerTintColor: '#ffffff',
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <RootStack.Screen
                                name="SignIn"
                                component={SignIn}
                                options={{ headerShown: false }}
                            />
                            <RootStack.Screen
                                name="MapScreen"
                                component={MapScreen}
                                options={{ title: '지도', headerTitleAlign: 'center' }}
                            />
                        </>
                    )}
                </RootStack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default AppInner;
