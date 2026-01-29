import { memo, useEffect, useState } from 'react';
import { Anchor, Button, Flex, Text } from '@mantine/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { getVersion } from '@tauri-apps/api/app';
import { useTranslation } from 'react-i18next';
import UpdaterModal from '@/components/UpdaterModal';
import { useUpdater } from '@/hooks/useUpdater';
import { REPOSITORY_URL, SPONSORING_URL } from '@/lib/author';

function About() {
  const [appVersion, setAppVersion] = useState('.....');
  const { t } = useTranslation();

  const { update, checking, hasUpdate, checkForUpdate, installUpdate } = useUpdater();

  useEffect(() => {
    void getVersion().then(setAppVersion);
  }, []);

  const titleAndLinks = [
    {
      title: 'Developed by:',
      link: { url: `https://github.com/bruceblink`, label: '@bruceblink' },
    },
    {
      title: 'Source code:',
      link: { url: REPOSITORY_URL, label: '@bruceblink/JustTodo' },
    },
    {
      title: 'Report a bug:',
      link: {
        url: `${REPOSITORY_URL}/issues`,
        label: '@bruceblink/JustTodo/issues',
      },
    },
    {
      title: 'Community:',
      link: {
        url: `${REPOSITORY_URL}/discussions`,
        label: '@bruceblink/JustTodo/discussions',
      },
    },
    {
      title: 'Buy me a coffee:',
      link: { url: SPONSORING_URL, label: 'BuyMeACoffee/@bruceblink' },
    },
  ];

  return (
    <Flex align="center" justify="center" direction="column" gap="md">
      <Text fw={700}>JustTodo</Text>

      <Text display="flex">
        <Anchor mx="xs" onClick={() => openUrl(`${REPOSITORY_URL}/releases/tag/v${appVersion}`)}>
          v{appVersion}
        </Anchor>
      </Text>

      <Button variant="outline" loading={checking} onClick={checkForUpdate}>
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

      {hasUpdate && update && (
        <UpdaterModal
          opened={hasUpdate}
          update={update}
          onClose={() => {}}
          onInstall={installUpdate}
        />
      )}
    </Flex>
  );
}

export default memo(About);
