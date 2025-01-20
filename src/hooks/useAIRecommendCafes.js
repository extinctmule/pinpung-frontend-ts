import { useQuery } from '@tanstack/react-query';
import { fetchAIRecommendCafes } from '../api/aiApi';

const useAIRecommendCafes = (swLng, swLat, neLng, neLat, x, y) => {
  return useQuery({
    queryKey: ['aiRecommendCafes', swLng, swLat, neLng, neLat, x, y],
    queryFn: () => fetchAIRecommendCafes(swLng, swLat, neLng, neLat, x, y),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,

    // 명시적 체크 해야함
    // enabled:
    //   swLng !== null &&
    //   swLat !== null &&
    //   neLng !== null &&
    //   neLat !== null &&
    //   x !== null &&
    //   y !== null,
    // 필터링된 데이터 반환
    select: (data) => ({
      ...data,
      places: data.places.filter((_, index) => index % 2 === 0),
    }),
  });
};

export default useAIRecommendCafes;
