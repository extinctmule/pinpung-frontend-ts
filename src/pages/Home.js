import React from 'react';
import AIButton from '../components/Map/AIButton';
import LocationButton from '../components/Map/LocationButton';
import SearchBar from '../components/Map/SearchBar';
import { Container } from 'react-bootstrap';

const Home = () => {
  return (
    <>
      <Container
        fluid
        className="d-flex flex-column"
        style={{
          paddingTop: '1rem',
        }}
      >
        <SearchBar />
      </Container>
      <AIButton />
      <LocationButton />
    </>
  );
};

export default Home;
