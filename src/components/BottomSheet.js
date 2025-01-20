// 장소 상세정보 컴포넌트
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCafeDetails } from '../api/placesApi';
import useStore from '../store/store';
import styled from 'styled-components';

const S3_URL = process.env.REACT_APP_S3_BASE_URL;

const BottomSheet = ({ placeId }) => {
  const [cafeData, setCafeData] = useState(null);
  const navigate = useNavigate();
  const setSelectedPlaceName = useStore((state) => state.setSelectedPlaceName);

  useEffect(() => {
    if (!placeId) return;

    const fetchCafeData = async () => {
      try {
        const data = await fetchCafeDetails(placeId);
        setCafeData(data);
        setSelectedPlaceName(data.placeName);
        console.log(data);
      } catch (error) {
        console.error('카페 상세 정보 가져오기 실패:', error);
      }
    };

    fetchCafeData();
  }, [placeId, setSelectedPlaceName]);

  if (!cafeData) return null;

  const handlePungUpload = () => {
    navigate(`/places/${placeId}/upload-pung`);
  };

  const handleReviewUpload = () => {
    navigate(`/places/${placeId}/upload-review`);
  };

  return (
    <Wrapper>
      <Handle />
      <Content>
        <LineWrapper>
          <Header>{cafeData.placeName || '카페명'}</Header>
          <UploadButton onClick={handlePungUpload}>펑 추가</UploadButton>
        </LineWrapper>
        <div>
          <>{cafeData.address || ' '}</>
          <div style={{ marginBottom: '20px' }}></div>
          <LineWrapper>
            {cafeData.tags
              ? cafeData.tags
                  .slice(0, 3)
                  .map((tag) => `#${tag} `)
                  .join('')
              : '태그 정보 없음'}
          </LineWrapper>
          <div style={{ marginBottom: '20px' }}></div>
          <LineWrapper>
            <Header>후기</Header>
            <UploadButton onClick={handleReviewUpload}>후기 남기기</UploadButton>
          </LineWrapper>
          {cafeData.reviews?.reviews.map((review) => (
            <div
              key={review.reviewId}
              style={{ borderTop: '1px solid whitesmoke', marginBottom: '10px' }}
            >
              <br />
              <h6
                style={{ fontWeight: 'bold' }}
                onClick={() => navigate(`/user-page/${review.userId}`)}
              >
                {review.userName}
              </h6>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              <br />
              <p>{review.text}</p>
              <p>
                {' '}
                {review.imageId && (
                  <img
                    src={`${S3_URL}/original-images/${review.imageId}`}
                    alt="리뷰 사진"
                    style={{ height: '20vh' }}
                  />
                )}
              </p>
            </div>
          ))}
        </div>
      </Content>
    </Wrapper>
  );
};

export default BottomSheet;

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  bottom: 10%;
  top: 53%;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px 20px 0 0;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  z-index: 3;
  flex-direction: column;
`;

const LineWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Content = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const Handle = styled.div`
  width: 40px;
  height: 6px;
  background-color: #ccc;
  border-radius: 3px;
  margin: 10px auto;
  cursor: grab;
`;

const Header = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const UploadButton = styled.button`
  background-color: #ff9c0e;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
`;
