import { Badge, Layout, Nav } from '@douyinfe/semi-ui';
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
            onClick={() => nav('manage')}
            text="广告管理"
            itemKey="manage"
          />
          <Nav.Item
            onClick={() => nav('history')}
            text="购买历史"
            itemKey="history"
          />
          <Nav.Item
            onClick={() => nav('new')}
            text="投放新广告"
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