import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Project = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish(); // 2.5초 후 종료 콜백 호출
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
            <Animatable.Text animation="fadeInDown" duration={1000} style={styles.title}>
                tictec
            </Animatable.Text>
            <Animatable.Image
                source={require('../assets/pointerLogo.png')} // 실제 로고 경로
                style={styles.logo}
                resizeMode="contain"
            />
            <Animatable.Text animation="fadeInUp" delay={500} duration={1000} style={styles.subtitle}>
                출결 관리 솔루션
            </Animatable.Text>
        </View>
    );
};

export default Project;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
    },
    logo: {
        width: 120,
        height: 120,
    },
});
