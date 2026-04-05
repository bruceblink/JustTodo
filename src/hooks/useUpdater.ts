import { useCallback, useState } from 'react';
import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { featureFlags } from '@/config/features.ts';

export function useUpdater() {
  const [update, setUpdate] = useState<Update | null>(null);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  /** 手动 / 自动检查更新（只检查一次，除非你主动扩展） */
  const checkForUpdate = useCallback(async () => {
    if (!featureFlags.updater) return null;
    if (checked) return update;

    setChecking(true);
    try {
      const result = await check();
      setUpdate(result);
      setChecked(true);
      return result;
    } finally {
      setChecking(false);
    }
  }, [checked, update]);

  /** 下载并安装更新，然后重启 */
  const installUpdate = useCallback(async () => {
    if (!featureFlags.updater) return;
    if (!update) return;
    await update.downloadAndInstall();
    await relaunch();
  }, [update]);

  return {
    update,
    checking,
    hasUpdate: featureFlags.updater && !!update,
    updaterEnabled: featureFlags.updater,
    checked,
    checkForUpdate,
    installUpdate,
  };
}
