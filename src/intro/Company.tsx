import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Company = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish(); // 2.5초 후 종료 콜백 호출
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <Animatable.Text animation="fadeIn" duration={1200} style={styles.title}>
                creamoff
            </Animatable.Text>
        </View>
    );
};

export default Company;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        color: '#000',
        fontWeight: 'bold',
    },
});
