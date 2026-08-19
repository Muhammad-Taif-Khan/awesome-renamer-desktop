import { datetimeEquals } from '@renderer/utils/date-time';
import { Alert, DatePicker, Flex, Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { FileCreatedAtFilter } from '../../../../types';
import { useFilterStore } from '@renderer/store/filterStore';

const FileDateCreatedFilterUI = (): React.ReactNode => {
  const [rangeInfo, setRangeInfo] = useState('');
  const getFilter = useFilterStore((state) => state.getFilter);
  const setFilter = useFilterStore((state) => state.setFilter);
  const [form] = Form.useForm();

  useEffect(() => {
    const filterFormValues: Partial<FileCreatedAtFilter> = {
      ...(getFilter('dateModified') as FileCreatedAtFilter)
    };
    form.setFieldsValue(filterFormValues);
  }, [form, getFilter]);

  const onDateSelectionChange = (_, values): void => {
    let from: Date | undefined = values.from?.toISOString();
    let to: Date | undefined = values.to?.toISOString();
    from = from && new Date(from);
    to = to && new Date(to);
    setFilter({
      from,
      to,
      type: "dateCreated"
    });
    if (from && to && datetimeEquals(from, to)) {
      setRangeInfo(
        `Any file created on the day of ${from.toLocaleDateString()} will be selected for rename`
      );
      return;
    }
    if (from && to) {
      setRangeInfo(
        `Any file created between ${from.toLocaleString()} and ${to.toLocaleString()} will be selected for rename`
      );
      return;
    }
    if (from) {
      setRangeInfo(
        `Any file created on or after ${from.toLocaleString()} will be selected for rename`
      );
      return;
    }
    if (to) {
      setRangeInfo(
        `Any file created on or before ${to.toLocaleString()} will be selected for rename`
      );
      return;
    }
    setRangeInfo('');
  };
  return (
    <Flex vertical gap={10}>
      <Typography.Title level={5}>File Creation Date Match</Typography.Title>
      <Typography.Text type="secondary">
        {`Any file created between the selected range, or on and after the "from" date, or on and before "to" date`}
      </Typography.Text>
      <Form onValuesChange={onDateSelectionChange}>
        <Form.Item label="From" name={'from'}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="To" name={'to'}>
          <DatePicker showTime />
        </Form.Item>
      </Form>
      {rangeInfo.length > 0 && <Alert description={rangeInfo} />}
    </Flex>
  );
};

export default FileDateCreatedFilterUI;

