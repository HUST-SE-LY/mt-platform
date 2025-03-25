import { Layout, Nav } from '@douyinfe/semi-ui';
import '@/routes/index.css';
import { Outlet, useLocation, useNavigate } from '@modern-js/runtime/router';
import { useMemo } from 'react';

export default () => {
  const location = useLocation();
  const nav = useNavigate();
  const navItemKey = useMemo(
    () => location.pathname.split('/').pop() as string,
    [location]
  );
  return (
    <Layout>
      <Layout.Sider
        style={{
          width: 240,
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <Nav selectedKeys={[navItemKey]} style={{ height: '100%' }}>
          <Nav.Item
            onClick={() => nav('ads')}
            text="审核广告"
            itemKey="ads"
          />
        </Nav>
      </Layout.Sider>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};