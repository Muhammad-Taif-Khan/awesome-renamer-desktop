import { Flex, Form, InputNumber, Select, Space, Typography } from 'antd';
import React from 'react';
import { FileSizeUnits } from '../../../../types';
import { useFilterStore } from '@renderer/store/filterStore';
import { convertSizeToBytes } from '@renderer/utils/file-size';

const fileSizeUnits: FileSizeUnits[] = ['Bytes', 'KB', 'MB', 'GB'];

const FileSizeFilterUI = (): React.ReactNode => {
  const setFilter = useFilterStore((state) => state.setFilter);
  const onFormValuesChange = (_, { maxSize, minSize }): void => {
    const max = maxSize?.maxSize;
    const maxUnit = maxSize?.unit;
    const min: number = minSize?.minSize;
    const minUnit = minSize?.unit;
    const size: Record<'min' | 'max', number | undefined> = {
      min: undefined,
      max: undefined
    };
    if (max) {
      size.max =  maxUnit ? convertSizeToBytes(max, maxUnit): undefined;
    }
    if (min ) {
      size.min = minUnit ?  convertSizeToBytes(min, minUnit): undefined;
    }
    setFilter({
      type: 'size',
      ...size
    });
  };
  return (
    <Flex vertical gap={10}>
      <Typography.Title level={5}>File Size Match</Typography.Title>
      <Typography.Text type="secondary">
        Any file whose size fall under the selected range in the specified unit will be selected for
        rename
      </Typography.Text>
      <Form onValuesChange={onFormValuesChange}>
        <Form.Item label="Min Size">
          <Space.Compact>
            <Form.Item name={['minSize', 'minSize']} noStyle>
              <InputNumber min={1} max={1024} />
            </Form.Item>
            <Form.Item name={['minSize', 'unit']} noStyle>
              <Select
                style={{ width: 100 }}

                placeholder="Select unit"
                options={fileSizeUnits.map((unit) => ({ label: unit, value: unit }))}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item label="Max Size">
          <Space.Compact>
            <Form.Item name={['maxSize', 'maxSize']} noStyle>
              <InputNumber min={1} max={1024} />
            </Form.Item>
            <Form.Item name={['maxSize', 'unit']} noStyle>
              <Select
                style={{ width: 100 }}
                placeholder="Select unit"
                options={fileSizeUnits.map((unit) => ({ label: unit, value: unit }))}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default React.memo(FileSizeFilterUI);
