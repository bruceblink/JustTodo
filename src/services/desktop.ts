import { invoke } from '@tauri-apps/api/core';

export interface AppInfo {
  appVersion: string;
  packageName: string;
  platform: string;
  dev: boolean;
}

export function getAppInfo() {
  return invoke<AppInfo>('get_app_info');
}

export function showMainWindow() {
  return invoke<void>('show_main_window');
}

export function setCloseToTray(enabled: boolean) {
  return invoke<void>('set_close_to_tray', { enabled });
}
