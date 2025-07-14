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
import VacationRegister from './src/pages/VacationRegister';
import { useTranslation } from 'react-i18next';

// 네비게이터 타입 정의
export type RootStackParamList = {
    SignIn: undefined;
    MainTabs: undefined;
    MapScreen: undefined;
    TimeTable: undefined;
    VacationRegister: undefined;
    Calendars:undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#888888',
                headerStyle: {
                    backgroundColor: '#ffffff',
                },
                headerShadowVisible: false,
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
                // 언마운트 비활성화로 부드러운 전환
                unmountOnBlur: false,
                // 부드러운 전환을 위한 애니메이션 설정
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                // 탭 전환 애니메이션 개선
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}>
            <Tab.Screen
                name="TimeTable"
                component={TimeTable}
                options={{
                    title: t('timeTable'),
                    headerTitleAlign: 'center',
                    unmountOnBlur: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="access-time" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="Attendance"
                component={Attendance}
                options={{
                    title: t('attendance'),
                    headerTitleAlign: 'center',
                    unmountOnBlur: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="gps-fixed" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="MyInfo"
                component={MyInfo}
                options={{
                    title: t('myInfo'),
                    headerTitleAlign: 'center',
                    unmountOnBlur: false,
                    tabBarIcon: ({ color }) => <FontAwesome6 name="chalkboard-user" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="Calendars"
                component={Calendars}
                options={{
                    title: t('vacation'),
                    headerTitleAlign: 'center',
                    unmountOnBlur: false,
                    tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: t('settings'),
                    headerTitleAlign: 'center',
                    unmountOnBlur: false,
                    tabBarIcon: ({ color }) => <Feather name="settings" size={20} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

function AppInner() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [isAuthLoading, setAuthLoading] = useState(true);
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
            },
        );

        // return () => {
        //     axios.interceptors.response.eject(interceptor);
        //   };
    }, [dispatch]);

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
                console.warn('Refresh token expired or invalid:', error);
                await EncryptedStorage.removeItem('refreshToken'); // 만료된 토큰 삭제
                Alert.alert('로그인 만료', '세션이 만료되어 다시 로그인해주세요.');
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
                                title: t('map'),
                                headerBackTitleVisible: false,
                                headerTitleAlign: 'center',
                                headerShadowVisible: false,
                            }}
                        />
                        <RootStack.Screen
                            name="VacationRegister"
                            component={VacationRegister}
                            options={{
                                title: t('vacationRegister'),
                                headerBackTitleVisible: false,
                                headerTitleAlign: 'center',
                                headerShadowVisible: false,

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
                        {/* <RootStack.Screen
                                name="MapScreen"
                                component={MapScreen}
                                options={{ title: '지도', headerTitleAlign: 'center' }}
                            /> */}
                    </>
                )}
            </RootStack.Navigator>
        </>
    );
}

export default AppInner;