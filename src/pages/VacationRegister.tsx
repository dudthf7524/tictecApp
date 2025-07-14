import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/Feather';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList>;
const VacationRegister = ({ navigation }: SignInScreenProps) => {
    const { t } = useTranslation();
    const accessToken = useSelector((state: RootState) => state.user.accessToken);

    const [form, setForm] = useState({
        reason: '',
        startDate: '',
        endDate: '',
    });

    const [pickerType, setPickerType] = useState<'start' | 'end' | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = (type: 'start' | 'end') => {
        setPickerType(type);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        const formatted = dayjs(date).format('YYYY-MM-DD');
        if (pickerType === 'start') {
            setForm((prev) => ({ ...prev, startDate: formatted }));
        } else {
            setForm((prev) => ({ ...prev, endDate: formatted }));
        }
        hideDatePicker();
    };

    // const handleRegister = () => {
    //     const { reason, startDate, endDate } = form;

    //     if (!reason || !startDate || !endDate) {
    //         Alert.alert('오류', '모든 항목을 입력해주세요.');
    //         return;
    //     }

    //     Alert.alert('등록 완료', `${startDate} ~ ${endDate}\n사유: ${reason}`);
    //     setForm({ reason: '', startDate: '', endDate: '' });
    // };

    const handleRegister = useCallback(async () => {

        if (!form.startDate || !form.startDate.trim()) {
            return Alert.alert(t('alert'), t('startDateRequired'));
        }
        if (!form.endDate || !form.endDate.trim()) {
            return Alert.alert(t('alert'), t('endDateRequired'));
        }
        if (!form.reason || !form.reason.trim()) {
            return Alert.alert(t('alert'), t('reasonRequired'));
        }
        
        try {

            const response = await axios.post(`${Config.API_URL}/app/vacation/register`, {
                startDate: form.startDate,
                endDate: form.endDate,
                reason: form.reason,
            },
                {
                    headers: { authorization: `Bearer ${accessToken}` },
                }
            );
            if(response.data){
                Alert.alert(t('alert'), t('vacationRegistrationComplete'));
                navigation.navigate('Calendars')
            }

        } catch (error) {
            const errorResponse = (error as AxiosError<{ message: string }>).response;
            if (errorResponse) {
                Alert.alert(t('alert'), errorResponse.data.message);
            }
        } finally {

        }
    }, [form.startDate, form.endDate, form.reason, t]);

    return (
        <View style={styles.container}>
            {/* 시작일 */}
            <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.label}>{t('startDate')}</Text>
                <TouchableOpacity style={styles.input} onPress={() => showDatePicker('start')}>
                    <Text style={!form.startDate ? styles.placeholderText : styles.filledText}>
                        {form.startDate || t('selectStartDate')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 종료일 */}
            <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.label}>{t('endDate')}</Text>
                <TouchableOpacity style={styles.input} onPress={() => showDatePicker('end')}>
                    <Text style={!form.endDate ? styles.placeholderText : styles.filledText}>
                        {form.endDate || t('selectEndDate')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 사유 */}
            <View style={[styles.section, { flex: 6 }]}>
                <Text style={styles.label}>{t('reason')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder={t('enterReason')}
                    placeholderTextColor="#9ca3af"
                    value={form.reason}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, reason: text }))}
                    multiline
                    textAlignVertical="top"
                />
            </View>

            {/* Date Picker */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                locale="en"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />

            {/* 등록 버튼 */}
            <View style={[styles.section, { flex: 2, justifyContent: 'center' }]}>
                <TouchableOpacity style={styles.actionButton} onPress={handleRegister}>
                    <View style={styles.actionContent}>
                        <Icon name="check-circle" size={20} color="#2563eb" />
                        <Text style={styles.actionLabel}>{t('vacationRegister')}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VacationRegister;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fffff',
    },
    textArea: {
        height: '100%',
        minHeight: 120,
    },
    placeholderText: {
        color: '#9ca3af',
    },
    filledText: {
        color: '#111827',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 14,
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
