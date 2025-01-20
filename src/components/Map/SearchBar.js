import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  // 검색 입력 핸들링
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      navigate(`/search-results?keyword=${keyword}&sort=accuracy`);
    }
  };

  // 검색창 클릭 핸들링
  const handleSearchBarClick = () => {
    const searchBarInput = document.querySelector('#home-search-input');
    if (searchBarInput) {
      searchBarInput.focus();
    }
  };

  return (
    <div style={{ zIndex: 2 }}>
      <Form className="d-flex" onClick={handleSearchBarClick}>
        <Form.Control
          type="search"
          placeholder="검색..."
          className="me-2"
          aria-label="Search"
          id="home-search-input"
          style={{ height: '45px', flex: 1 }}
          value={keyword}
          onChange={handleInputChange}
          onKeyDown={handleSearch}
        />
      </Form>
    </div>
  );
};

export default SearchBar;
