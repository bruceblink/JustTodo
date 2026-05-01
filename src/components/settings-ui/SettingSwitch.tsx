import { Switch, Group, Text, Paper, Stack, useMantineColorScheme } from '@mantine/core';
import { ISettingsContent } from '@/types/ISetting.ts';
import { handleSettingChange } from '@utils/handleSettingChange.ts';

function SettingSwitch({
  title,
  description,
  checked = false,
  dispatchType,
  component,
}: ISettingsContent) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={(theme) => ({
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
        backgroundColor: isDark ? theme.colors.dark[8] : theme.white,
      })}
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
