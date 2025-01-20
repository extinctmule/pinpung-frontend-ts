/* 사용자 위치를 기반으로 AI 맵을 로드하고, AI 맵 이동 시 카페목록 갱신 */
/* global kakao */
/* eslint react-hooks/exhaustive-deps: "off" */

import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLocation } from '../../api/locationApi';
import useAIRecommendCafes from '../../hooks/useAIRecommendCafes';
import useStore from '../../store/store';
import AICafeMarker from './AICafeMarker';
import { debounce } from 'lodash';

const AIMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const navigate = useNavigate();

  const userLocation = useStore((state) => state.userLocation);
  const setUserLocation = useStore((state) => state.setUserLocation);
  const mapRect = useStore((state) => state.mapRect);
  const setMapRect = useStore((state) => state.setMapRect);
  const mapLevel = useStore((state) => state.mapLevel);
  const setMapLevel = useStore((state) => state.setMapLevel);
  const moveToLocation = useStore((state) => state.moveToLocation);
  const setMoveToLocation = useStore((state) => state.setMoveToLocation);

  // AI추천 카페 목록 상태
  const showSheet = useStore((state) => state.showSheet);
  const setShowSheet = useStore((state) => state.setShowSheet);

  const { data, isLoading, error, refetch } = useAIRecommendCafes(
    mapRect?.swLng,
    mapRect?.swLat,
    mapRect?.neLng,
    mapRect?.neLat,
    userLocation?.longitude,
    userLocation?.latitude,
  );

  const aiCafes = data?.places || [];

  const fetchAndSetUserLocation = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation({ latitude: location.latitude, longitude: location.longitude });
    } catch (error) {
      console.error('위치 정보를 가져오는 중 오류 발생', error);
    }
  };

  const updateMapRect = useCallback(
    (map) => {
      const rect = map.getBounds();
      const sw = rect.getSouthWest();
      const ne = rect.getNorthEast();
      setMapRect({
        swLng: sw.getLng(),
        swLat: sw.getLat(),
        neLng: ne.getLng(),
        neLat: ne.getLat(),
      });
    },
    [setMapRect],
  );

  // 맵 변경 이벤트 처리
  const handleMapChange = useCallback(() => {
    if (mapInstance.current) {
      const newLevel = mapInstance.current.getLevel();
      setMapLevel(newLevel);
      updateMapRect(mapInstance.current);
    }
  }, [setMapLevel, updateMapRect]);

  const handleMapClick = () => {
    if (showSheet) {
      setShowSheet(false);
      navigate('/ai-home');
    }
  };

  const initializeMap = useCallback(() => {
    const container = mapRef.current;
    const initialLevel = mapLevel ?? 3; // mapLevel 없으면 3으로
    let map;

    if (mapRect) {
      // 이전 상태 복원: 중심 좌표와 레벨 설정하자..
      const centerLat = (mapRect.swLat + mapRect.neLat) / 2;
      const centerLng = (mapRect.swLng + mapRect.neLng) / 2;

      map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(centerLat, centerLng),
        level: initialLevel,
      });
    } else {
      // userLocation 기반 초기화
      if (!userLocation) return; // 유저 위치 없으면 대기

      map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
        level: initialLevel,
      });
    }

    mapInstance.current = map;

    // 맵 이벤트 등록
    registerMapEvents(map);

    // 초기 상태 저장 (처음 로드 시만 호출)
    if (!mapRect) updateMapRect(map);

    return () => cleanupMapEvents(map);
  }, [userLocation, mapLevel]);

  // 맵 이벤트 등록 함수
  const registerMapEvents = (map) => {
    kakao.maps.event.addListener(map, 'dragend', debounce(handleMapChange, 200));
    kakao.maps.event.addListener(map, 'zoom_changed', debounce(handleMapChange, 200));
    kakao.maps.event.addListener(map, 'click', handleMapClick);
  };

  // 맵 이벤트 클린업 함수
  const cleanupMapEvents = (map) => {
    kakao.maps.event.removeListener(map, 'dragend', handleMapChange);
    kakao.maps.event.removeListener(map, 'zoom_changed', handleMapChange);
    kakao.maps.event.removeListener(map, 'click', handleMapClick);
  };

  // 사용자 위치 가져오기 1
  useEffect(() => {
    if (!userLocation) {
      fetchAndSetUserLocation();
    }
  }, [userLocation, fetchAndSetUserLocation]);

  // 사용자 위치 가져오기 2: moveToLocation 상태 변경 시 지도 중심 이동
  //(이거 맞는지 확인.. userLocation과 그냥 선택카페로 맵 중심이동과 상충되는듯)
  useEffect(() => {
    // console.log('useEffect for moveToLocation:', moveToLocation);
    if (moveToLocation && mapInstance.current) {
      const { latitude, longitude } = moveToLocation;
      const newCenter = new kakao.maps.LatLng(latitude, longitude);
      mapInstance.current.panTo(newCenter); // 지도 중심 이동
      setMapLevel(mapInstance.current.getLevel()); // 현재 레벨 업데이트
      updateMapRect(mapInstance.current); // 지도 영역 업데이트

      // console.log('지도 중심 이동:', { latitude, longitude });

      // moveToLocation 초기화 (필수인지 확인 필요..)
      // setMoveToLocation(null); // 중복 실행 방지
    }
  }, [moveToLocation, updateMapRect, setMapLevel]);

  // 맵 초기화 및 이벤트 리스너 등록
  useEffect(() => {
    if (userLocation) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`;
      script.onload = () => {
        kakao.maps.load(() => {
          initializeMap();
        });
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [userLocation, initializeMap]);

  // mapRect가 설정된 후 React Query의 refetch 호출
  useEffect(() => {
    if (mapRect && userLocation) {
      // console.log('mapRect and userLocation are set:', mapRect, userLocation); // 디버그 로그 추가
      refetch(); // 데이터 페칭
    }
  }, [mapRect, userLocation, refetch]);

  const handleMarkerClick = useCallback(
    (placeId, x, y) => {
      setShowSheet(true);
      setMoveToLocation({ latitude: y, longitude: x });
      navigate(`/ai-home/places/${placeId}`);
    },
    [navigate, setMoveToLocation],
  );

  return (
    <div
      ref={mapRef}
      id="ai-map"
      style={{ position: 'absolute', width: '100vw', height: '90vh' }}
      onClick={handleMapClick}
    >
      {mapInstance.current && (
        <AICafeMarker cafes={aiCafes} map={mapInstance.current} onMarkerClick={handleMarkerClick} />
      )}
    </div>
  );
};

export default AIMap;
