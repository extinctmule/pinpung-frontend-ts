import { useParams } from 'react-router-dom';
import useAuthStore from '../store/auth';
import useStore from '../store/store';
import BottomSheet from '../components/BottomSheet';
import HomeButton from '../components/Map/HomeButton';
import LocationButton from '../components/Map/LocationButton';
import { Container, Button, Row, Col } from 'react-bootstrap';

const AIPlaceOverview = () => {
  const { placeId } = useParams();
  const userName = useAuthStore((state) => state.userInfo.userName);
  const showSheet = useStore((state) => state.showBottomSheet);

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column"
        style={{
          paddingTop: '1rem',
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
              style={{
                padding: 0,
                border: 'none',
                background: 'none',
                width: '9vw',
                height: '9vw',
              }}
            ></Button>
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
      </Container>
      ({showSheet} && <BottomSheet placeId={placeId} />) <HomeButton />
      <LocationButton />
    </>
  );
};

export default AIPlaceOverview;
