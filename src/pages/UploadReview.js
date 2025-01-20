import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/store';
import { addReview } from '../api/reviewApi';
import { compressImage, convertToWebP } from '../utils/imageUtils';
import { ClipLoader } from 'react-spinners';
import { debounce } from 'lodash';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadReview = () => {
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
    let finalImage = null;

    if (image) {
      const compressedFile = await compressImage(image);
      finalImage = await convertToWebP(compressedFile);
    }
    setLoading(true);

    try {
      await addReview(placeId, text, finalImage);

      setLoading(false);
      navigate(`/places/${placeId}`);
    } catch (error) {
      setLoading(false);
      console.log('리뷰 업로드 중 오류 발생:', error);
    }
  };

  const debouncedHandleUpload = debounce(handleUpload, 1000);

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
            <h3>방문한 후기를 남겨주세요.</h3>
          </div>
          <div className="col-12 d-flex justify-content-center mb-3">
            <div className="input-group" style={{ width: 'auto' }}>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {image && <ImagePreview src={URL.createObjectURL(image)} alt="미리보기" />}
            </div>
          </div>
          <div className="col-12 mb-4">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder=""
              className="form-control"
              rows="4"
              style={{ width: '100%', resize: 'none' }}
            />
          </div>
        </CenteredArea>
        <div className="d-flex justify-content-center">
          {loading ? (
            <ClipLoader color={'#8c8c8c'} size={50} />
          ) : (
            <UploadButton onClick={debouncedHandleUpload} className="btn btn-primary">
              후기 올리기
            </UploadButton>
          )}
        </div>
      </Form>
    </Wrapper>
  );
};

export default UploadReview;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  text-align: center;
  background-color: white;
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
  width: 85vw;
  padding: 10px 30px;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-left: 10px;
`;
