import { ColorScheme } from '../types/ISetting';
import { useSettingStore } from '../hooks/useSettingStore';
import i18next from 'i18next';
import { DispatchType } from '../types/IEvents';
import { info } from '@tauri-apps/plugin-log';

interface IHandleSettingChange {
  (dispatchType: DispatchType, newValue: string | boolean | number): void;
}
export const handleSettingChange: IHandleSettingChange = (dispatchType, newValue) => {
  const { setLanguage, setTheme } = useSettingStore.getState();

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
    default:
      return;
  }
};
