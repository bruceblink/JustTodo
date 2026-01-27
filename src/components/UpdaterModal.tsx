import { Anchor, Box, Button, Modal, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { openUrl } from '@tauri-apps/plugin-opener';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { checkForUpdate, installUpdate } from '@/services/updater';
import type { Update } from '@tauri-apps/plugin-updater';

interface UpdaterModalProps {
  /** 是否自动弹窗检查更新 */
  autoCheck?: boolean;
}

export default function UpdaterModal({ autoCheck = true }: UpdaterModalProps) {
  const { t } = useTranslation();
  const [update, setUpdate] = useState<Update | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!autoCheck) return;

    const fetchUpdate = async () => {
      const result = await checkForUpdate();
      if (result) {
        setUpdate(result);
        setOpened(true);
      }
    };

    void fetchUpdate();
  }, [autoCheck]);

  const handleInstall = async () => {
    if (!update) return;
    await installUpdate(update);
  };

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title={t('Update available')} size="lg">
      {update && (
        <Box>
          <Text>
            {t('JustTodo v{{version}} is available!', { version: update.version })}
            <Anchor
              mx="xs"
              onClick={() => openUrl('https://github.com/bruceblink/JustTodo/releases/latest')}
            >
              {t('(release note)')}
            </Anchor>
          </Text>

          {update.body && (
            <Box mt="sm">
              <Markdown remarkPlugins={[remarkGfm]}>{update.body}</Markdown>
            </Box>
          )}

          <Box mt="md">
            <Button variant="outline" onClick={() => setOpened(false)}>
              {t('Ignore')}
            </Button>
            <Button onClick={handleInstall}>{t('Install')}</Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
}
