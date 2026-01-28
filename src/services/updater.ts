import { check, type Update } from '@tauri-apps/plugin-updater';

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
