import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/store';
import { addPung } from '../api/pungApi';
import { compressImage, addPadding, convertToWebP } from '../utils/imageUtils';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadPung = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPlaceName = useStore((state) => state.selectedPlaceName);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleUpload = async () => {
    if (image) {
      setLoading(true);
      try {
        const compressedFile = await compressImage(image); // 압축만 처리
        const paddedFile = await addPadding(compressedFile); // 패딩 추가
        const finalImage = await convertToWebP(paddedFile); // WebP로 변환

        await addPung(placeId, finalImage, finalImage, text);

        setLoading(false);
        navigate(`/places/${placeId}`);
      } catch (error) {
        setLoading(false);
        console.log('펑 업로드 중 오류 발생:', error);
      }
    }
  };
  const handleButtonClick = () => {
    document.getElementById('file-input').click();
  };

  const handleClose = async () => {
    navigate(`/places/${placeId}`);
  };

  return (
    <Wrapper>
      <Header className="container-fluid">
        <PlaceName> {selectedPlaceName} </PlaceName>
        <CloseButton
          onClick={handleClose}
          type="button"
          className="btn-close"
          aria-label="Close"
        ></CloseButton>
      </Header>
      <Form className="container-fluid">
        <CenteredArea className="row w-100">
          <div className="col-12 text-center mb-4">
            <h3>
              자유롭게 표현해 보세요
              <br /> 24시간 뒤에 펑! 돼요
            </h3>
          </div>
          <div className="d-flex justify-content-center">
            {/* 숨겨진 파일 입력 */}
            <HiddenInput
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {/* 버튼 */}
            <SquareButton
              onClick={handleButtonClick}
              image={image ? URL.createObjectURL(image) : null}
            >
              {!image && <span style={{ fontSize: '40px' }}>+</span>}
            </SquareButton>
          </div>
          <div style={{ height: '6vh' }} />
          <div className="col-12 mb-4">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="소감을 남겨주세요"
              className="form-control"
              rows="1"
              style={{ width: '100%', resize: 'none' }}
            />
          </div>
        </CenteredArea>
        <div className="d-flex justify-content-center">
          {loading ? (
            <ClipLoader color={'#FFFFFF'} size={50} />
          ) : (
            <UploadButton onClick={handleUpload}>업로드</UploadButton>
          )}
        </div>
      </Form>
    </Wrapper>
  );
};

export default UploadPung;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90vh;
  margin-bottom: 10%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #434343;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  text-align: center;
  color: white;
  top: 20px;
`;

const PlaceName = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  font-weight: bold;
  font-size: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 20px;
  top: 2px;
  filter: invert(1);
`;

const Form = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
`;

const CenteredArea = styled.div`
  width: 100%;
  max-width: 500px;
  color: #8c8c8c;
`;

const UploadButton = styled.button`
  background-color: #ff9c0e;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  width: 83vw;
  padding: 10px 30px;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none; // 화면에 보이지 않도록 숨김
`;

// 정사각형 버튼 스타일
const SquareButton = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  background-image: ${({ image }) => (image ? `url(${image})` : 'none')};
  background-size: cover;
  background-position: center;

  span {
    color: #888;
    font-size: 14px;
  }
`;
