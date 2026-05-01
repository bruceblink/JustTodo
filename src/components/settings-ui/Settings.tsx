import React, { memo, useEffect } from 'react';
import { Card, Select, SegmentedControl, Stack, Text } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import languages from '@/locale/languages.ts';
import { handleSettingChange } from '@utils/handleSettingChange.ts';
import { DispatchType } from '@/types/IEvents.ts';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '@/hooks/useSettingStore.tsx';
import { isEnabled } from '@tauri-apps/plugin-autostart';
import { featureFlags } from '@/config/features.ts';
import SettingSwitch from './SettingSwitch.tsx';

interface ISettingsContent {
  title: string;
  description: string;
  checked: boolean;
  dispatchType: DispatchType;
  component?: React.ReactNode;
}

function Settings() {
  const { t, i18n } = useTranslation();
  const { allowAutoStartUp, setAllowAutoStartUp, theme } = useSettingStore();

  useEffect(() => {
    if (!featureFlags.autostart) {
      setAllowAutoStartUp(false);
      return;
    }

    let active = true;

    (async () => {
      try {
        const enabled = await isEnabled();
        if (active) {
          setAllowAutoStartUp(enabled);
        }
      } catch {
        if (active) {
          setAllowAutoStartUp(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [setAllowAutoStartUp]);

  const settingSwitches: ISettingsContent[] = featureFlags.autostart
    ? [
        {
          title: t('Auto start-up'),
          description: t('Automatically open WindowPet every time u start the computer'),
          checked: allowAutoStartUp,
          dispatchType: DispatchType.SwitchAppAutoStartUp,
        },
      ]
    : [];

  return (
    <Stack gap="sm">
      <Text fw={700} fz="xl">
        {t('Settings')}
      </Text>

      <Card
        bg="dark.8"
        withBorder
        radius="md"
        p="md"
        style={(theme) => ({ borderColor: theme.colors.dark[4] })}
      >
        <Stack gap="xs">
          <Text fw={600}>{t('Theme')}</Text>
          <SegmentedControl
            value={theme}
            onChange={(value) => handleSettingChange(DispatchType.ChangeAppTheme, value)}
            data={[
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' },
            ]}
          />
        </Stack>
      </Card>

      {settingSwitches.map((setting) => (
        <SettingSwitch {...setting} key={setting.dispatchType} />
      ))}

      <Card
        bg="dark.8"
        withBorder
        radius="md"
        p="md"
        style={(theme) => ({ borderColor: theme.colors.dark[4] })}
      >
        <Select
          leftSection={<IconLanguage size="1rem" />}
          allowDeselect={false}
          checkIconPosition="right"
          label={t('Language')}
          placeholder="Pick one"
          data={languages}
          maxDropdownHeight={400}
          value={i18n.language}
          onChange={(value) => handleSettingChange(DispatchType.ChangeAppLanguage, value as string)}
          styles={(theme) => ({
            input: {
              backgroundColor: theme.colors.dark[7],
              borderColor: theme.colors.dark[4],
            },
            dropdown: {
              backgroundColor: theme.colors.dark[8],
              borderColor: theme.colors.dark[4],
            },
          })}
        />
      </Card>
    </Stack>
  );
}

export default memo(Settings);
