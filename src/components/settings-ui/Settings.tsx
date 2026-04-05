import React, { memo, useEffect } from 'react';
import { Select } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import languages from '@/locale/languages.ts';
import { handleSettingChange } from '@utils/handleSettingChange.ts';
import { DispatchType } from '@/types/IEvents.ts';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '@/hooks/useSettingStore.tsx';
import { isEnabled } from '@tauri-apps/plugin-autostart';
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
  const { allowAutoStartUp, setAllowAutoStartUp } = useSettingStore();

  useEffect(() => {
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

  const settingSwitches: ISettingsContent[] = [
    {
      title: t('Auto start-up'),
      description: t('Automatically open JustTodo every time u start the computer'),
      checked: allowAutoStartUp,
      dispatchType: DispatchType.SwitchAppAutoStartUp,
    },
  ];

  const SettingSwitches = settingSwitches.map((setting, index) => {
    return <SettingSwitch {...setting} key={index} />;
  });

  return (
    <>
      {SettingSwitches}
      <Select
        leftSection={<IconLanguage />}
        allowDeselect={false}
        checkIconPosition={'right'}
        my={'sm'}
        label={t('Language')}
        placeholder="Pick one"
        // itemComponent={SelectItem}
        data={languages}
        maxDropdownHeight={400}
        value={i18n.language}
        onChange={(value) => handleSettingChange(DispatchType.ChangeAppLanguage, value as string)}
      />
    </>
  );
}

export default memo(Settings);
