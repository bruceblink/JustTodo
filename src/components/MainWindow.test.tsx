import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { ColorSchemeType } from '@/types/ISetting';
import { DispatchType } from '@/types/IEvents';

const { setColorScheme, handleSettingChange } = vi.hoisted(() => ({
  setColorScheme: vi.fn(),
  handleSettingChange: vi.fn(),
}));

vi.mock('../hooks/useSettingStore.tsx', () => ({
  useSettingStore: () => ({
    theme: ColorSchemeType.Dark,
  }),
}));

vi.mock('@mantine/core', async () => {
  const actual = await vi.importActual<typeof import('@mantine/core')>('@mantine/core');
  return {
    ...actual,
    useMantineColorScheme: () => ({
      setColorScheme,
    }),
  };
});

vi.mock('../utils/handleSettingChange.ts', () => ({
  handleSettingChange,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('./Home', () => ({
  default: () => <div>Home View</div>,
}));

vi.mock('./settings-ui/Settings.tsx', () => ({
  default: () => <div>Settings View</div>,
}));

vi.mock('./About', () => ({
  default: () => <div>About View</div>,
}));

import MainWindow from './MainWindow';

describe('MainWindow interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('switches view tabs', async () => {
    const user = userEvent.setup();

    render(
      <MantineProvider>
        <MainWindow />
      </MantineProvider>,
    );

    expect(screen.getByText('Home View')).toBeInTheDocument();

    await user.click(screen.getByTitle('Settings'));
    expect(screen.getByText('Settings View')).toBeInTheDocument();

    await user.click(screen.getByTitle('About'));
    expect(screen.getByText('About View')).toBeInTheDocument();
  });

  it('toggles theme and dispatches setting change', async () => {
    const user = userEvent.setup();

    render(
      <MantineProvider>
        <MainWindow />
      </MantineProvider>,
    );

    await user.click(screen.getByTitle('Toggle theme'));

    expect(setColorScheme).toHaveBeenCalledWith(ColorSchemeType.Light);
    expect(handleSettingChange).toHaveBeenCalledWith(
      DispatchType.ChangeAppTheme,
      ColorSchemeType.Light,
    );
  });
});

export {};
