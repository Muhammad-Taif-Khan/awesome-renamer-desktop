import { BugOutlined, GithubOutlined, LinkOutlined } from '@ant-design/icons';
import { useElectronAPI } from '@renderer/hooks/useElectronAPI';
import LOGO from "../assets/icon-png.png";
import { Button, Card, Flex, Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import appLicenseText from '../../../LICENCE?raw';

const links = {
  package: 'https://www.npmjs.com/package/awesome-renamer',
  repository: 'https://github.com/Muhammad-Taif-Khan/awesome-renamer-desktop',
  issues: 'https://github.com/Muhammad-Taif-Khan/awesome-renamer-desktop/issues/new'
};


function AboutRoute(): React.ReactNode {
  const { getAppVersion } = useElectronAPI();
  const [appVersion, setAppVersion] = useState('');
  const [licensesOpen, setLicensesOpen] = useState(false);

  useEffect(() => {
    getAppVersion().then((version) => {
      setAppVersion(version);
    });
  }, [getAppVersion]);

  const openExternalLink = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Flex gap={10} justify="center" align="center" vertical>
      <img draggable={false} width={200} src={LOGO} />
      <Typography.Title level={3}>Awesome Renamer</Typography.Title>
      <Typography.Text type="secondary">Version {appVersion}</Typography.Text>
      <Typography.Text style={{width: "70%", textAlign: "center"}} type="secondary">
        {`A free & Open Source desktop app for quickly previewing and batch-renaming files with flexible rules and filters.`}
      </Typography.Text>
      <Card size='small'>
        <Flex gap="small" wrap>
          <Button
            icon={<LinkOutlined />}
            type="text"
            onClick={() => openExternalLink(links.package)}
          >
            awesome-renamer
          </Button>
          <Button
            icon={<GithubOutlined />}
            type="text"
            onClick={() => openExternalLink(links.repository)}
          >
            GitHub Repository
          </Button>
          <Button icon={<BugOutlined />} type="text" onClick={() => openExternalLink(links.issues)}>
            Report an Issue
          </Button>
        </Flex>
      </Card>

      <Card size="small">
        <Flex align="center" gap="middle" wrap>
          <Typography.Text type="secondary">
            View the MIT license for this app and licenses for core third-party dependencies.
          </Typography.Text>
          <Button onClick={() => setLicensesOpen(true)}>View license information</Button>
        </Flex>
      </Card>

      <Modal
        destroyOnHidden
        centered
        height={550}
        title="License information"
        open={licensesOpen}
        footer={null}
        onCancel={() => setLicensesOpen(false)}
        width={640}
      >
        <div style={{scrollbarWidth:"none",height: 500,overflowY: 'scroll'}}>
<Typography.Title level={5}>Awesome Renamer Desktop — MIT License</Typography.Title>
        <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
          {appLicenseText}
        </Typography.Paragraph>
        </div>
        
      </Modal>

      <Typography.Text type="secondary">
        &copy; {new Date().getFullYear() + ' '}
        <a
          style={{ color: 'inherit', textDecoration: 'underline' }}
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Muhammad-Taif-Khan/"
        >
          {'Muhammad Taif'}
        </a>
        . Released under the MIT License
      </Typography.Text>
    </Flex>
  );
}

export default AboutRoute;
