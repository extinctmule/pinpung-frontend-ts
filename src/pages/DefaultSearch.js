import SearchBar from '../components/Map/SearchBar';
import SearchResultList from '../components/SearchResultList';
import { Container } from 'react-bootstrap';

const DefaultSearch = () => {
  return (
    <Container
      fluid
      className="d-flex flex-column"
      style={{
        height: '100vh',
        overflowY: 'auto',
        paddingTop: '1rem',
      }}
    >
      <SearchBar />
      <SearchResultList />
    </Container>
  );
};

export default DefaultSearch;
