import React, { Key, useState } from 'react';
import { FileMetadata } from '../../../types';
import {
  Badge,
  Button,
  Flex,
  Listy,
  Modal,
  Space,
  Splitter,
  Table,
  TableProps,
  Typography
} from 'antd';
import { formatBytes } from '@renderer/utils/file-size';
import FileIconDisplayer from '../elements/FileIconDisplayer';
import { ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import RulesSidePan from './RulesSidePan';
import FileDashboardActions from './FileDashboardActions';
import FilesTableTitlebar from './FilesTableTitlebar';
import { useFilesStore } from '@renderer/store/filesStore';
import { useFilterStore } from '@renderer/store/filterStore';
import {
  AwesomeRenameBatchReturnType,
  AwesomeRenameFailedRename,
  AwesomeRenameReturnValue,
  AwesomeRenameSuccessReturn,
  Filter,
  RenameRule
} from 'awesome-renamer';
import { useElectronAPI } from '@renderer/hooks/useElectronAPI';
import { getFilesBasedOnAppliedFilter } from './utils';
import { getInvalidCharsSetting } from '@renderer/utils/settings-storage';

const columns: TableProps<FileMetadata>['columns'] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    render: (name) => {
      return (
        <Space size={'small'}>
          <FileIconDisplayer name={name} />
          <Typography.Text strong>{name}</Typography.Text>
        </Space>
      );
    }
  },
  {
    key: 'path',
    title: 'Path',
    ellipsis: true,
    dataIndex: 'path'
  },
  {
    key: 'size',
    width: 80,
    title: 'Size',
    dataIndex: 'size',
    render: (size: number) => {
      return formatBytes(size);
    }
  },
  {
    key: 'mtime',
    title: 'L-Modified',
    width: 160,

    dataIndex: 'lastModified',
    render: (mtime: Date) => {
      return mtime.toLocaleString();
    }
  },
  {
    key: 'btime',
    title: 'Created At',
    width: '15%',
    dataIndex: 'createdAt',
    render: (mtime: Date) => {
      return mtime.toLocaleString();
    }
  }
];

