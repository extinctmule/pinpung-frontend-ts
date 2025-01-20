import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MapLayout from '../components/Map/MapLayout';
import AIHome from '../pages/AIHome';
import AIMapLayout from '../components/Map/AIMapLayout';
import MyPage from '../pages/MyPage';
import ProfileRouter from './ProfileRouter';
import OAuthCallback from '../pages/OAuthCallback';
import Login from '../pages/Login';
import Navbar from '../components/Navbar';
import PlaceOverview from '../pages/PlaceOverview';
import AIPlaceOverview from '../pages/AIPlaceOverview';
import UserPreferences from '../pages/UserPreferences';
import UploadPung from '../pages/UploadPung';
import UploadPungWithSearch from '../pages/UploadPungWithSearch';
import UploadReview from '../pages/UploadReview';
import DefaultSearch from '../pages/DefaultSearch';
import PrivateRoute from './PrivateRoute';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PrivateRoute로 보호된 라우트 그룹 */}
        <Route element={<PrivateRoute />}>
          <Route element={<MapLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/places/:placeId" element={<PlaceOverview />} />
          </Route>
          <Route element={<AIMapLayout />}>
            <Route path="/ai-home" element={<AIHome />} />
            <Route path="/ai-home/places/:placeId" element={<AIPlaceOverview />} />
          </Route>
          <Route path="/user-preferences" element={<UserPreferences />} />
          <Route path="/places/:placeId/upload-pung" element={<UploadPung />} />
          <Route path="/upload-pung-with-search" element={<UploadPungWithSearch />} />
          <Route path="/places/:placeId/upload-review" element={<UploadReview />} />
          <Route path="/search-results" element={<DefaultSearch />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/user-page/:userId" element={<ProfileRouter />} />
        </Route>

        {/* 비보호 라우트 */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Navbar />
    </BrowserRouter>
  );
};

export default Router;
