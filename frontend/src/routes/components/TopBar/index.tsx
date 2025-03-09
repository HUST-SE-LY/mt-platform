import { UserType } from '@/consts';
import { useUserStore } from '@/stores/userStore';
import { IconCard, IconChat, IconLocaleProvider } from '@douyinfe/semi-icons-lab';
import { Avatar, Badge, Nav } from '@douyinfe/semi-ui';
import { Link, useNavigate } from '@modern-js/runtime/router';

export default function () {
  const userStore = useUserStore();
  const nav = useNavigate();

  return (
    <div>
      <Nav mode="horizontal">
        <Nav.Header text="机器翻译平台" link="/" />
        {
          userStore.userInfo.userType === UserType.Advertiser && <Nav.Item icon={<IconCard />} text="广告管理" link='/ads' />
        }
        {
          (userStore.userInfo.userType && [UserType.Pro, UserType.Admin, UserType.Enterprise].includes(userStore.userInfo.userType)) && <>
            <Nav.Item icon={<IconChat />} text="翻译市场" link='/market' />
            <Nav.Item icon={<IconLocaleProvider />} text="辅助翻译系统" link='/system' />
          </>
        }
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
