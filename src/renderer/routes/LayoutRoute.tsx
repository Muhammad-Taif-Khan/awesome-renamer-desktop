import { Layout, theme } from 'antd';
import { Outlet } from 'react-router';
import SiderMenu from '../components/Menus/SiderMenu';

function LayoutRoute(): React.ReactNode {
 
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  return (
    <>
      <Layout>
        <Layout hasSider>
          <Layout.Sider
            collapsed
            style={{
              background: colorBgContainer,
              height: '100%',
              position: 'fixed',
              left: 0,
              top: 30,
              bottom: 0,
              borderRadius: borderRadiusLG
            }}
            className="site-layout-background"
          >
            <SiderMenu />
          </Layout.Sider>
        </Layout>

        <Layout.Content
          className="main-content"
          style={{
            height: 'calc(100vh - 30px)',
            marginLeft: 80,
            background: colorBgContainer,
            transition: 'margin 0.2s ease'
          }}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </>
  );
}

export default LayoutRoute;
