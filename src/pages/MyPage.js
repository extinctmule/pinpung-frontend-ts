import { useState, useEffect } from 'react';
import useAuthStore from '../store/auth';
import { fetchMyProfilePungs, fetchMyProfileReviews } from '../api/profileApi';
import profileImg from '../assets/images/profile-img.png';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const S3_URL = `${process.env.REACT_APP_S3_BASE_URL}`;

const MyPage = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [activeTab, setActiveTab] = useState('pungs'); // 'pungs' 또는 'reviews'
  const [profileData, setProfileData] = useState(null);
  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    // 인증되지 않은 경우 로그인 리다이렉트
    if (!accessToken) {
      window.location.href = `${API_URL}/oauth2/authorization/kakao`;
      return;
    }
  }, [accessToken]);

  useEffect(() => {
    if (activeTab === 'pungs') {
      //console.log(userInfo);
      fetchMyProfilePungs(userInfo.userId)
        .then((data) => {
          setProfileData(data.defaultProfile);
          setContentData(data.pungs);
        })
        .catch((error) => console.error('펑 데이터를 불러오는 데 실패했습니다:', error));

      // console.log('pungs contentData:', contentData);
    } else if (activeTab === 'reviews') {
      fetchMyProfileReviews(userInfo.userId)
        .then((data) => {
          setProfileData(data.defaultProfile);
          setContentData(data.reviews);
        })
        .catch((error) => console.error('리뷰 데이터를 불러오는 데 실패했습니다:', error));

      // console.log('reviews contendData:', contentData);
    }
  }, [activeTab]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('auth-storage');
      clearAuth();
      window.location.href = `${API_URL}/logout`;
    } catch (error) {
      console.error('로그아웃 처리 중 에러 발생:', error);
    }
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: '90vh',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 2,
      }}
    >
      <div style={{ padding: '2vw' }}>
        {/* 프로필 */}
        <div className="p-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-4 fw-bold" style={{ fontSize: '1.5rem' }}>
              {userInfo?.userName || ' '}
            </h2>
            <button
              style={{
                color: '#fff',
                backgroundColor: '#ff9c0e',
                padding: '0.3rem 0.5rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <img
              src={profileImg}
              alt="프로필 이미지"
              style={{ height: '3rem', marginTop: '0.5rem', borderRadius: '50%' }}
            />
            {profileData && (
              <div
                className="d-flex justify-content-between align-items-center ms-auto mt-2"
                style={{ gap: '1rem' }}
              >
                <div className="text-center">
                  <div style={{ fontSize: '0.9rem' }}>펑</div>
                  <div style={{ fontSize: '0.9rem' }}>{profileData.pungCount}</div>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '0.9rem' }}>리뷰</div>
                  <div style={{ fontSize: '0.9rem' }}>{profileData.reviewCount}</div>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '0.9rem' }}>팔로워</div>
                  <div style={{ fontSize: '0.9rem' }}>{profileData.followerCount}</div>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '0.9rem' }}>팔로잉</div>
                  <div style={{ fontSize: '0.9rem' }}>{profileData.followingCount}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 탭 */}
        <div className="d-flex justify-content-center">
          <button
            style={{
              color: activeTab === 'pungs' ? '#fff' : '#6c757d',
              backgroundColor: activeTab === 'pungs' ? '#ff9c0e' : 'transparent',
              marginLeft: '1rem',
              flex: 1,
              fontSize: '1rem',
              border: 'none',
              borderRadius: '0.25rem',
            }}
            onClick={() => setActiveTab('pungs')}
          >
            펑
          </button>
          <button
            style={{
              color: activeTab === 'reviews' ? '#fff' : '#6c757d',
              backgroundColor: activeTab === 'reviews' ? '#ff9c0e' : 'transparent',
              marginRight: '1rem',
              flex: 1,
              fontSize: '1rem',
              border: 'none',
              borderRadius: '0.25rem',
            }}
            onClick={() => setActiveTab('reviews')}
          >
            리뷰
          </button>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div
        className="flex-grow-1 overflow-auto p-3"
        style={
          {
            // 높이 자동조정..
          }
        }
      >
        {activeTab === 'pungs' ? (
          <div className="container-fluid">
            <div className="row">
              {contentData.map((item, index) => (
                <div key={index} className="col-4 mb-3">
                  <div className="card h-100">
                    <img
                      src={`${S3_URL}/uploaded-images/${item.imageId}`}
                      className="card-img-top"
                      alt="펑 사진"
                      style={{ height: '10rem', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container-fluid px-0">
            {contentData.map((item, index) => (
              <div
                key={index}
                className="card border-0 shadow-none"
                style={{ margin: '0 2vw 5vh 2vw' }}
              >
                <div className="card-text" style={{ fontSize: '1rem' }}>
                  {item.placeName}
                </div>
                <small className="text-muted">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </small>
                <p className="card-text mb-1" style={{ marginTop: '1.5vh', fontSize: '0.95rem' }}>
                  {item.reviewText}
                </p>
                {item.imageId && (
                  <img
                    src={`${S3_URL}/original-images/${item.imageId}`}
                    alt="리뷰 사진"
                    className="img-fluid mt-1"
                    style={{ width: '100vw', objectFit: 'cover', borderRadius: '3%' }}
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
