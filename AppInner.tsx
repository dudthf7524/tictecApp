import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyInfo from './src/pages/MyInfo';
import { useState } from 'react';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Attendance from './src/pages/Attendance';
import MapScreen from './src/pages/MapScreen';
import TimeTable from './src/pages/TimeTable';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { useEffect } from 'react';
import { useAppDispatch } from './src/store';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import userSlice from './src/slices/user';

export type LoggedInParamList = {
    Orders: undefined;
    Settings: undefined;
    Delivery: undefined;
    Attendance: undefined;
    Complete: { orderId: string };
};

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    MapScreen: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();






function AppInner() {
    const dispatch = useAppDispatch();
    const [isAuthLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const getTokenAndRefresh = async () => {
            try {
                const token = await EncryptedStorage.getItem('refreshToken');
                if (!token) {
                    return;
                }
                const response = await axios.post(
                    `${Config.API_URL}/login/refreshToken`,
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    },
                );
                dispatch(
                    userSlice.actions.setUser({
                        user_code: response.data.data.user_code,
                        user_name: response.data.data.user_name,
                        accessToken: response.data.data.accessToken,
                    }),
                );
            } catch (error) {
                // console.error(error);
                // if (axios.isAxiosError(error)) {
                //     const code = error.response?.data?.code;

                //     if (code === 'expired') {
                //         Alert.alert('알림', '다시 로그인 해주세요.');
                //     } else {
                //         console.log('다른 코드:', code);
                //     }
                // } else {
                //     console.error('AxiosError가 아님:', error);
                // }
            } finally {
                // TODO: 스플래시 스크린 없애기
                setTimeout(() => {
                    setAuthLoading(false);
                }, 1000);
            }
        };
        getTokenAndRefresh();
    }, [dispatch]);

    // const [isLoggedIn, setLoggedIn] = useState(false);
    const isLoggedIn = useSelector((state: RootState) => !!state.user.accessToken);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const user_code = useSelector((state: RootState) => state.user.user_code);
    const user_name = useSelector((state: RootState) => state.user.user_name);

    console.log('isLoggedIn', isLoggedIn);
    console.log('accessToken', accessToken);
    console.log('user_code', user_code);
    console.log('user_name', user_name);

    if (isAuthLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                {/* <Image
                    source={require('./assets/logo.png')} // 앱 로고 이미지
                    style={{ width: 100, height: 100, marginBottom: 20 }}
                    resizeMode="contain"
                /> */}
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ marginTop: 15, fontSize: 16, color: '#555' }}>로그인 상태 확인 중입니다...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <Tab.Navigator>
                    {/* <Tab.Screen
            name="Orders"
            component={Orders}
            options={{
              title: '오더 목록',
              tabBarIcon: () => <FontAwesome5 name="list" size={20} />,
            }}
          /> */}
                    <Tab.Screen
                        name="Delivery"
                        component={TimeTable}
                        options={{
                            // headerShown: false,
                            title: '시간표',
                            headerTitleAlign: 'center',
                            tabBarIcon: () => <MaterialIcons name="access-time" size={20} />,
                        }}
                    />
                    <Tab.Screen
                        name="Attendance"
                        component={Attendance}
                        options={{
                            title: '출근/퇴근',
                            headerTitleAlign: 'center',
                            tabBarIcon: () => <MaterialIcons name="gps-fixed" size={20} />,
                            // unmountOnBlur: true,
                        }}
                    />
                    <Tab.Screen
                        name="Settings"
                        component={MyInfo}
                        options={{
                            title: '내 정보',
                            headerTitleAlign: 'center',
                            tabBarIcon: () => <FontAwesome6 name="chalkboard-user" size={20} />,
                            // unmountOnBlur: true,
                        }}
                    />
                    {/* <Tab.Screen
                        name="MapScreen"
                        component={MapScreen}
                        options={{
                            title: '지도',
                            tabBarIcon: () => <FontAwesome6 name="map" size={20} />,
                            // unmountOnBlur: true,
                        }}
                    /> */}


                </Tab.Navigator>
            ) : (
                <Stack.Navigator initialRouteName="SignIn">
                    <Stack.Screen
                        name="SignIn"
                        component={SignIn}
                        options={{ headerShown: false }} // 👈 헤더 없앰
                    />
                    <Stack.Screen
                        name="MapScreen"
                        component={MapScreen}
                        options={{
                            title: '지도',
                            headerTitleAlign: 'center', // ← 이걸 추가해야 중앙 정렬
                        }} />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{
                            title: '회원가입',
                            headerTitleAlign: 'center', // ← 이걸 추가해야 중앙 정렬
                        }}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}

export default AppInner;