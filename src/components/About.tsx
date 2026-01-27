import { memo, useEffect, useState } from 'react';
import { Anchor, Button, Flex, Text } from '@mantine/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { getVersion } from '@tauri-apps/api/app';
import { useTranslation } from 'react-i18next';
import UpdaterModal from './UpdaterModal';
import { checkForUpdate } from '@/services/updater';
import { Update } from '@tauri-apps/plugin-updater';

function About() {
  const [appVersion, setAppVersion] = useState('.....');
  const [update, setUpdate] = useState<Update | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [checking, setChecking] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    void getVersion().then(setAppVersion);
  }, []);

  // 手动检查更新
  const handleCheckUpdate = async () => {
    setChecking(true);
    const result = await checkForUpdate();
    if (result) {
      setUpdate(result);
      setModalOpened(true);
    }
    setChecking(false);
  };

  const titleAndLinks = [
    {
      title: 'Developed by:',
      link: { url: 'https://github.com/bruceblink', label: '@bruceblink' },
    },
    {
      title: 'Source code:',
      link: { url: 'https://github.com/bruceblink/JustTodo', label: '@bruceblink/JustTodo' },
    },
    {
      title: 'Report a bug:',
      link: {
        url: 'https://github.com/bruceblink/JustTodo/issues',
        label: '@bruceblink/JustTodo/issues',
      },
    },
    {
      title: 'Community: ',
      link: {
        url: 'https://github.com/bruceblink/JustTodo/discussions',
        label: '@bruceblink/JustTodo/discussions',
      },
    },
    {
      title: 'Buy me a coffee:',
      link: { url: 'https://www.buymeacoffee.com/bruceblink', label: 'BuyMeACoffee/@bruceblink' },
    },
  ];

  return (
    <Flex align="center" justify="center" direction="column" gap="md">
      <Text fw={700}>JustTodo</Text>

      <Text display="flex">
        <Anchor
          mx="xs"
          onClick={() =>
            openUrl(`https://github.com/bruceblink/JustTodo/releases/tag/v${appVersion}`)
          }
        >
          v{appVersion}
        </Anchor>
      </Text>

      <Button variant="outline" loading={checking} onClick={handleCheckUpdate}>
        {t('Check for updates')}
      </Button>

      {titleAndLinks.map((item, index) => (
        <Text key={index} display="flex">
          {item.title}
          <Anchor mx="xs" onClick={() => openUrl(item.link.url)}>
            {item.link.label}
          </Anchor>
        </Text>
      ))}

      {/* 调用弹窗组件 */}
      <UpdaterModal update={update} opened={modalOpened} onClose={() => setModalOpened(false)} />
    </Flex>
  );
}

export default memo(About);
