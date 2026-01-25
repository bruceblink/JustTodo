import { ColorScheme } from '../types/ISetting';
import { useSettingStore } from '../hooks/useSettingStore';
import i18next from 'i18next';
import { DispatchType } from '../types/IEvents';
import { info } from '@tauri-apps/plugin-log';
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart';

interface IHandleSettingChange {
  (dispatchType: DispatchType, newValue: string | boolean | number): void;
}

export function toggleAutoStartUp(allowAutoStartUp: boolean) {
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
  const { setLanguage, setTheme, setAllowAutoStartUp } = useSettingStore.getState();

  void info(`Change setting, type: ${dispatchType}, value: ${newValue}`);

  switch (dispatchType) {
    case DispatchType.ChangeAppLanguage:
      setLanguage(newValue as string);
      void i18next.changeLanguage(newValue as string);
      localStorage.setItem('language', newValue as string);
      return;
    case DispatchType.ChangeAppTheme:
      setTheme(newValue as ColorScheme);
      localStorage.setItem('theme', newValue as string);
      return;
    case DispatchType.SwitchAppAutoStartUp:
      toggleAutoStartUp(newValue as boolean);
      setAllowAutoStartUp(newValue as boolean);
      return;
    default:
      return;
  }
};
