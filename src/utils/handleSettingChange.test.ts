import { DispatchType } from '@/types/IEvents';

const setLanguage = vi.fn();
const setTheme = vi.fn();
const setAllowAutoStartUp = vi.fn();
const setCloseToTray = vi.fn();

const changeLanguage = vi.fn();
const patchAppSettings = vi.fn();
const applyCloseToTrayPolicy = vi.fn();
const info = vi.fn();
const isEnabled = vi.fn();
const enable = vi.fn();
const disable = vi.fn();

vi.mock('../hooks/useSettingStore', () => ({
  useSettingStore: {
    getState: () => ({
      setLanguage,
      setTheme,
      setAllowAutoStartUp,
      setCloseToTray,
    }),
  },
}));

vi.mock('i18next', () => ({
  default: {
    changeLanguage,
  },
}));

vi.mock('@tauri-apps/plugin-log', () => ({
  info,
}));

vi.mock('@tauri-apps/plugin-autostart', () => ({
  isEnabled,
  enable,
  disable,
}));

vi.mock('@/settings/settingsPersistence.ts', () => ({
  patchAppSettings,
}));

vi.mock('@/services/desktop.ts', () => ({
  setCloseToTray: applyCloseToTrayPolicy,
}));

vi.mock('@/config/features.ts', () => ({
  featureFlags: {
    autostart: true,
    updater: false,
  },
}));

describe('handleSettingChange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isEnabled.mockResolvedValue(false);
    enable.mockResolvedValue(undefined);
    disable.mockResolvedValue(undefined);
    changeLanguage.mockResolvedValue(undefined);
    patchAppSettings.mockResolvedValue(undefined);
    applyCloseToTrayPolicy.mockResolvedValue(undefined);
    info.mockResolvedValue(undefined);
  });

  it('changes language and persists it', async () => {
    const { handleSettingChange } = await import('./handleSettingChange');

    handleSettingChange(DispatchType.ChangeAppLanguage, 'zh-CN');

    expect(setLanguage).toHaveBeenCalledWith('zh-CN');
    expect(changeLanguage).toHaveBeenCalledWith('zh-CN');
    expect(patchAppSettings).toHaveBeenCalledWith({ language: 'zh-CN' });
  });

  it('changes theme and persists it', async () => {
    const { handleSettingChange } = await import('./handleSettingChange');

    handleSettingChange(DispatchType.ChangeAppTheme, 'dark');

    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(patchAppSettings).toHaveBeenCalledWith({ theme: 'dark' });
  });

  it('changes autostart and persists it', async () => {
    const { handleSettingChange } = await import('./handleSettingChange');

    handleSettingChange(DispatchType.SwitchAppAutoStartUp, true);
    await Promise.resolve();
    await Promise.resolve();

    expect(setAllowAutoStartUp).toHaveBeenCalledWith(true);
    expect(patchAppSettings).toHaveBeenCalledWith({ allowAutoStartUp: true });
    expect(isEnabled).toHaveBeenCalledTimes(1);
    expect(enable).toHaveBeenCalledTimes(1);
    expect(disable).not.toHaveBeenCalled();
  });

  it('changes close-to-tray policy and persists it', async () => {
    const { handleSettingChange } = await import('./handleSettingChange');

    handleSettingChange(DispatchType.SwitchCloseToTray, false);

    expect(setCloseToTray).toHaveBeenCalledWith(false);
    expect(applyCloseToTrayPolicy).toHaveBeenCalledWith(false);
    expect(patchAppSettings).toHaveBeenCalledWith({ closeToTray: false });
  });
});

export {};
