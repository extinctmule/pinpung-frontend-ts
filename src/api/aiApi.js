import { securedInstance } from './axiosInstance';
import { AIRecommendData } from '../mocks/data/AIRecommendData';

const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';
const API_URL = process.env.REACT_APP_API_URL;

/**
 * AI 사용자 맞춤 태그와 함께 근처 카페 추천하기
 * @param {number} swLng - 남서쪽 경도
 * @param {number} swLat - 남서쪽 위도
 * @param {number} neLng - 북동쪽 경도
 * @param {number} neLat - 북동쪽 위도
 * @param {number} x - 사용자 경도
 * @param {number} y - 사용자 위도
 * @returns {Promise<Object>} - 카페 추천 데이터
 */
export const fetchAIRecommendCafes = async (swLng, swLat, neLng, neLat, x, y) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(AIRecommendData);
      }, 500);
    });
  }
  try {
    const response = await securedInstance.get(`${API_URL}/api/ai/recommend`, {
      params: {
        swLng,
        swLat,
        neLng,
        neLat,
        x,
        y,
      },
    });
    return response.data;
  } catch (error) {
    console.error('근처 사용자 맞춤 태그 가져오기 실패', error);
    throw new Error('근처 사용자 맞춤 태그를 불러올 수 없습니다.');
  }
};

// AI 트랜딩 태그와 함께 근처 카페 추천하기
export const fetchAITrendingCafes = async (swLng, swLat, neLng, neLat, x, y) => {
  try {
    const response = await securedInstance.get(`${API_URL}/api/ai/trending`, {
      params: {
        swLng,
        swLat,
        neLng,
        neLat,
        x,
        y,
      },
    });
    return response.data;
  } catch (error) {
    console.error('근처 트렌딩 카페 정보 가져오기 실패', error);
    throw new Error('근처 트렌딩 카페 정보를 불러올 수 없습니다.');
  }
};
