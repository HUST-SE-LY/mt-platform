import { useUserStore } from '@/stores/userStore';
import { Badge, Layout, Nav } from '@douyinfe/semi-ui';
import '@/routes/index.css';
import { Outlet, useLocation, useNavigate } from '@modern-js/runtime/router';
import { useMemo } from 'react';

export default () => {
  const userStore = useUserStore();
  const location = useLocation();
  const nav = useNavigate();
  const navItemKey = useMemo(
    () => location.pathname.split('/').pop() as string,
    [location]
  );
  console.log(location);
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
            onClick={() => nav('baseInfo')}
            text="个人信息"
            itemKey="baseInfo"
          />
          <Nav.Item
            onClick={() => nav('unread')}
            text={`未读消息(${userStore.userInfo.unread})`}
            itemKey="unread"
          />
        </Nav>
      </Layout.Sider>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};
