// src/components/AI/AIRecommendList.js
import { useNavigate } from 'react-router-dom';
import useAIRecommendCafes from '../hooks/useAIRecommendCafes';
import useStore from '../store/store';
import { ClipLoader } from 'react-spinners';
import { Container, Row, Col, Image } from 'react-bootstrap';

const AIRecommendList = () => {
  const navigate = useNavigate();
  const { swLng, swLat, neLng, neLat } = useStore((state) => state.mapRect) || {};
  const userLocation = useStore((state) => state.userLocation);
  const { latitude, longitude } = userLocation || {};

  const { data, error, isLoading } = useAIRecommendCafes(
    swLng,
    swLat,
    neLng,
    neLat,
    longitude,
    latitude,
  );
  const aiCafes = data?.places || [];

  const handlePlaceClick = (placeId) => {
    navigate(`/ai-home/places/${placeId}`);
  };

  return (
    <Container
      fluid
      style={{
        position: 'absolute',
        top: '8vh',
        left: 0,
        width: '100vw',
        height: '82vh',
        overflowY: 'auto',
        zIndex: 3,
        backgroundColor: 'white',
      }}
    >
      {isLoading ? (
        <div className="text-center">
          <ClipLoader />
        </div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : aiCafes ? (
        aiCafes.map((place) => (
          <Row
            key={place.placeId}
            className="align-items-center mb-3"
            onClick={() => handlePlaceClick(place.placeId)}
            style={{
              cursor: 'pointer',
              padding: '1vh',
            }}
          >
            <Col xs={8}>
              <h6
                className="fw mb-1"
                style={{
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {place.placeName}
              </h6>
              <p
                className="text-muted mb-1"
                style={{
                  fontSize: '0.7rem',
                  color: '#606060',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {place.address}
              </p>
              <p
                className="text-muted"
                style={{
                  fontSize: '0.7rem',
                }}
              >
                {place.tags?.length
                  ? place.tags
                      .slice(0, 3)
                      .map((tag) => `#${tag} `)
                      .join('')
                  : ''}
              </p>
            </Col>
            <Col xs={4}>
              {place.imageId ? (
                <Image
                  src={`${process.env.REACT_APP_S3_BASE_URL}/original-images/${place.imageId}`}
                  alt="장소 이미지"
                  style={{
                    width: '100%',
                    height: '12vh',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '12vh',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px',
                  }}
                />
              )}
            </Col>
          </Row>
        ))
      ) : (
        <div className="text-center text-muted">검색 결과가 없습니다.</div>
      )}
    </Container>
  );
};

export default AIRecommendList;
