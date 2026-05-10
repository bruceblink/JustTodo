import { memo, useEffect, useState } from 'react';
import { Anchor, Button, Card, Flex, Group, Stack, Text } from '@mantine/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { getVersion } from '@tauri-apps/api/app';
import { useTranslation } from 'react-i18next';
import UpdaterModal from '@/components/UpdaterModal';
import { useUpdater } from '@/hooks/useUpdater';
import { REPOSITORY_URL, SPONSORING_URL } from '@/lib/author';
import { getAppInfo, type AppInfo } from '@/services/desktop.ts';

function About() {
  const [appVersion, setAppVersion] = useState('.....');
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [updaterOpened, setUpdaterOpened] = useState(false);
  const { t } = useTranslation();

  const { update, checking, hasUpdate, updaterEnabled, checkForUpdate, installUpdate } =
    useUpdater();

  useEffect(() => {
    void getVersion().then(setAppVersion);
    void getAppInfo()
      .then(setAppInfo)
      .catch(() => setAppInfo(null));
  }, []);

  const handleCheckForUpdates = async () => {
    const result = await checkForUpdate();
    setUpdaterOpened(!!result);
  };

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

      {updaterEnabled && (
        <Button variant="outline" loading={checking} onClick={handleCheckForUpdates}>
          {t('Check for updates')}
        </Button>
      )}

      <Card withBorder radius="md" w="100%" maw={480}>
        <Stack gap="xs">
          <Text fw={600}>Desktop diagnostics</Text>
          <Group justify="space-between">
            <Text c="dimmed">Package</Text>
            <Text>{appInfo?.packageName ?? 'Unavailable'}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Platform</Text>
            <Text>{appInfo?.platform ?? 'Unavailable'}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Environment</Text>
            <Text>{appInfo ? (appInfo.dev ? 'Development' : 'Production') : 'Unavailable'}</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed">Version source</Text>
            <Text>{appInfo?.appVersion ?? appVersion}</Text>
          </Group>
        </Stack>
      </Card>

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
          opened={updaterOpened}
          update={update}
          onClose={() => setUpdaterOpened(false)}
          onInstall={installUpdate}
        />
      )}
    </Flex>
  );
}

export default memo(About);
