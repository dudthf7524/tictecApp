// components/MapScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type LatLng = {
  latitude: number;
  longitude: number;
};

const COMPANY_LOCATION = {
  latitude: 35.824364,
  longitude: 128.756343,
};

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  console.log(userLocation)
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('위치 권한이 없습니다.');
          return;
        }
      }
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('aaaaaaaaa')
          console.log(latitude)
          console.log(longitude)


          setUserLocation({ latitude, longitude });
        },
        error => {
          console.error(error);
        },
        // { enableHighAccuracy: true, timeout: 15000 },
      );
    };

    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      <MapView
        style={styles.map}
        region={{
          latitude: COMPANY_LOCATION.latitude, // ❗undefined일 수 있음
          longitude: COMPANY_LOCATION.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {/* 회사 위치 마커 + 반경 */}
        {/* <Marker coordinate={COMPANY_LOCATION} title="회사 위치" />
        <Circle
          center={COMPANY_LOCATION}
          radius={100} // 100m 반경
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.2)"
        /> */}

        <Marker coordinate={COMPANY_LOCATION}>
          <FontAwesome name="building" size={30} color="blue" />
        </Marker>
        <Circle
          center={COMPANY_LOCATION}
          radius={100} // 100m 반경
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.2)"
        />

        {/* 사용자 위치 마커 + 반경 */}
        {userLocation && (
          <>
            {/* <Marker coordinate={userLocation} title="내 위치" pinColor="green" /> */}
            <Marker coordinate={userLocation}>
              <FontAwesome name="user" size={30} color="green" />
            </Marker>
            <Circle
              center={userLocation}
              radius={50}
              strokeColor="rgba(0,128,0,0.5)"
              fillColor="rgba(0,255,0,0.2)"
            />
          </>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
