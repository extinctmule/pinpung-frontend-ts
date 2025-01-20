/* 인터셉터 설정 파일 */

import { securedInstance, refreshInstance } from '../api/axiosInstance';
import useAuthStore from '../store/auth';

const API_URL = process.env.REACT_APP_API_URL;

export const setupRequestInterceptor = () => {
  securedInstance.interceptors.request.use(
    (config) => {
      const accessToken = useAuthStore.getState().accessToken;

      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn('AccessToken이 없습니다.');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  securedInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          console.log('refresh 로직 진입점');
          const refreshResponse = await refreshInstance.post(`${API_URL}/api/token/refresh`);
          const { accessToken } = refreshResponse.data;

          // 상태 업데이트하고, 그 전 요청 다시 처리하자
          useAuthStore.setState({ accessToken });
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return securedInstance(originalRequest);
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);

          // 로그아웃시키고 로그인페이지로 돌아가게 처리
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';

          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );
};
