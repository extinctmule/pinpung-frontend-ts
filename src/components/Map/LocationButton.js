import { getUserLocation } from '../../api/locationApi';
import useStore from '../../store/store';
import LocationIcon from '../../assets/icons/compass-icon.svg';
import styled from 'styled-components';

const LocationButton = () => {
  const setMoveToLocation = useStore((state) => state.setMoveToLocation);

  const handleLocationClick = async () => {
    try {
      const location = await getUserLocation();
      // console.log('현위치 다시 받아옴', location);

      setMoveToLocation(location);
    } catch (error) {
      console.error('위치 요청 실패:', error.message);
      // TODO: 사용자에게 알리는 UI 추가
    }
  };

  return (
    <Wrapper onClick={handleLocationClick}>
      <img src={LocationIcon} alt="위치 아이콘" />
    </Wrapper>
  );
};

export default LocationButton;

const Wrapper = styled.div`
  position: fixed;
  bottom: 12vh;
  right: 2vw;
  cursor: pointer;
  margin: 2vw;
  z-index: 2;
  img {
    width: 100%;
    height: 100%;
  }
`;
