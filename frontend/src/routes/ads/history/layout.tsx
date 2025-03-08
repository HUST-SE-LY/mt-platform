import '@/routes/index.css';
import { Outlet } from '@modern-js/runtime/router';
export default () => {
  return <div style={{
    padding: 16
  }}>
    <Outlet />
  </div>
}