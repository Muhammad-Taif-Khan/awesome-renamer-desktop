import SettingCard from '@renderer/components/elements/SettingCard';
import { getInvalidCharsSetting, setInvalidCharsSetting } from '@renderer/utils/settings-storage';
import { Flex, Select } from 'antd';
import React, { useEffect, useState } from 'react';

function SettingsRoute(): React.ReactNode {
  const [invalidCharsOption, setInvalidCharsOption] = useState('error');
  useEffect(() => {
    const savedSetting = getInvalidCharsSetting();
    if (!savedSetting) {
      setInvalidCharsSetting('error');
    }
    else{
      Promise.resolve().then(()=>setInvalidCharsOption(savedSetting));
    }
  }, []);

  return (
    <Flex style={{ width: '100%' }} vertical>
      <SettingCard
        actionElement={
          <Select
            style={{ width: 100 }}
            value={invalidCharsOption}
            onChange={(value) => {
              setInvalidCharsSetting(value as "escape" | "error");
              setInvalidCharsOption(value);
            }}
            options={[
              {
                label: 'Error',
                value: 'error'
              },
              {
                label: 'Escape',
                value: 'escape'
              }
            ]}
          />
        }
        title={'Invalid Characters'}
        description={'Handle invalid character in filename, either escape the invalid chars or throw error'}
      />
    </Flex>
  );
}

export default SettingsRoute;
