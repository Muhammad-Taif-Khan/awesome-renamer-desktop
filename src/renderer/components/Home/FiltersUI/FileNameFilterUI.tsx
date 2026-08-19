import { useFilterStore } from '@renderer/store/filterStore';
import { Flex, Form, Select, Typography } from 'antd';
import { useEffect } from 'react';
import { FileNameFilter } from '../../../../types';

const FileNameFilterUI = (): React.ReactNode => {
  const getFilter = useFilterStore((state) => state.getFilter);
  const setFilter = useFilterStore((state) => state.setFilter);
  const [form] = Form.useForm();
  useEffect(() => {
    const filterFormValues: Partial<FileNameFilter> = {
      ...((getFilter('filename') as FileNameFilter) || {
        type: 'filename',
        startsWith: [],
        endsWith: [],
        contains: []
      })
    };

    delete filterFormValues.type;
    form.setFieldsValue(filterFormValues);
  }, [form, getFilter]);

  const onFilterValuesChange = (
    _: Partial<Record<string, string[]>>,
    values: Omit<FileNameFilter, 'type'>
  ): void => {
    setFilter({ type: 'filename', ...values });
  };

  return (
    <Flex vertical gap={10}>
      <Typography.Title level={5}>Filename Text Match</Typography.Title>
      <Typography.Text type="secondary">
        Any filename that starts, ends and contains certain text will be selected for rename
      </Typography.Text>
      <Form onValuesChange={onFilterValuesChange}>
        <Form.Item label="Starts With" name={'startsWith'}>
          <Select maxTagCount={'responsive'} allowClear mode="tags" />
        </Form.Item>
        <Form.Item label="Ends With" name={'endsWith'}>
          <Select maxTagCount={'responsive'} allowClear mode="tags" />
        </Form.Item>
        <Form.Item label="Contains" name={'contains'}>
          <Select maxTagCount={'responsive'} allowClear mode="tags" />
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default FileNameFilterUI;
