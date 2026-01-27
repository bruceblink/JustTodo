import { Anchor, Box, Button, Modal, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { openUrl } from '@tauri-apps/plugin-opener';
import { relaunch } from '@tauri-apps/plugin-process';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Update } from '@tauri-apps/plugin-updater';

interface UpdaterModalProps {
  opened: boolean;
  onClose: () => void;
  update: Update | null;
}

export default function UpdaterModal({ opened, onClose, update }: UpdaterModalProps) {
  const { t } = useTranslation();

  const handleInstall = async () => {
    if (!update) return;
    await update.downloadAndInstall();
    await relaunch();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t('Update available')} size="lg">
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

          <Box
            mt="md"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <Button variant="outline" onClick={onClose}>
              {t('Ignore')}
            </Button>
            <Button onClick={handleInstall}>{t('Install')}</Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
}
