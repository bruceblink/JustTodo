const invoke = vi.fn();

vi.mock('@tauri-apps/api/core', () => ({
  invoke,
}));

describe('desktop service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests app info via tauri command', async () => {
    const mockInfo = {
      appVersion: '0.2.1',
      packageName: 'justtodo',
      platform: 'windows',
      dev: true,
    };
    invoke.mockResolvedValueOnce(mockInfo);

    const { getAppInfo } = await import('./desktop');
    const result = await getAppInfo();

    expect(invoke).toHaveBeenCalledWith('get_app_info');
    expect(result).toEqual(mockInfo);
  });

  it('shows main window via tauri command', async () => {
    invoke.mockResolvedValueOnce(undefined);

    const { showMainWindow } = await import('./desktop');
    await showMainWindow();

    expect(invoke).toHaveBeenCalledWith('show_main_window');
  });

  it('updates close-to-tray policy via tauri command', async () => {
    invoke.mockResolvedValueOnce(undefined);

    const { setCloseToTray } = await import('./desktop');
    await setCloseToTray(false);

    expect(invoke).toHaveBeenCalledWith('set_close_to_tray', { enabled: false });
  });
});

export {};
