import { memo, useEffect, useMemo, useState } from 'react';
import { Anchor, Button, Flex, Text } from '@mantine/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { getVersion } from '@tauri-apps/api/app';
import { useTranslation } from 'react-i18next';

function About() {
  const [appVersion, setAppVersion] = useState('.....');
  const { t } = useTranslation();

  useEffect(() => {
    getVersion().then((version) => {
      setAppVersion(version);
    });

    return () => {
      setAppVersion('.....');
    };
  }, []);

  const titleAndLinks = useMemo(
    () => [
      {
        title: 'Developed by:',
        link: {
          url: 'https://github.com/bruceblink',
          label: '@bruceblink',
        },
      },
      {
        title: 'Source code:',
        link: {
          url: 'https://github.com/bruceblink/JustTodo',
          label: '@bruceblink/JustTodo',
        },
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
        link: {
          url: 'https://www.buymeacoffee.com/bruceblink',
          label: 'BuyMeACoffee/@bruceblink',
        },
      },
    ],
    [],
  );

  return (
    <Flex align={'center'} justify={'center'} direction={'column'} gap={'md'}>
      <Text fw={700}>JustTodo</Text>
      <Text display={'flex'}>
        <Anchor
          mx={'xs'}
          onClick={() =>
            openUrl(`https://github.com/bruceblink/JustTodo/releases/tag/v${appVersion}`)
          }
        >
          v{appVersion}
        </Anchor>
      </Text>
      <Button variant={'outline'}>{t('Check for updates')}</Button>
      {titleAndLinks.map((item, index) => (
        <Text key={`titleAndLinks-${index}`} display={'flex'}>
          {item.title}
          <Anchor mx={'xs'} onClick={() => openUrl(item.link.url)}>
            {item.link.label}
          </Anchor>
        </Text>
      ))}
    </Flex>
  );
}

export default memo(About);
