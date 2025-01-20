import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth';
import styled from 'styled-components';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보 가져오기
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  useEffect(() => {
    const processRedirectData = () => {
      try {
        // 현재 URL에서 쿼리 파라미터 추출
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const token = params.get('token');
        const userName = params.get('userName');
        const userEmail = params.get('userEmail');
        const userId = params.get('userId');

        if (status === 'success' && token) {
          setAccessToken(token);
          localStorage.setItem('accessToken', token);
          setUserInfo({
            userName,
            userEmail,
            userId,
          });

          navigate('/user-preferences');
        } else {
          alert('로그인 실패. 다시 시도해주세요.');
          navigate('/');
        }
      } catch (error) {
        console.error('리다이렉트 데이터 처리 실패:', error.message);
        alert('로그인 처리 중 문제가 발생했습니다.');
        navigate('/');
      }
    };

    processRedirectData();
  }, [location.search, navigate, setAccessToken, setUserInfo]);

  return <Wrapper>로그인 중입니다...</Wrapper>;
};

export default OAuthCallback;

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
