const storeState = new Map<string, unknown>();

const mockStore = {
  get: vi.fn(async (key: string) => storeState.get(key)),
  set: vi.fn(async (key: string, value: unknown) => {
    storeState.set(key, value);
  }),
  save: vi.fn(async () => undefined),
};

vi.mock('@tauri-apps/plugin-store', () => ({
  load: vi.fn(async () => mockStore),
}));

describe('settingsPersistence', () => {
  beforeEach(() => {
    storeState.clear();
    mockStore.get.mockClear();
    mockStore.set.mockClear();
    mockStore.save.mockClear();
    localStorage.clear();
  });

  it('migrates legacy language/theme from localStorage on first load', async () => {
    localStorage.setItem('language', 'zh-CN');
    localStorage.setItem('theme', 'light');

    const { loadAppSettings } = await import('./settingsPersistence');

    const settings = await loadAppSettings();

    expect(settings.language).toBe('zh-CN');
    expect(settings.theme).toBe('light');
    expect(localStorage.getItem('language')).toBeNull();
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('patches settings based on current normalized state', async () => {
    storeState.set('app_settings', {
      version: 1,
      language: 'en',
      theme: 'dark',
      allowAutoStartUp: false,
      closeToTray: true,
    });

    const { patchAppSettings, loadAppSettings } = await import('./settingsPersistence');

    const patched = await patchAppSettings({ closeToTray: false });
    expect(patched.closeToTray).toBe(false);

    const reloaded = await loadAppSettings();
    expect(reloaded.closeToTray).toBe(false);
    expect(reloaded.language).toBe('en');
    expect(mockStore.save).toHaveBeenCalled();
  });
});

export {};
