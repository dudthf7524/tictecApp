import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const Today = () => {
    const { t, i18n } = useTranslation();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const days = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const date = String(currentTime.getDate()).padStart(2, '0');
    const day = days[currentTime.getDay()];
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    
    const formattedDate = i18n.language === 'en' 
        ? `${day}, ${month}/${date}/${year}` 
        : `${year}${t('year')} ${month}${t('month')} ${date}${t('date')} (${day})`;

    const formattedTime = i18n.language === 'en'
        ? `${hours}:${minutes}:${seconds}`
        : `${hours}${t('hour')} ${minutes}${t('minute')} ${seconds}${t('second')}`;

    return (
        <View style={styles.container}>
            <Text style={styles.dateText}>
                {formattedDate}
            </Text>
            <Text style={styles.subText}>{t('currentTime')}</Text>
            <Text style={styles.timeText}>{formattedTime}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        flex: 1
    },
    dateText: {
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151',
        fontSize: 16,
    },
    subText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    timeText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2563eb',
        marginTop: 4,
    },
});

export default Today;