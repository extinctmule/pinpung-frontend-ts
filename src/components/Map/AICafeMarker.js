/* AIMap.js에서 전달되는 카페 목록을 바탕으로 맵에 마커를 생성하고, 클릭 시 카페 상세정보 표시 */

/* global kakao */

import { useEffect, useRef } from 'react';
import './AICafeMarker.css';

const AICafeMarker = ({ cafes, map, onMarkerClick }) => {
  const markers = useRef({});

  useEffect(() => {
    if (!map || cafes.length === 0) return;

    const currentMarkers = markers.current;

    cafes.forEach((place) => {
      if (!currentMarkers[place.placeId] && place.tags.length > 0) {
        const markerWrapper = document.createElement('div');
        markerWrapper.classList.add('ai-marker-wrapper');

        const markerLabel = document.createElement('div');
        markerLabel.classList.add('ai-marker-label');
        markerLabel.innerText = `# ${place.tags[0]}`;

        markerWrapper.appendChild(markerLabel);

        const customOverlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(place.y, place.x),
          content: markerWrapper,
          map: map,
        });

        markerWrapper.addEventListener('click', () => {
          onMarkerClick(place.placeId, parseFloat(place.x), parseFloat(place.y));
        });

        currentMarkers[place.placeId] = customOverlay;
      }
    });

    return () => {
      Object.values(currentMarkers).forEach((marker) => marker.setMap(null));
      markers.current = {};
    };
  }, [cafes, map, onMarkerClick]);
  return null;
};

export default AICafeMarker;