function FilesDashboard(): React.ReactNode {
  const { applyFilters, previewRenameChanges, renameFiles } = useElectronAPI();
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [modalAPI, modalCtx] = Modal.useModal();
  const [filenamesPreviewChanges, setFilenamesPreviewChanges] = useState<
    (AwesomeRenameBatchReturnType & { id: string })[]
  >([]);
  const [selectedFilesToBeRemoved, setSelectedFilesToBeRemoved] = useState<Key[]>([]);
  const loadedFiles = useFilesStore((state) => state.files);
  const addFiles = useFilesStore((state) => state.addFiles);
  const setFiles = useFilesStore((state) => state.setFiles);
  const filters = useFilterStore((state) => state.filters);
  const removeFilesFromState = useFilesStore((state) => state.removeFiles);
  const clearAllFilesFromState = useFilesStore((state) => state.clearFiles);
  const [filteredFiles, setFilteredFiles] = useState<FileMetadata[]>(loadedFiles);
  const [rules, setRules] = useState<(RenameRule | { [key: string]: string })[]>([]);
  const onApplyFilters = (filteredList: FileMetadata[], appliedFilters: Filter[]): void => {
    if (appliedFilters.length) {
      setFilteredFiles(filteredList);
      return;
    }

    setFilteredFiles(loadedFiles);
  };

  const onClickRemoveFiles = (): void => {
    removeFilesFromState(selectedFilesToBeRemoved as string[]);
    setFilteredFiles((state) => {
      return state.filter((f) => {
        return !selectedFilesToBeRemoved.includes(f.path);
      });
    });
    setSelectedFilesToBeRemoved([]);
  };
  const onClearFiles = (): void => {
    clearAllFilesFromState();
  };
  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<FileMetadata>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedFilesToBeRemoved(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
    },
    selectedRowKeys: selectedFilesToBeRemoved
  };

  const onAddMoreFiles = async (files: FileMetadata[]): Promise<void> => {
    const updatedFiles = addFiles(files);

    if (filters.length === 0) {
      setFilteredFiles(updatedFiles);
      return;
    }
    const filtersRes = await applyFilters({ files: loadedFiles, filters: filters });
    if (filtersRes.data) {
      onApplyFilters(getFilesBasedOnAppliedFilter(loadedFiles, filtersRes.data), filters);
    } else {
      console.log('Failed to apply filters');
    }
  };

  const onClickPreviewChanges = async (): Promise<void> => {
    const previewResponse = await previewRenameChanges({
      files: filteredFiles,
      rules: rules as RenameRule[],
      options: {
        onInvalidChar: getInvalidCharsSetting()
      }
    });
    console.log(previewResponse);
    if (previewResponse.data) {
      setFilenamesPreviewChanges(previewResponse.data);
    }
    setOpenPreviewModal(true);
  };
  const onClickRenameFiles = async (): Promise<void> => {
    const renameRes = await renameFiles({
      files: filteredFiles,
      rules: rules as RenameRule[],
      options: {
        onInvalidChar: getInvalidCharsSetting()
      }
    });
    if (renameRes.data) {
      const renamedEntitiesMap = new Map<string, Record<string, string>>(
        renameRes.data
          .map((renamedEntity) => {
            if (renamedEntity.renamed) {
              return [
                renamedEntity.originalPath,
                { newName: (renamedEntity as AwesomeRenameSuccessReturn).newName, newPath: (renamedEntity as AwesomeRenameSuccessReturn).newPath }
              ];
            }
            return undefined;
          })
          .filter(Boolean) as []
      );
      //update filtered list paths and names

      setFilteredFiles((currenState) => {
        const updatedFilteredFiles = currenState.map((filteredEntity) => {
          const inRenamedMap = renamedEntitiesMap.get(filteredEntity.path);
          if (inRenamedMap) {
            filteredEntity.path = inRenamedMap.newPath;
            filteredEntity.name = inRenamedMap.newName;
          }
          return filteredEntity;
        });
        return updatedFilteredFiles;
      });

      const updatedOriginalFiles = loadedFiles.map((originalFile) => {
        const inRenamedMap = renamedEntitiesMap.get(originalFile.path);
        if (inRenamedMap) {
          originalFile.path = inRenamedMap.newPath;
          originalFile.name = inRenamedMap.newName;
        }
        return originalFile;
      });
      setFiles(updatedOriginalFiles);
      
      setOpenPreviewModal(false);
      modalAPI.success({
        title: "Files renamed result",
        content: `${renamedEntitiesMap.size} files renamed successfully!`
      });
    }
  };
  return (
    <>
    {modalCtx}
      <Splitter style={{ width: '100%', overflow: 'hidden' }}>
        <Splitter.Panel>
          <span
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              paddingRight: 20,
              paddingLeft: 20,
            }}
          >
            <FileDashboardActions
              onFilesToRemove={onClickRemoveFiles}
              filesToRemoveCount={selectedFilesToBeRemoved.length}
              onClearTable={onClearFiles}
              filesCount={filteredFiles.length}
              onAddMoreFiles={onAddMoreFiles}
            />
            <Table
              style={{ width: '100%' }}
              pagination={{ pageSize: 20, placement: ['bottomStart'] }}

              sticky
              styles={{
                section: {
                  height: '60vh',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none'
                }
              }}
              rowSelection={rowSelection}
              size="small"
              title={() => (
                <FilesTableTitlebar onApplyFilters={onApplyFilters} filesList={filteredFiles} />
              )}
              columns={columns}
              dataSource={filteredFiles.map((f) => {
                return {
                  ...f,
                  key: f.path
                };
              })}
            />
            <Flex justify="end" style={{ width: '95%' }}>
              <Button
                onClick={onClickPreviewChanges}
                iconPlacement="end"
                icon={<ArrowRightOutlined />}
                type="primary"
              >
                Preview Changes
              </Button>
            </Flex>
          </span>
        </Splitter.Panel>
        <Splitter.Panel
          max={'30%'}
          collapsible={{ start: true, end: true, showCollapsibleIcon: true }}
        >
          <RulesSidePan onChangeRules={(changedRules) => setRules(changedRules)} />
        </Splitter.Panel>
      </Splitter>
      {/* </Flex> */}
      <Modal
        centered
        onCancel={() => setOpenPreviewModal(false)}
        open={openPreviewModal}
        width={650}
        destroyOnHidden
        okButtonProps={{ icon: <CheckOutlined /> }}
        onOk={onClickRenameFiles}
        okText={'Rename'}
        footer={(originalNode) => {
          return (
            <Flex justify="space-between">
              <Space>
                <Space>
                  <Badge color={'cyan'} />
                  {` Total: ${filenamesPreviewChanges.length}`}
                </Space>

                <Space>
                  <Badge color={'green'} />
                  {`${filenamesPreviewChanges.filter((change) => change.renamed).length} Renamed`}
                </Space>
                <Space>
                  <Badge color={'volcano'} />
                  {`${filenamesPreviewChanges.filter((change) => !change.renamed).length} Failed`}
                </Space>
              </Space>
              <Space>{originalNode}</Space>
            </Flex>
          );
        }}
        title="Preview Changes"
      >
        {
          <Listy<AwesomeRenameBatchReturnType & { id: string }>
            height={450}
            style={{ width: '100%' }}
            rowKey={'id'}
            virtual
            itemRender={(change, idx) => {
              const newName = change.renamed && (change as AwesomeRenameReturnValue).newName;
              const originalName = (change as AwesomeRenameReturnValue).originalName;
              const failedError = !change.renamed && (change as AwesomeRenameFailedRename).error;
              return (
                <Flex justify="space-between" key={idx}>
                  <Space style={{ width: 300 }}>
                    <Typography.Link style={{ width: 50 }}>{idx + 1}</Typography.Link>

                    <Typography.Text style={{ width: 230 }}>{originalName}</Typography.Text>
                  </Space>
                  <Typography.Text type="secondary">
                    <ArrowRightOutlined />
                  </Typography.Text>

                  <Typography.Text style={{ width: 200 }} type={failedError ? 'danger' : 'success'}>
                    {failedError ? failedError : newName}
                  </Typography.Text>
                </Flex>
              );
            }}
            items={filenamesPreviewChanges}
          />
        }
      </Modal>
    </>
  );
}

export default FilesDashboard;
