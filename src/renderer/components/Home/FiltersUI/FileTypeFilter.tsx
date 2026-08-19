import React, { useMemo } from 'react';
import { FileMetadata, FileTypesFilter } from '../../../../types';
import { Flex, Select, Space, Typography } from 'antd';
import FileIconDisplayer from '@renderer/components/elements/FileIconDisplayer';
import { useFilterStore } from '@renderer/store/filterStore';

type Props = {
  filesList: FileMetadata[];
};

const FileTypeFilter = ({ filesList }: Props): React.ReactNode => {
  const getFilter = useFilterStore((state) => state.getFilter);
  const setFilter = useFilterStore((state) => state.setFilter);
  const availaleFileTypes = useMemo(
    () =>
      Object.keys(
        Object.groupBy(filesList, (file) => {
          return '.' + file.name.toLowerCase().split('.').at(-1);
        })
      ),
    [filesList]
  );

  const onChangeExtensionValue = (values): void => {
    setFilter({
      type: 'extension',
      extensions: values
    });
  };
  return (
    <Flex vertical gap={10}>
      <Typography.Title level={5}>File Types</Typography.Title>
      <Typography.Text type="secondary">
        Select the file types that you want to be renamed
      </Typography.Text>
      <Select
        defaultValue={(getFilter('extension') as FileTypesFilter)?.extensions || []}
        onChange={onChangeExtensionValue}
        maxTagCount={'responsive'}
        mode="multiple"
        options={availaleFileTypes.map((fileType) => {
          return {
            label: (
              <Space>
                <FileIconDisplayer name={fileType} />
                {fileType.replace('.', '').toUpperCase()}
              </Space>
            ),
            value: fileType
          };
        })}
      />
    </Flex>
  );
};

export default FileTypeFilter;
