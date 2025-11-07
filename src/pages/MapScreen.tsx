// components/MapScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, StatusBar, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Config from 'react-native-config';
import axios from 'axios';
import { useAppDispatch } from '../store';
import workPlaceSlice from '../slices/workPlace';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';

type LatLng = {
  latitude: number;
  longitude: number;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();
  const workPlaceDetail = useSelector((state: RootState) => state.workPlace.workPlaceDetail);
  const navigation = useNavigation<NavigationProp>();

  // 두 좌표 간 거리 계산 함수 (미터 단위)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // 지구의 반지름 (미터)
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const workPlaceData = useCallback(async () => {
    const response = await axios.get(`${Config.API_URL}/app/workPlace/detail`, {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    // console.log("response data", response.data)
    dispatch(workPlaceSlice.actions.getworkPlace(response.data));
  }, [dispatch, accessToken])

  useFocusEffect(
    useCallback(() => {
      workPlaceData();
    }, [workPlaceData])
  );
console.log(workPlaceDetail)

const COMPANY_LOCATION = {
  latitude: Number(workPlaceDetail?.location_latitude) || 35.824364,
  longitude: Number(workPlaceDetail?.location_hardness) || 128.756343,
};
  // console.log(userLocation)
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
          
          // 회사 위치와 사용자 위치 간 거리 계산
          if (workPlaceDetail?.location_latitude && workPlaceDetail?.location_hardness) {
            const distance = calculateDistance(
              latitude,
              longitude,
              workPlaceDetail.location_latitude,
              workPlaceDetail.location_hardness
            );
            
            const radius = workPlaceDetail.radius || 100;
            setIsWithinRadius(distance <= radius);
          }
        },
        error => {
          console.error(error);
        },
        // { enableHighAccuracy: true, timeout: 15000 },
      );
    };

    requestPermission();
  }, []);

  // workPlaceDetail이 변경될 때 거리 재계산
  useEffect(() => {
    if (userLocation && workPlaceDetail?.location_latitude && workPlaceDetail?.location_hardness) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        workPlaceDetail.location_latitude,
        workPlaceDetail.location_hardness
      );
      
      const radius = workPlaceDetail.radius || 100;
      setIsWithinRadius(distance <= radius);
    }
  }, [userLocation, workPlaceDetail]);

  const navigateToAttendance = () => {
    if (userLocation && workPlaceDetail?.location_latitude && workPlaceDetail?.location_hardness) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        workPlaceDetail.location_latitude,
        workPlaceDetail.location_hardness
      );
      
      const radius = workPlaceDetail.radius || 100;
      const withinRadius = distance <= radius;
      
      // Redux에 위치 상태 저장
      dispatch(workPlaceSlice.actions.setIsWithinRadius(withinRadius));
      
      if (withinRadius) {
        Alert.alert(
          '위치 확인 완료',
          '회사 반경 안에 위치해 있습니다. 출근/퇴근 페이지로 이동합니다.',
          [{ text: '확인', onPress: () => navigation.navigate('Attendance') }]
        );
      } else {
        Alert.alert(
          '위치 확인 실패',
          '회사 반경 밖에 위치해 있습니다. 회사 근처에서 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      }
    } else {
      Alert.alert(
        '오류',
        '위치 정보를 확인할 수 없습니다.',
        [{ text: '확인' }]
      );
    }
  };

  return (
    <View style={styles.container}>
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
          radius={workPlaceDetail?.radius} // 100m 반경
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
      
      {/* GPS 설정 버튼 - 회사 반경 안에 있을 때만 표시 */}
      {isWithinRadius && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={styles.gpsButton} 
            onPress={navigateToAttendance}
          >
            <FontAwesome name="map-marker" size={20} color="#fff" />
            <Text style={styles.gpsButtonText}>출근/퇴근 하기</Text>
          </TouchableOpacity>
        </View>
      )}
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
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  gpsButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: 8,
  },
  gpsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapScreen;
