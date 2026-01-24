import { memo } from 'react';
import { Select } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import languages from '../locale/languages.ts';
import { handleSettingChange } from '../utils/handleSettingChange.ts';
import { DispatchType } from '../types/IEvents.ts';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n.ts';

function Settings() {
  const { t } = useTranslation();
  return (
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
  );
}

export default memo(Settings);
