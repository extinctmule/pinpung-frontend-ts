import { Outlet } from 'react-router-dom';
import Map from './Map';

const MapLayout = () => {
  return (
    <div style={{ position: 'relative' }}>
      <Map />
      <Outlet />
    </div>
  );
};

export default MapLayout;
