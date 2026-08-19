import { Route, Routes } from 'react-router';

import LayoutRoute from './routes/LayoutRoute';
import HomeRoute from './routes/HomeRoute';
import ElectronAPIProvider from './contexts/electron/ElectronAPIProvider';
import SettingsRoute from './routes/SettingsRoute';
import AboutRoute from './routes/AboutRoute';
import { ConfigProvider } from 'antd';
function App(): React.JSX.Element {
  return (
    <ElectronAPIProvider>
      <ConfigProvider modal={{ mask: { blur: true } }} message={{ style: { marginTop: 30 } }}>
        <Routes>
          <Route element={<LayoutRoute />}>
            <Route path="/" element={<HomeRoute />} />
            <Route path="settings" element={<SettingsRoute />} />
            <Route path="about" element={<AboutRoute />} />
          </Route>
        </Routes>
      </ConfigProvider>
    </ElectronAPIProvider>
  );
}

export default App;