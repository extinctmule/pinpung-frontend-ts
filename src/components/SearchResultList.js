import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchListAccuracy, searchListDistance } from '../api/searchApi';
import useStore from '../store/store';
import { ClipLoader } from 'react-spinners';
import { Button, Image } from 'react-bootstrap';

const SearchResultList = () => {
  const navigate = useNavigate();
  // const moveToLocation = useStore((state) => state.moveToLocation);
  const setMoveToLocation = useStore((state) => state.setMoveToLocation);
  const userLocation = useStore((state) => state.userLocation);
  const mapRect = useStore((state) => state.mapRect);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 리스트
  const keyword = searchParams.get('keyword');
  const sort = searchParams.get('sort') || 'accuracy';

  const handleSortChange = (newSort) => {
    navigate(`/search-results?keyword=${keyword}&sort=${newSort}`);
  };

  const handlePlaceClick = (placeId, x, y) => {
    if (isNaN(y) || isNaN(x)) {
      console.error('유효하지 않은 좌표:', { y, x });
      return;
    }
    //setIsSheetOpen(true);
    setMoveToLocation({ latitude: parseFloat(y), longitude: parseFloat(x) });
    navigate(`/places/${placeId}`);
  };

  const fetchSearchResults = useCallback(async () => {
    if (!keyword || !mapRect || !userLocation) return;
    console.log('keyword', keyword, 'mapRect', mapRect);

    setLoading(true);
    setError(null);

    try {
      let response;

      if (sort === 'accuracy') {
        response = await searchListAccuracy(
          keyword,
          mapRect.swLng,
          mapRect.swLat,
          mapRect.neLng,
          mapRect.neLat,
        );
      } else if (sort === 'distance') {
        response = await searchListDistance(
          keyword,
          mapRect.swLng,
          mapRect.swLat,
          mapRect.neLng,
          mapRect.neLat,
          userLocation.longitude,
          userLocation.latitude,
        );
      }
      setSearchResults(response.searchPlaceInfoDtoList);
      console.log('1. searchResults:', searchResults);
      console.log('2. 백 response:', response);
    } catch (error) {
      console.error('검색 결과를 가져오는 데 실패했습니다.', error);
      setError('검색 결과를 가져오는 데 실패했습니다.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, mapRect, userLocation, sort]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  return (
    <div>
      {/* 정렬 버튼 */}
      <div
        className="d-flex justify-content-left mb-3"
        style={{
          marginTop: '0.7rem',
        }}
      >
        <Button
          variant={sort === 'accuracy' ? 'secondary' : 'outline-secondary'}
          onClick={() => handleSortChange('accuracy')}
          style={{ marginRight: '0.5rem', height: '3.5vh' }}
          size="sm"
        >
          정확도순
        </Button>
        <Button
          variant={sort === 'distance' ? 'secondary' : 'outline-secondary'}
          onClick={() => handleSortChange('distance')}
          style={{ height: '3.5vh' }}
          size="sm"
        >
          거리순
        </Button>
      </div>
      <div
        style={{
          overflowY: 'auto',
          height: '75vh',
          padding: '0 2vw',
        }}
      >
        {loading ? (
          <ClipLoader />
        ) : error ? (
          <div style={{ color: '#888' }}>{error}</div>
        ) : searchResults ? (
          searchResults.map((place) => (
            <div
              key={place.placeId}
              onClick={() => handlePlaceClick(place.placeId, place.x, place.y)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                height: '',
                marginBottom: '0.5rem',
                cursor: 'pointer',
              }}
            >
              {/* 장소 정보 */}
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{place.placeName}</div>
                <p style={{ fontSize: '0.7rem', color: '#606060', marginBottom: '0.3rem' }}>
                  리뷰 {place.reviewCount} {place.byFriend && '  친구가 방문한 장소'}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#606060', marginBottom: '0.5rem' }}>
                  {place.address}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#484848', margin: 0 }}>
                  {place.tags?.length
                    ? place.tags
                        .slice(0, 3)
                        .map((tag) => `#${tag} `)
                        .join('')
                    : ' '}{' '}
                </p>
              </div>

              {/* 이미지 */}
              <div style={{ width: '35vw', height: '12vh', flexShrink: 0 }}>
                {place.imageId ? (
                  <Image
                    src={`${process.env.REACT_APP_S3_BASE_URL}/original-images/${place.imageId}`}
                    alt="장소 이미지"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '5%',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '5%',
                    }}
                  ></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#888' }}>검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default SearchResultList;
