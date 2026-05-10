import { render, screen, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const { setAllowAutoStartUp, isEnabled } = vi.hoisted(() => ({
  setAllowAutoStartUp: vi.fn(),
  isEnabled: vi.fn(),
}));

vi.mock('@/hooks/useSettingStore.tsx', () => ({
  useSettingStore: () => ({
    allowAutoStartUp: false,
    closeToTray: true,
    setAllowAutoStartUp,
  }),
}));

vi.mock('@tauri-apps/plugin-autostart', () => ({
  isEnabled,
}));

vi.mock('@/config/features.ts', () => ({
  featureFlags: {
    autostart: false,
    updater: false,
  },
}));

vi.mock('@/utils/handleSettingChange.ts', () => ({
  handleSettingChange: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

import Settings from './Settings';

describe('Settings feature guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hides autostart switch when feature is disabled', async () => {
    render(
      <MantineProvider>
        <Settings />
      </MantineProvider>,
    );

    expect(screen.queryByText('Auto start-up')).not.toBeInTheDocument();
    expect(screen.getByText('Close to tray')).toBeInTheDocument();

    await waitFor(() => {
      expect(setAllowAutoStartUp).toHaveBeenCalledWith(false);
    });
    expect(isEnabled).not.toHaveBeenCalled();
  });
});

export {};
