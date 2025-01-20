import { securedInstance } from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL;

export const registerMyTaste = async (age, activities, menus) => {
  try {
    const response = await securedInstance.post(
      `${API_URL}/api/profile/taste`,
      {
        age: age,
        activities: activities,
        menus: menus,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('사용자 취향 정보 등록 실패', error);
    throw new Error('사용자 취향 정보 등록에 실패했습니다.');
  }
};
