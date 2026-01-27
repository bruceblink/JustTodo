import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

let cachedUpdate: Update | null = null;

/** 检查更新（缓存一次，避免重复请求） */
export async function checkForUpdate(): Promise<Update | null> {
  if (cachedUpdate) return cachedUpdate;
  const result = await check();
  if (result) {
    cachedUpdate = result;
    return result;
  }
  return null;
}

/** 获取缓存的 Update 对象 */
export function getCachedUpdate() {
  return cachedUpdate;
}

/** 安装更新并重启 */
export async function installUpdate(update: Update) {
  await update.downloadAndInstall();
  await relaunch();
}
