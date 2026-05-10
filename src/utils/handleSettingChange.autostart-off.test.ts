import { DispatchType } from '@/types/IEvents';

const setAllowAutoStartUp = vi.fn();
const setCloseToTray = vi.fn();
const patchAppSettings = vi.fn();
const isEnabled = vi.fn();
const enable = vi.fn();
const disable = vi.fn();

vi.mock('../hooks/useSettingStore', () => ({
  useSettingStore: {
    getState: () => ({
      setLanguage: vi.fn(),
      setTheme: vi.fn(),
      setAllowAutoStartUp,
      setCloseToTray,
    }),
  },
}));

vi.mock('i18next', () => ({
  default: {
    changeLanguage: vi.fn(),
  },
}));

vi.mock('@tauri-apps/plugin-log', () => ({
  info: vi.fn(),
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
  setCloseToTray: vi.fn(),
}));

vi.mock('@/config/features.ts', () => ({
  featureFlags: {
    autostart: false,
    updater: false,
  },
}));

describe('handleSettingChange autostart disabled', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips autostart side effects when feature is disabled', async () => {
    const { handleSettingChange } = await import('./handleSettingChange');

    handleSettingChange(DispatchType.SwitchAppAutoStartUp, true);
    await Promise.resolve();

    expect(setAllowAutoStartUp).not.toHaveBeenCalled();
    expect(patchAppSettings).not.toHaveBeenCalledWith({ allowAutoStartUp: true });
    expect(isEnabled).not.toHaveBeenCalled();
    expect(enable).not.toHaveBeenCalled();
    expect(disable).not.toHaveBeenCalled();
  });

  it('still handles close-to-tray updates normally', async () => {
    const { handleSettingChange } = await import('./handleSettingChange');

    handleSettingChange(DispatchType.SwitchCloseToTray, false);

    expect(setCloseToTray).toHaveBeenCalledWith(false);
    expect(patchAppSettings).toHaveBeenCalledWith({ closeToTray: false });
  });
});

export {};
