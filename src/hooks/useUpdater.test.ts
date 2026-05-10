const checkMock = vi.hoisted(() => vi.fn());
const relaunchMock = vi.hoisted(() => vi.fn());

vi.mock('@tauri-apps/plugin-updater', () => ({
  check: checkMock,
}));

vi.mock('@tauri-apps/plugin-process', () => ({
  relaunch: relaunchMock,
}));

describe('useUpdater', () => {
  beforeEach(() => {
    vi.resetModules();
    checkMock.mockReset();
    relaunchMock.mockReset();
  });

  it('returns disabled state when updater feature flag is off', async () => {
    vi.doMock('@/config/features.ts', () => ({
      featureFlags: { updater: false, autostart: true },
    }));

    const { renderHook } = await import('@testing-library/react');
    const { useUpdater } = await import('./useUpdater');

    const { result } = renderHook(() => useUpdater());

    expect(result.current.updaterEnabled).toBe(false);
    expect(result.current.hasUpdate).toBe(false);

    await expect(result.current.checkForUpdate()).resolves.toBeNull();
    expect(checkMock).not.toHaveBeenCalled();
  });

  it('checks update only once and installs when update exists', async () => {
    const downloadAndInstall = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = {
      version: '0.9.9',
      date: '2026-05-10',
      body: 'release notes',
      downloadAndInstall,
    };

    checkMock.mockResolvedValue(mockUpdate);

    vi.doMock('@/config/features.ts', () => ({
      featureFlags: { updater: true, autostart: true },
    }));

    const { renderHook } = await import('@testing-library/react');
    const { act } = await import('react');
    const { useUpdater } = await import('./useUpdater');

    const { result } = renderHook(() => useUpdater());

    await act(async () => {
      await result.current.checkForUpdate();
    });

    expect(checkMock).toHaveBeenCalledTimes(1);
    expect(result.current.checked).toBe(true);
    expect(result.current.hasUpdate).toBe(true);

    await act(async () => {
      await result.current.checkForUpdate();
    });

    expect(checkMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.installUpdate();
    });

    expect(downloadAndInstall).toHaveBeenCalledTimes(1);
    expect(relaunchMock).toHaveBeenCalledTimes(1);
  });
});
