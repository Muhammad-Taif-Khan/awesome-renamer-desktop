import { ClearOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useElectronAPI } from '@renderer/hooks/useElectronAPI';
import { Button, Flex, message, Popconfirm, Space, Typography } from 'antd';
import { FileMetadata } from 'awesome-renamer';

type FileDashboardTableTitleBarProps = {
  filesCount: number;
  filesToRemoveCount: number;
  onFilesToRemove: () => void;
  onClearTable: () => void;
  onAddMoreFiles: (files: FileMetadata[]) => void;
};

const FileDashboardActions = ({
  filesCount,
  onClearTable,
  filesToRemoveCount,
  onFilesToRemove,
  onAddMoreFiles
}: FileDashboardTableTitleBarProps): React.ReactNode => {
  const { getMetadataForFiles } = useElectronAPI();
  const [msgAPI, msgCtx] = message.useMessage();
  const onClickAddMoreFiles = async (): Promise<void> => {
    const filesRestult = await getMetadataForFiles({ method: 'native' });
    if (filesRestult.data?.length) {
      msgAPI.open({
        key: 'files-load-msg',
        type: 'success',
        content: `${filesRestult.data.length} files loaded`
      });
      onAddMoreFiles(filesRestult.data);
    }
    if (filesRestult.error) {
      msgAPI.open({
        key: 'files-load-msg',
        type: 'error',
        content: `Failed to load files: ${filesRestult.error}`
      });
    }
  };
  return (
    <>
      {msgCtx}
      <Flex justify="space-between" align="center">
        <span>
          <Typography.Title level={5}>{`Files ${filesCount}`}</Typography.Title>
        </span>
        <Space>
          <Popconfirm
            title="Do you confirm to remove"
            description="This will remove all the selected files from from the app selection"
            okText="Remove"
            onConfirm={onFilesToRemove}
          >
            <Button danger disabled={filesToRemoveCount === 0} icon={<DeleteOutlined />}>
              Remove
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Do you confirm to clear the selection"
            description="This will remove all the files from the app"
            okText="Remove"
            onConfirm={onClearTable}
          >
            <Button danger icon={<ClearOutlined />}>
              Clear
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={onClickAddMoreFiles} icon={<PlusOutlined />}>
            Add Files
          </Button>
        </Space>
      </Flex>
    </>
  );
};

export default FileDashboardActions;
