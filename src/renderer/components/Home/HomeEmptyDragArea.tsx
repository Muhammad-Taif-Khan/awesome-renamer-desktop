import React from 'react';
import FilesLoadIllustration from '../../assets/load-files-illustration.png';
import { Button, Divider, Image, Typography, Upload, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useElectronAPI } from '@renderer/hooks/useElectronAPI';
import { useFilesStore } from '@renderer/store/filesStore';

const HomeEmptyDragArea = (): React.ReactNode => {
  const { getMetadataForFiles } = useElectronAPI();
  const setFiles = useFilesStore((state) => state.setFiles);
  const getFilesMetadata = async (files: FileList | File[]): Promise<void> => {
    const filesRestult = await getMetadataForFiles({ files: Array.from(files) });
    if (filesRestult.data) {
      setFiles(filesRestult.data);
    }
  };

  const onDrop: UploadProps['onDrop'] = (event) => {
    getFilesMetadata(event.dataTransfer.files);
  };

  const onSelectAndGetMetadataForFiles = async (): Promise<void> => {
    // Implementation for selecting files and getting their metadata
    const filesRestult = await getMetadataForFiles({ method: 'native' });
    if (filesRestult.message) {
      setFiles(filesRestult.data || []);
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Upload.Dragger
        openFileDialogOnClick={false}
        showUploadList={false}
        beforeUpload={() => false}
        accept="*"
        onDrop={onDrop}
        style={{ width: 600 }}
        name="file"
        multiple={true}
      >
        <div>
          <Image
            style={{
              width: 200
            }}
            preview={false}
            src={FilesLoadIllustration}
            alt="Load Files"
          />
        </div>

        <Typography.Paragraph type="secondary" strong>
          Drag and drop files or folder here to get started with renaming.
        </Typography.Paragraph>

        <Divider plain orientation={'horizontal'}>
          OR
        </Divider>
        <Button onClick={onSelectAndGetMetadataForFiles} type="primary" icon={<PlusOutlined />}>
          Add Files
        </Button>
      </Upload.Dragger>
    </div>
  );
};

export default React.memo(HomeEmptyDragArea);
