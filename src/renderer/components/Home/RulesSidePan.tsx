import { Card, Checkbox, Divider, Form, Input, Popover, Tag } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import RULES from '../../data/rules.json';

import { RenameRule } from 'awesome-renamer';
import { debounce } from '@renderer/utils/extra';

type Props = {
  onChangeRules: (rules: RenameRule[]) => void;
};

const rulesGroupedByInputType = Object.groupBy(RULES, (r) => (r.inputs ? 'inputs' : 'tags'));

function RulesSidePan({ onChangeRules }: Props): React.ReactNode {
  const [form] = Form.useForm();

  const onChangeRulesForm = debounce((): void => {
    console.log("called debounce");
    const values = form.getFieldsValue();

    const textRules: RenameRule[] = Object.entries(values)
      .filter(([, value]) => {
        if (!value || typeof value !== 'object') return false;
        return Object.values(value).some((v) => v !== undefined && v !== '' && v !== false);
      })
      .map(([type, value]) => {
        if (type === 'affixes') {
          return Object.keys(value as object).map((affix) => {
            return {
              type: affix,
              value: value![affix]
            };
          });
        }
        return {
          type,
          ...(value as object)
        } as RenameRule;
      })
      .flat() as RenameRule[];

    const booleanRules = Object.entries(values)
      .filter(([, rule]) => {
        if (typeof rule === 'boolean') {
          if (!rule) return false;
          return true;
        }
        return false;
      })
      .map(([type]) => {
        return {
          type: type
        };
      });
    const presets = values.presets ? [{ type: values.presets }] : [];
    console.log(textRules, booleanRules, presets);
    onChangeRules([...textRules, ...booleanRules, ...presets]);
  }, 600);

  return (
    <Card
      size="medium"
      style={{
        width: '100%',
        height: 'calc(100vh - 50px)',
        top: 10,
        margin: 0,
        overflow: 'hidden'
      }}
      title="Renaming Rules"
    >
      <div
        style={{
          height: '90%',
          overflowY: 'hidden',
          scrollbarWidth: 'none'
        }}
      >
        <Form
          style={{ width: '100%' }}
          form={form}
          layout="inline"
          defaultChecked
          onValuesChange={onChangeRulesForm}
        >
          {(rulesGroupedByInputType.inputs || []).map((R) =>
            R.inputs!.length > 1 ? (
              <Card
                key={R.type}
                size="small"
                title={R.name}
                style={{ marginBottom: 12 }}
                extra={
                  <Popover content={R.description}>
                    <InfoCircleTwoTone />
                  </Popover>
                }
              >
                {R.inputs!.map((inp) => (
                  <Form.Item
                    layout="horizontal"
                    key={inp.name}
                    name={[R.type, inp.name]}
                    label={inp.name}
                  >
                    <Input
                      type={inp.type}
                      variant={inp.type === 'text' ? 'underlined' : 'filled'}
                    />
                  </Form.Item>
                ))}
              </Card>
            ) : (
              <Form.Item
                key={R.type}
                name={[R.type]}
                label={R.inputs![0].type === 'checkbox' ? undefined : R.name}
                valuePropName={R.inputs![0].type === 'checkbox' ? 'checked' : 'value'}
              >
                {R.inputs![0].type === 'checkbox' ? (
                  <Checkbox title={R.description}>{R.name}</Checkbox>
                ) : (
                  <Input type={R.inputs![0].type} variant="underlined" />
                )}
              </Form.Item>
            )
          )}

          <Divider titlePlacement="left">Quick Presets</Divider>
          <Form.Item style={{ width: '100%' }} name={'presets'}>
            <Tag.CheckableTagGroup
              options={(rulesGroupedByInputType.tags || []).map((R) => ({
                value: R.type,
                label: R.name
              }))}
              // style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}

export default RulesSidePan;
