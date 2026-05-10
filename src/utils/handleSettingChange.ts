import { ColorScheme } from '../types/ISetting';
import { useSettingStore } from '../hooks/useSettingStore';
import i18next from 'i18next';
import { DispatchType } from '../types/IEvents';
import { info } from '@tauri-apps/plugin-log';
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart';
import { patchAppSettings } from '@/settings/settingsPersistence.ts';
import { featureFlags } from '@/config/features.ts';
import { setCloseToTray as applyCloseToTrayPolicy } from '@/services/desktop.ts';

interface IHandleSettingChange {
  (dispatchType: DispatchType, newValue: string | boolean | number): void;
}

export function toggleAutoStartUp(allowAutoStartUp: boolean) {
  if (!featureFlags.autostart) return;

  (async () => {
    const hasEnabledStartUp = await isEnabled();

    if (allowAutoStartUp) {
      if (!hasEnabledStartUp) await enable();
    } else if (hasEnabledStartUp) {
      await disable();
    }
  })();
}

export const handleSettingChange: IHandleSettingChange = (dispatchType, newValue) => {
  const { setLanguage, setTheme, setAllowAutoStartUp, setCloseToTray } = useSettingStore.getState();

  void info(`Change setting, type: ${dispatchType}, value: ${newValue}`);

  switch (dispatchType) {
    case DispatchType.ChangeAppLanguage:
      setLanguage(newValue as string);
      void i18next.changeLanguage(newValue as string);
      void patchAppSettings({ language: newValue as string });
      return;
    case DispatchType.ChangeAppTheme:
      setTheme(newValue as ColorScheme);
      void patchAppSettings({ theme: newValue as ColorScheme });
      return;
    case DispatchType.SwitchAppAutoStartUp:
      if (!featureFlags.autostart) return;
      toggleAutoStartUp(newValue as boolean);
      setAllowAutoStartUp(newValue as boolean);
      void patchAppSettings({ allowAutoStartUp: newValue as boolean });
      return;
    case DispatchType.SwitchCloseToTray:
      setCloseToTray(newValue as boolean);
      void applyCloseToTrayPolicy(newValue as boolean);
      void patchAppSettings({ closeToTray: newValue as boolean });
      return;
    default:
      return;
  }
};
