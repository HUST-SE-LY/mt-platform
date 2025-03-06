import { Layout as SemiLayout } from '@douyinfe/semi-ui';
import { Outlet } from '@modern-js/runtime/router';
import TopBar from './components/TopBar';
export default function Layout() {
  const { Header, Footer } = SemiLayout;
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
