// pages/Attendance.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Config from 'react-native-config';
import { useAppDispatch } from '../store';
import axios, { AxiosError } from 'axios';
import timeSlice from '../slices/time';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from '../slices/user';
import attendanceSlice from '../slices/attendance';

// import BottomBar from '../components/BottomBar'; // 하단 네비게이션 바
// import MyLocation from './MyLocation'; // 위치 모달 컴포넌트
// import Today from '../components/Today';
// import {
//   TIME_DETAIL_REQUEST,
//   ATTENDANCE_TODAY_REQUEST,
//   ATTENDANCE_REGISTER_REQUEST,
//   ATTENDANCE_UPDATE_REQUEST,
// } from '../reducers/attendanceActions';

// const timeDetail = {
//     start_time: "09:00",
//     end_time: "18:00",
//     rest_start_time: "12:00",
//     rest_end_time: "13:00"
// }

// const attendanceToday = {
//     attendance_start_date: "2025-07-07",
//     attendance_start_time: "09:00",
//     attendance_end_date: "2025-07-07",
//     attendance_end_time: "12:00",
// }

const TimeTable = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const timeDetail = useSelector((state: RootState) => state.time.timeDetail);
    const attendanceToday = useSelector((state: RootState) => state.attendance.attendanceToday);

    console.log(timeDetail)
    console.log(attendanceToday)

    const dispatch = useAppDispatch();

    useEffect(() => {
        async function getTimeDetail() {
            try {
                const response = await axios.get(
                    `${Config.API_URL}/app/time/detail`,
                    {
                        headers: { authorization: `Bearer ${accessToken}` },
                    },
                );
                dispatch(timeSlice.actions.getTime(response.data));
            } catch (error) {
                console.error('시간 정보 불러오기 실패:', error);
                const errorResponse = (error as AxiosError<{ message: string }>).response;
                console.error(errorResponse?.status)
                if (errorResponse?.status === 419) {
                    const token = await EncryptedStorage.getItem('refreshToken');
                    console.log(token)
                    if (!token) {
                        Alert.alert('알림', '로그아웃 되었습니다.');
                        return;
                    }

                    const response = await axios.post(
                        `${Config.API_URL}/login/refreshToken`,
                        {},
                        {
                            headers: { authorization: `Bearer ${token}` },
                        }
                    );

                    dispatch(
                        userSlice.actions.setUser({
                            user_code: response.data.data.user_code,
                            user_name: response.data.data.user_name,
                            accessToken: response.data.data.accessToken,
                        })
                    );
                }
            }
        }

        getTimeDetail();
    }, [accessToken, dispatch]);

    useEffect(() => {
        async function getAttendanceToday() {
            try {
                const response = await axios.get(
                    `${Config.API_URL}/app/attendance/today`,
                    {
                        headers: { authorization: `Bearer ${accessToken}` },
                    },
                );
                dispatch(attendanceSlice.actions.getAttendanceToday(response.data));
            } catch (error) {
                console.error('시간 정보 불러오기 실패:', error);
                const errorResponse = (error as AxiosError<{ message: string }>).response;
                console.error(errorResponse?.status)
                if (errorResponse?.status === 419) {
                    const token = await EncryptedStorage.getItem('refreshToken');
                    console.log(token)
                    if (!token) {
                        Alert.alert('알림', '로그아웃 되었습니다.');
                        return;
                    }

                    const response = await axios.post(
                        `${Config.API_URL}/login/refreshToken`,
                        {},
                        {
                            headers: { authorization: `Bearer ${token}` },
                        }
                    );

                    dispatch(
                        userSlice.actions.setUser({
                            user_code: response.data.data.user_code,
                            user_name: response.data.data.user_name,
                            accessToken: response.data.data.accessToken,
                        })
                    );
                }
            }
        }

        getAttendanceToday();
    }, [accessToken, dispatch]);


    const [showLocationModal, setShowLocationModal] = useState(false);

    //   const { timeDetail } = useSelector((state: any) => state.time);
    //   const { attendanceToday } = useSelector((state: any) => state.attendance);

    //   useEffect(() => {
    //     dispatch({ type: TIME_DETAIL_REQUEST });
    //     dispatch({ type: ATTENDANCE_TODAY_REQUEST });
    //   }, []);

    //   const handleCheckIn = () => {
    //     if (!timeDetail) return Alert.alert('알림', '출근 시간이 설정되지 않았습니다.');
    //     if (attendanceToday?.attendance_id) return Alert.alert('알림', '이미 출근 기록이 있습니다.');

    //     const now = dayjs();
    //     const attendance_start_time = now.format('HH:mm');
    //     const attendance_start_state =
    //       timeDetail?.start_time < attendance_start_time ? '지각' : '정상';

    //     const data = {
    //       attendance_start_date: now.format('YYYY-MM-DD'),
    //       attendance_start_time,
    //       attendance_start_state,
    //       start_time: timeDetail.start_time,
    //       rest_start_time: timeDetail.rest_start_time,
    //       rest_end_time: timeDetail.rest_end_time,
    //     };

    //     dispatch({ type: ATTENDANCE_REGISTER_REQUEST, data });
    //   };

    //   const handleCheckOut = () => {
    //     if (!timeDetail) return Alert.alert('알림', '퇴근 시간이 설정되지 않았습니다.');
    //     const now = dayjs();
    //     const data = {
    //       attendance_id: attendanceToday?.attendance_id,
    //       attendance_end_date: now.format('YYYY-MM-DD'),
    //       attendance_end_time: now.format('HH:mm'),
    //       attendance_end_state: '퇴근',
    //     };
    //     dispatch({ type: ATTENDANCE_UPDATE_REQUEST, data });
    //   };

    //   const hasStarted = !!attendanceToday?.attendance_start_time;
    //   const hasEnded = !!attendanceToday?.attendance_end_time;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.timeInfoBox}>
                    <InfoBlock title="출근 시간" value={timeDetail?.start_time || '출근시간 미정'} />
                    <InfoBlock title="퇴근 시간" value={timeDetail?.end_time || '퇴근시간 미정'} />
                    <InfoBlock
                        title="휴게 시간"
                        value={
                            timeDetail?.rest_start_time && timeDetail?.rest_end_time
                                ? `${timeDetail.rest_start_time} ~ ${timeDetail.rest_end_time}`
                                : '휴게시간 미정'
                        }
                    />
                </View>

                <View style={styles.recordBox}>
                    <InfoBlock title="출근 날짜" value={attendanceToday?.attendance_start_date || '출근 전'} />
                    <InfoBlock title="출근 시간" value={attendanceToday?.attendance_start_time || '출근 전'} />
                    <InfoBlock title="퇴근 날짜" value={attendanceToday?.attendance_end_date || '퇴근 전'} />
                    <InfoBlock title="퇴근 시간" value={attendanceToday?.attendance_end_time || '퇴근 전'} />
                </View>
            </ScrollView>
        </View>
    );
};

