import { create } from 'zustand';
import { ColorScheme, ISettingStoreState } from '../types/ISetting.ts';
import defaultSettings from '../../src-tauri/src/app/default/settings.json';

// initialize settings
export const useSettingStore = create<ISettingStoreState>()((set) => ({
  language: localStorage.getItem('language') ?? defaultSettings.language,
  setLanguage: (newLanguage) => {
    set({ language: newLanguage });
  },
  theme: (localStorage.getItem('theme') as ColorScheme) ?? defaultSettings.theme,
  setTheme: (newTheme) => {
    set({ theme: newTheme });
  },
}));
