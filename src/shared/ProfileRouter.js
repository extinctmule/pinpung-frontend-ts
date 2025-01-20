import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';
import UserPage from '../pages/UserPage';

const ProfileRouter = () => {
  const { userId } = useParams();
  const currentUserId = useAuthStore((state) => state.userInfo.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId === currentUserId) {
      navigate('/my-page');
    }
  }, [userId, currentUserId, navigate]);

  // 다른 사용자 페이지 렌더링
  return <UserPage />;
};

export default ProfileRouter;
