import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/auth';

const PrivateRoute = () => {
  const accessToken = useStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
