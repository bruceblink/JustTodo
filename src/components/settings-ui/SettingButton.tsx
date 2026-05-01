import { Group, Text, Button, Paper, Stack } from '@mantine/core';
import { SettingButtonProps } from '@/types/ISetting.ts';

function SettingButton({ title, description, btnLabel, btnFunction }: SettingButtonProps) {
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
        <Button variant="outline" onClick={btnFunction}>
          {btnLabel}
        </Button>
      </Group>
    </Paper>
  );
}

export default SettingButton;