// const InfoBlock = ({ title, value }: { title: string; value: string }) => (
//     <View style={{ marginBottom: 12 }}>
//         <Text style={styles.infoTitle}>{title}</Text>
//         <Text style={styles.infoValue}>{value}</Text>
//     </View>
// );

const InfoBlock = ({ title, value }: { title: string; value: string }) => (
    <View style={styles.infoBlock}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    noticeBox: {
        backgroundColor: '#e0edff',
        borderColor: '#90caff',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    noticeText: { color: '#2563eb', fontSize: 14 },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: '#2563eb',
        borderRadius: 6,
        padding: 12,
        marginBottom: 20,
    },
    locationText: {
        color: '#2563eb',
        fontWeight: '500',
        fontSize: 14,
    },
    infoBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeInfoBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,

        justifyContent: 'space-between',

    },
    recordBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        justifyContent: 'space-between',

    },
    infoTitle: {
        fontSize: 12,
        color: '#6b7280',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    active: {
        borderColor: '#2563eb',
        backgroundColor: '#fff',
    },
    disabled: {
        borderColor: '#ccc',
        backgroundColor: '#f3f4f6',
    },
    buttonText: {
        color: '#2563eb',
        fontWeight: '600',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        height: '90%',
    },
});

export default TimeTable;
