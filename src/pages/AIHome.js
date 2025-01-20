import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AIRecommendList from '../components/AIRecommendList';
import useAuthStore from '../store/auth';
import HomeButton from '../components/Map/HomeButton';
import LocationButton from '../components/Map/LocationButton';
import { Container, Button, Row, Col } from 'react-bootstrap';
import listButtonIcon from '../assets/icons/list-icon.svg';
import mapButtonIcon from '../assets/icons/map-icon.svg';

const AIHome = () => {
  const userName = useAuthStore((state) => state.userInfo.userName);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'map';

  useEffect(() => {
    if (!searchParams.get('view')) {
      setSearchParams({ view: 'map' });
    }
  }, [searchParams, setSearchParams]);

  const handleToggleView = () => {
    setSearchParams({ view: view === 'map' ? 'list' : 'map' });
  };

  return (
    <>
      <Container
        fluid
        style={{
          width: '100vw',
          height: '100vh',
          overflowY: 'hidden', // 모바일에서 스크롤 관리
        }}
      >
        {/* 상단 텍스트와 버튼 */}
        <Row
          className="align-items-center"
          style={{
            position: 'fixed',
            top: 0,
            zIndex: 10,
            width: '100%',
            height: '8vh',
            backgroundColor: 'white',
            borderBottom: '1px solid #ccc',
            padding: '0 3vw', // 좌우 간격 조정
          }}
        >
          <Col xs="auto">
            <Button
              variant="outline-primary"
              onClick={handleToggleView}
              style={{
                padding: 0,
                border: 'none',
                background: 'none',
              }}
            >
              <img
                src={view === 'map' ? listButtonIcon : mapButtonIcon}
                alt="Toggle View"
                style={{ width: '9vw', height: '9vw' }}
              />
            </Button>
          </Col>
          <Col>
            <h5
              style={{
                fontSize: '1.2rem',
                margin: '0 0 0.35vh',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {userName} 님을 위한 카페 추천
            </h5>
            <p
              style={{
                fontSize: '0.6rem',
                color: '#888888',
                margin: 0,
              }}
            >
              AI가 {userName} 님의 취향을 바탕으로 좋아하실 만한 카페를 추천해드립니다.
            </p>
          </Col>
        </Row>

        {/* 리스트 또는 맵 뷰 */}
        <div
          style={{
            marginTop: '12vh', // 상단 고정 Row 아래로 간격 조정
            height: 'calc(100vh - 12vh)', // 상단 Row 높이를 뺀 나머지 공간 사용
            overflow: 'hidden', // 스크롤 충돌 방지
          }}
        >
          {view === 'list' ? <AIRecommendList /> : null}
        </div>
      </Container>
      <HomeButton />
      <LocationButton />
    </>
  );
};

export default AIHome;
