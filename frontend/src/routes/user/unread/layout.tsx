import { Outlet } from '@modern-js/runtime/router';
import '@/routes/index.css';
export default () => {
  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <Outlet />
    </div>
  );
};
