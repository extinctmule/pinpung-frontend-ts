import { securedInstance } from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchMyProfilePungs = async (userId) => {
  try {
    const response = await securedInstance.get(`${API_URL}/api/profile/${userId}`);

    return response.data;
  } catch (error) {
    console.error('프로필 정보 불러오기 실패:', error);
    throw new Error('프로필 정보를 불러올 수 없습니다.');
  }
};

export const fetchMyProfileReviews = async (userId) => {
  try {
    const response = await securedInstance.get(`${API_URL}/api/profile/${userId}/view-reviews`);

    return response.data;
  } catch (error) {
    console.error('프로필 리뷰 정보 불러오기 실패:', error);
    throw new Error('프로필 리뷰 정보를 불러올 수 없습니다.');
  }
};
