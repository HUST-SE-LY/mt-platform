import { Outlet } from '@modern-js/runtime/router';
import '@/routes/index.css';
export default () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};