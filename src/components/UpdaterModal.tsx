import { Anchor, Box, Button, Modal, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { openUrl } from '@tauri-apps/plugin-opener';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Update } from '@tauri-apps/plugin-updater';

interface UpdaterModalProps {
  opened: boolean;
  update: Update;
  onClose: () => void;
  onInstall: () => void;
}

export default function UpdaterModal({ opened, update, onClose, onInstall }: UpdaterModalProps) {
  const { t } = useTranslation();

  return (
    <Modal opened={opened} onClose={onClose} title={t('Update available')} size="lg">
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
          <Button onClick={onInstall}>{t('Install')}</Button>
        </Box>
      </Box>
    </Modal>
  );
}
