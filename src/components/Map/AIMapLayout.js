import { Outlet } from 'react-router-dom';
import AIMap from './AIMap';

const AIMapLayout = () => {
  return (
    <div style={{ position: 'relative' }}>
      <AIMap />
      <Outlet />
    </div>
  );
};

export default AIMapLayout;
