import { ColorSchemeType } from '@/types/ISetting';
import { defaultAppSettings } from '@/settings/settingsSchema';

const loadAppSettings = vi.fn();

vi.mock('@/settings/settingsPersistence.ts', () => ({
  loadAppSettings,
}));

describe('useSettingStore', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    loadAppSettings.mockResolvedValue({ ...defaultAppSettings });
  });

  it('starts with defaults from schema', async () => {
    const { useSettingStore } = await import('./useSettingStore');

    const state = useSettingStore.getState();
    expect(state.hydrated).toBe(false);
    expect(state.language).toBe(defaultAppSettings.language);
    expect(state.theme).toBe(defaultAppSettings.theme);
    expect(state.allowAutoStartUp).toBe(defaultAppSettings.allowAutoStartUp);
    expect(state.closeToTray).toBe(defaultAppSettings.closeToTray);
  });

  it('updates fields through store actions', async () => {
    const { useSettingStore } = await import('./useSettingStore');

    useSettingStore.getState().setLanguage('zh-CN');
    useSettingStore.getState().setTheme(ColorSchemeType.Light);
    useSettingStore.getState().setAllowAutoStartUp(true);
    useSettingStore.getState().setCloseToTray(false);

    const next = useSettingStore.getState();
    expect(next.language).toBe('zh-CN');
    expect(next.theme).toBe(ColorSchemeType.Light);
    expect(next.allowAutoStartUp).toBe(true);
    expect(next.closeToTray).toBe(false);
  });

  it('hydrates state from persistence', async () => {
    loadAppSettings.mockResolvedValueOnce({
      version: 1,
      language: 'zh-TW',
      theme: ColorSchemeType.Dark,
      allowAutoStartUp: true,
      closeToTray: false,
    });

    const { useSettingStore } = await import('./useSettingStore');

    await useSettingStore.getState().initSettings();

    const hydrated = useSettingStore.getState();
    expect(hydrated.hydrated).toBe(true);
    expect(hydrated.language).toBe('zh-TW');
    expect(hydrated.theme).toBe(ColorSchemeType.Dark);
    expect(hydrated.allowAutoStartUp).toBe(true);
    expect(hydrated.closeToTray).toBe(false);
    expect(loadAppSettings).toHaveBeenCalledTimes(1);
  });
});

export {};
