import { Layout as SemiLayout } from '@douyinfe/semi-ui';
import { Outlet, useNavigate } from '@modern-js/runtime/router';
import TopBar from './components/TopBar';
import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import { http } from '@/utils/http';
export default function Layout() {
  const { Header, Footer } = SemiLayout;
  const userStore = useUserStore();
  const nav = useNavigate();
  useEffect(() => {
    http.get<any>('/user/auto_login').then((res) => {
      console.log(res);
      userStore.login();
      const {
        balance,
        company_name,
        email,
        phone,
        unread_message_count,
        user_type,
        username,
      } = res;
      userStore.setInfo({
        money: balance,
        enterprise: company_name || '',
        email: email || '',
        phone,
        unread: unread_message_count,
        userType: user_type,
        name: username,
      });
    }).catch(() => {
      nav('/login')
    });
  }, []);
  return (
    <SemiLayout>
      <Header>
        <TopBar />
      </Header>
      <Outlet />
      <Footer></Footer>
    </SemiLayout>
  );
}
