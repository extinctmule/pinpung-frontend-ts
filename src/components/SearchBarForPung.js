// SearchBarForPung.js
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

const SearchBarForPung = ({ onClick, placeholder, readOnly, onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter' && !readOnly && onSearch) {
      event.preventDefault();
      onSearch(keyword);
    }
  };

  return (
    <SearchBarContainer onClick={readOnly ? onClick : undefined} readOnly={readOnly}>
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder={placeholder || '검색...'}
          className="me-2"
          aria-label="Search"
          id="home-search-input"
          style={{ height: '45px', flex: 1 }}
          value={keyword}
          onChange={handleInputChange}
          onKeyDown={handleSearch}
          readOnly={readOnly}
        />
      </Form>
    </SearchBarContainer>
  );
};

export default SearchBarForPung;

// Styled Components
const SearchBarContainer = styled.div`
  width: 50%;

  cursor: ${(props) => (props.readOnly ? 'pointer' : 'text')};
`;
