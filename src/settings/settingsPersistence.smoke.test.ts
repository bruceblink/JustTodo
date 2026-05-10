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

describe('settings persistence smoke', () => {
  beforeEach(() => {
    storeState.clear();
    mockStore.get.mockClear();
    mockStore.set.mockClear();
    mockStore.save.mockClear();
    localStorage.clear();
  });

  it('loads defaults, applies patch, and restores on next load', async () => {
    const { loadAppSettings, patchAppSettings } = await import('./settingsPersistence');

    const defaults = await loadAppSettings();
    expect(defaults.language).toBeDefined();

    await patchAppSettings({ closeToTray: false, allowAutoStartUp: false });

    const restored = await loadAppSettings();
    expect(restored.closeToTray).toBe(false);
    expect(restored.allowAutoStartUp).toBe(false);
    expect(mockStore.save).toHaveBeenCalled();
  });
});

export {};
