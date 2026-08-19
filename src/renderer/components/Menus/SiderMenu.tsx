import { Menu, type MenuProps } from 'antd';
import { FolderOpenOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Link } from 'react-router';

const menuItems = [
  { icon: FolderOpenOutlined, label: 'Files', page: '/' },
  { icon: SettingOutlined, label: 'Settings', page: '/settings' },
  { icon: InfoCircleOutlined, label: 'About', page: '/about' }
];
const items: MenuProps['items'] = menuItems.map((item, idx) => {
  const key = String(idx + 1);

  return {
    key,
    icon: React.createElement(item.icon),
    label: <Link to={item.page}>{item.label}</Link>
  };
});
function SiderMenu(): React.ReactNode {
  const [selectedKeys, setSelectedKeys] = useState(['1']);

  return (
    <Menu
      style={{
        height: '100%'
      }}
      selectedKeys={selectedKeys}
      onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
      mode="inline"
      items={items}
    />
  );
}

export default SiderMenu;
