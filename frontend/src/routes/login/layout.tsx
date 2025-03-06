import { Outlet } from '@modern-js/runtime/router';
import './index.css';
import '@/routes/index.css';
export default () => {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Outlet />
    </div>
  );
};
