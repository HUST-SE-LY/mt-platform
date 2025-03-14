import { Layout, Nav } from '@douyinfe/semi-ui';
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
            onClick={() => nav('project')}
            text="我的项目"
            itemKey="project"
          />
          <Nav.Item
            onClick={() => nav('memory')}
            text="记忆库管理"
            itemKey="memory"
          />
          <Nav.Item
            onClick={() => nav('term')}
            text="术语库管理"
            itemKey="term"
          />
        </Nav>
      </Layout.Sider>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};