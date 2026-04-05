import { create } from 'zustand';
import { ColorScheme, ISettingStoreState } from '../types/ISetting.ts';
import { defaultAppSettings } from '@/settings/settingsSchema.ts';
import { loadAppSettings } from '@/settings/settingsPersistence.ts';

// initialize settings-ui
export const useSettingStore = create<ISettingStoreState>()((set) => ({
  hydrated: false,
  language: defaultAppSettings.language,
  setLanguage: (newLanguage) => {
    set({ language: newLanguage });
  },
  theme: defaultAppSettings.theme as ColorScheme,
  setTheme: (newTheme) => {
    set({ theme: newTheme });
  },
  allowAutoStartUp: defaultAppSettings.allowAutoStartUp,
  setAllowAutoStartUp: (newBoolean) => {
    set({ allowAutoStartUp: newBoolean });
  },
  initSettings: async () => {
    const settings = await loadAppSettings();
    set({
      hydrated: true,
      language: settings.language,
      theme: settings.theme,
      allowAutoStartUp: settings.allowAutoStartUp,
    });
  },
}));
