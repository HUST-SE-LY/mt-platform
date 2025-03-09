import { Badge, Layout, Nav } from '@douyinfe/semi-ui';
import '@/routes/index.css';
import { Outlet, useLocation, useNavigate } from '@modern-js/runtime/router';
import { useMemo } from 'react';

export default () => {
  const location = useLocation();
  const nav = useNavigate();
  const navItemKey = useMemo(
    () => location.pathname.split('/')[2] as string,
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
            onClick={() => nav('home')}
            text="翻译市场"
            itemKey="home"
          />
          <Nav.Item
            onClick={() => nav('history')}
            text="我的回答"
            itemKey="history"
          />
          <Nav.Item
            onClick={() => nav('my')}
            text="我的需求"
            itemKey="my"
          />
          <Nav.Item
            onClick={() => nav('new')}
            text="发布需求"
            itemKey="new"
          />
        </Nav>
      </Layout.Sider>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};