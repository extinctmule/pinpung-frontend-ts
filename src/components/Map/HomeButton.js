import { Link } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home-button-icon.svg';
import styled from 'styled-components';

const HomeButton = () => {
  return (
    <StyledLink to="/">
      <img src={HomeIcon} alt="Home 아이콘" />
    </StyledLink>
  );
};

export default HomeButton;

const StyledLink = styled(Link)`
  position: fixed;
  bottom: 20%;
  right: 0px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 2%;
  z-index: 2;
  img {
    width: 100%;
    height: 100%;
  }
`;
