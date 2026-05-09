import { Switch, Group, Text, Divider } from '@mantine/core';
import { ISettingsContent } from '@/types/ISetting.ts';
import { handleSettingChange } from '@utils/handleSettingChange.ts';

function SettingSwitch({
  title,
  description,
  checked = false,
  dispatchType,
  component,
}: ISettingsContent) {
  return (
    <>
      <Group justify={'space-between'}>
        <div>
          <Text>{title}</Text>
          <Text maw={460} fz={'xs'} c={'dimmed'}>
            {description}
          </Text>
        </div>
        <Switch
          size={'lg'}
          checked={checked}
          onChange={(event) => handleSettingChange(dispatchType, event.target.checked)}
        />
      </Group>
      {component}
      <Divider my={'sm'} />
    </>
  );
}

export default SettingSwitch;
