import { memo, useEffect } from 'react';
import { Card, Select, SegmentedControl, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import languages from '@/locale/languages.ts';
import { handleSettingChange } from '@utils/handleSettingChange.ts';
import { DispatchType } from '@/types/IEvents.ts';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '@/hooks/useSettingStore.tsx';
import { isEnabled } from '@tauri-apps/plugin-autostart';
import { featureFlags } from '@/config/features.ts';
import SettingSwitch from './SettingSwitch.tsx';
import type { ISettingsContent } from '@/types/ISetting.ts';

function Settings() {
  const { t, i18n } = useTranslation();
  const { allowAutoStartUp, setAllowAutoStartUp, theme } = useSettingStore();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

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
          description: t('Automatically open JustTodo every time u start the computer'),
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
        withBorder
        radius="md"
        p="md"
        style={(theme) => ({
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
          backgroundColor: isDark ? theme.colors.dark[8] : theme.white,
        })}
      >
        <Stack gap="xs">
          <Text fw={600}>{t('Theme')}</Text>
          <SegmentedControl
            value={theme}
            onChange={(value) => handleSettingChange(DispatchType.ChangeAppTheme, value)}
            data={[
              { label: t('Dark'), value: 'dark' },
              { label: t('Light'), value: 'light' },
            ]}
          />
        </Stack>
      </Card>

      {settingSwitches.map((setting) => (
        <SettingSwitch {...setting} key={setting.dispatchType} />
      ))}

      <Card
        withBorder
        radius="md"
        p="md"
        style={(theme) => ({
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
          backgroundColor: isDark ? theme.colors.dark[8] : theme.white,
        })}
      >
        <Select
          leftSection={<IconLanguage size="1rem" />}
          allowDeselect={false}
          checkIconPosition="right"
          label={t('Language')}
          placeholder={t('Pick one')}
          data={languages}
          maxDropdownHeight={400}
          value={i18n.language}
          onChange={(value) => handleSettingChange(DispatchType.ChangeAppLanguage, value as string)}
          styles={(theme) => ({
            input: {
              backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
            },
            dropdown: {
              backgroundColor: isDark ? theme.colors.dark[8] : theme.white,
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
            },
          })}
        />
      </Card>
    </Stack>
  );
}

export default memo(Settings);
