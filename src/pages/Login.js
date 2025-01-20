import styled from 'styled-components';
import backgroundImage from '../assets/images/login-background.svg';
import pinpungLogoIcon from '../assets/icons/pinpung-logo-icon.svg';
import kakaoLoginImage from '../assets/images/kakao_login_medium_narrow.png';

const Login = () => {
  const handleLogin = () => {
    // 백엔드 OAuth2 인증 엔드포인트로 리다이렉트
    window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/kakao`;
  };

  return (
    <Wrapper>
      <img src={pinpungLogoIcon} alt="핑펑 로고" style={{ marginLeft: '15px' }} />
      <h1 style={{ fontWeight: 'bold' }}>PinPung</h1>
      <br />
      <h2>로그인하고 핑펑에서</h2>
      <h2>카페 추천을 받아보세요</h2>
      <br />
      <br />
      <img src={kakaoLoginImage} alt="카카오 로그인" onClick={handleLogin} />
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  padding: 40px 40px;

  background-image: url(${backgroundImage});
  background-position: center;
  background-size: contain;
  backgroound-repeat: no-repeat;
  background-color: white;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;
