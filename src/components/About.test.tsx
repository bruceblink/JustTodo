import { render, screen, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const { useUpdater, getAppInfo, getVersion } = vi.hoisted(() => ({
  useUpdater: vi.fn(),
  getAppInfo: vi.fn(),
  getVersion: vi.fn(),
}));

vi.mock('@/hooks/useUpdater', () => ({
  useUpdater,
}));

vi.mock('@/services/desktop.ts', () => ({
  getAppInfo,
}));

vi.mock('@tauri-apps/api/app', () => ({
  getVersion,
}));

vi.mock('@tauri-apps/plugin-opener', () => ({
  openUrl: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/components/UpdaterModal', () => ({
  default: () => <div>Updater Modal</div>,
}));

import About from './About';

describe('About updater visibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getVersion.mockResolvedValue('0.2.1');
    getAppInfo.mockResolvedValue({
      appVersion: '0.2.1',
      packageName: 'justtodo',
      platform: 'windows',
      dev: false,
    });
  });

  it('hides update button when updater is disabled', async () => {
    useUpdater.mockReturnValue({
      update: null,
      checking: false,
      hasUpdate: false,
      updaterEnabled: false,
      checked: false,
      checkForUpdate: vi.fn(),
      installUpdate: vi.fn(),
    });

    render(
      <MantineProvider>
        <About />
      </MantineProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Check for updates')).not.toBeInTheDocument();
      expect(screen.getByText('justtodo')).toBeInTheDocument();
    });
  });

  it('shows update button when updater is enabled', async () => {
    useUpdater.mockReturnValue({
      update: null,
      checking: false,
      hasUpdate: false,
      updaterEnabled: true,
      checked: false,
      checkForUpdate: vi.fn(),
      installUpdate: vi.fn(),
    });

    render(
      <MantineProvider>
        <About />
      </MantineProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Check for updates')).toBeInTheDocument();
    });
  });
});

export {};
