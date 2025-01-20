import { securedInstance } from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL;

export const addReview = async (placeId, text, image) => {
  const data = new FormData();

  data.append('placeId', placeId);
  data.append('text', text);

  if (image) {
    data.append('reviewImage', image);
  }

  try {
    const response = await securedInstance.post(`${API_URL}/api/reviews`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('리뷰 업로드 실패:', error);
    throw new Error('리뷰 업로드에 실패했습니다.');
  }
};

export const modifyReview = async (placeId, reviewId, text, image) => {
  const data = new FormData();

  data.append('placeId', placeId);
  data.append('text', text);
  data.append('reviewId', reviewId);

  if (image) {
    data.append('image', image);
  }

  try {
    const response = await securedInstance.patch(`${API_URL}/api/reviews`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    throw new Error('리뷰 수정에 실패했습니다.');
  }
};

export const deleteReview = async (placeId, reviewId) => {
  const data = new FormData();

  data.append('placeId', placeId);
  data.append('reviewId', reviewId);

  try {
    const response = await securedInstance.delete(`${API_URL}/api/reviews`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    throw new Error('리뷰 삭제에 실패했습니다.');
  }
};
