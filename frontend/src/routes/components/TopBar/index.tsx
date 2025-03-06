import { useUserStore } from '@/stores/userStore';
import { Avatar, Badge, Nav } from '@douyinfe/semi-ui';
import { Link, useNavigate } from '@modern-js/runtime/router';

export default function () {
  const userStore = useUserStore();
  const nav = useNavigate();

  return (
    <div>
      <Nav mode="horizontal">
        <Nav.Header text="机器翻译平台" link="/" />
        <Nav.Footer>
          {userStore.isLogin ? (
            <>
              <Link to="/user/baseInfo">
                <Badge count={userStore.userInfo.unread}>
                  <Avatar size="small" alt={userStore.userInfo.name}>
                    {userStore.userInfo.name}
                  </Avatar>
                </Badge>
              </Link>
            </>
          ) : (
            <p
              onClick={() => nav('/login')}
              style={{
                cursor: 'pointer',
              }}
            >
              登录/注册
            </p>
          )}
        </Nav.Footer>
      </Nav>
    </div>
  );
}
