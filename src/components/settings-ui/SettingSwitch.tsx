import { Switch, Group, Text, Paper, Stack } from '@mantine/core';
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
    <Paper
      bg="dark.8"
      withBorder
      radius="md"
      p="md"
      style={(theme) => ({ borderColor: theme.colors.dark[4] })}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4} style={{ minWidth: 0 }}>
          <Text fw={500}>{title}</Text>
          <Text fz="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
        <Switch
          size="md"
          checked={checked}
          onChange={(event) => handleSettingChange(dispatchType, event.target.checked)}
        />
      </Group>
      {component}
    </Paper>
  );
}

export default SettingSwitch;
