import {
  FilterTwoTone,
  FileOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { Button, Modal, Tabs, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { FileMetadata, Filter } from '../../../types';
import FileTypeFilter from './FiltersUI/FileTypeFilter';
import FileNameFilterUI from './FiltersUI/FileNameFilterUI';
import FileSizeFilterUI from './FiltersUI/FileSizeFilterUI';
import FileDateCreatedFilterUI from './FiltersUI/FileDateCreatedFilterUI';
import FileDateModifiedFilterUI from './FiltersUI/FileDateModifiedFilterUI';
import { useFilterStore } from '@renderer/store/filterStore';
import { useFilesStore } from '@renderer/store/filesStore';
import { useElectronAPI } from '@renderer/hooks/useElectronAPI';
import { getFilesBasedOnAppliedFilter } from './utils';

type Props = {
  filesList: FileMetadata[];
  onApplyFilters: (filteredFiles: FileMetadata[], appliedFilters: Filter[]) => void;
};

const FilesTableTitlebar = ({ filesList, onApplyFilters }: Props): React.ReactNode => {
  const { applyFilters } = useElectronAPI();
  const appliedFilters = useFilterStore((state) => state.filters);
  const loadedFiles = useFilesStore((state) => state.files);
  const removeFilter = useFilterStore((state) => state.removeFilter);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const AVAILABLE_FILTERS = useMemo(
    () => [
      {
        name: 'extension',
        label: 'File Type',
        icon: <FileOutlined />,
        content: <FileTypeFilter filesList={filesList} />
      },
      {
        name: 'name',
        label: 'Name',
        icon: <UnorderedListOutlined />,
        content: <FileNameFilterUI />
      },
      {
        name: 'size',
        label: 'File Size',
        icon: <InboxOutlined />,
        content: <FileSizeFilterUI />
      },
      {
        name: 'dateCreated',
        label: 'Date Created',
        icon: <CalendarOutlined />,
        content: <FileDateCreatedFilterUI />
      },
      {
        name: 'dateModified',
        label: 'Date Modified',
        icon: <CalendarOutlined />,
        content: <FileDateModifiedFilterUI />
      }
    ],
    [filesList]
  );

  const onRemoveFilter = async (filterType: Filter['type']): Promise<void> => {
    const updatedFilters = removeFilter(filterType);

    if (updatedFilters.length === 0) {
      onApplyFilters([], updatedFilters);
      return;
    }
    const filtersRes = await applyFilters({ files: loadedFiles, filters: updatedFilters });
    if (filtersRes.data) {
      onApplyFilters(getFilesBasedOnAppliedFilter(loadedFiles, filtersRes.data), updatedFilters);
    } else {
      console.log('Failed to remove filter');
    }
  };

  const onClickApplyFilters = async (): Promise<void> => {
    if (appliedFilters.length === 0) {
      setOpenFiltersModal(false);
      onApplyFilters([], appliedFilters);
      return;
    }
    const filtersRes = await applyFilters({ files: loadedFiles, filters: appliedFilters });
    if (filtersRes.data) {
      onApplyFilters(getFilesBasedOnAppliedFilter(loadedFiles, filtersRes.data), appliedFilters);
      setOpenFiltersModal(false);
    } else {
      console.log('Failed to apply filters');
    }
  };
  return (
    <>
      <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* <Input.Search
          size="medium"
          placeholder="Search files: filename..."
          style={{ width: 250 }}
        /> */}
        <Button
          onClick={() => setOpenFiltersModal(true)}
          size="medium"
          variant="outlined"
          color="primary"
          icon={<FilterTwoTone />}
        >
          Filters
        </Button>
        {appliedFilters.map((filter) => {
          return (
            <Tag
              closable
              onClose={() => onRemoveFilter(filter.type)}
              color={'blue'}
              key={filter.type}
            >
              {filter.type}
            </Tag>
          );
        })}
      </span>
      <Modal
        destroyOnHidden
        onCancel={() => setOpenFiltersModal(false)}
        width={600}
        styles={{
          body: {
            height: 350
          }
        }}
        okText="Apply Filters"
        onOk={onClickApplyFilters}
        title={'Filters'}
        open={openFiltersModal}
      >
        <Tabs
          tabPlacement={'start'}
          centered
          items={AVAILABLE_FILTERS.map((filter) => {
            return {
              label: filter.label,
              key: filter.name,
              icon: filter.icon,

              children: filter.content
            };
          })}
        />
      </Modal>
    </>
  );
};

export default FilesTableTitlebar;
