import { memo, useEffect, useMemo, useState } from 'react';
import {
  AppShell,
  ActionIcon,
  Anchor,
  Box,
  Divider,
  Flex,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCat,
  IconSettings,
  IconInfoCircle,
  IconSun,
  IconMoonStars,
  IconCheckbox,
} from '@tabler/icons-react';
import { getVersion } from '@tauri-apps/api/app';
import { openUrl } from '@tauri-apps/plugin-opener';

import Home from './Home';
import Settings from './settings-ui/Settings.tsx';
import About from './About';
import { ColorScheme, ColorSchemeType, ESettingTab, SideNavBarTabs } from '../types/ISetting';
import { useSettingStore } from '../hooks/useSettingStore.tsx';
import { DispatchType } from '../types/IEvents.ts';
import { handleSettingChange } from '../utils/handleSettingChange.ts';
import { useTranslation } from 'react-i18next';
import { REPOSITORY_URL } from '@/lib/author';

const SIDEBAR_WIDTH = 160;
const STATUSBAR_HEIGHT = 24;

function MainWindow() {
  const { theme: colorScheme } = useSettingStore();
  const [activeTab, setActiveTab] = useState<ESettingTab>(ESettingTab.Home);
  const [appVersion, setAppVersion] = useState('...');
  const { setColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();
  const isDark = colorScheme === ColorSchemeType.Dark;

  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme =
      value ||
      (colorScheme === ColorSchemeType.Dark ? ColorSchemeType.Light : ColorSchemeType.Dark);
    setColorScheme(newTheme);
    handleSettingChange(DispatchType.ChangeAppTheme, newTheme);
  };

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    void getVersion().then(setAppVersion);
  }, []);

  const tabs: SideNavBarTabs[] = useMemo(
    () => [
      {
        tab: ESettingTab.Home,
        label: t('Home'),
        Icon: <IconCat size="1rem" />,
        Component: Home,
      },
      {
        tab: ESettingTab.Settings,
        label: t('Settings'),
        Icon: <IconSettings size="1rem" />,
        Component: Settings,
      },
      {
        tab: ESettingTab.About,
        label: t('About'),
        Icon: <IconInfoCircle size="1rem" />,
        Component: About,
      },
    ],
    [t],
  );

  const CurrentView = tabs.find((tab) => tab.tab === activeTab)?.Component;

  return (
    <AppShell
      padding={0}
      navbar={{ width: SIDEBAR_WIDTH, breakpoint: 0 }}
      footer={{ height: STATUSBAR_HEIGHT }}
    >
      {/* ── Sidebar ── */}
      <AppShell.Navbar
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: STATUSBAR_HEIGHT,
        }}
      >
        {/* 顶部品牌标识 */}
        <Flex align="center" gap={6} px="sm" py="xs" style={{ flexShrink: 0 }}>
          <IconCheckbox size="1.1rem" color="var(--mantine-color-green-6)" />
          <Text size="sm" fw={700} style={{ letterSpacing: 0.3 }}>
            JustTodo
          </Text>
        </Flex>

        <Divider />

        {/* 导航菜单 */}
        <ScrollArea style={{ flex: 1 }}>
          <Stack gap={2} p={6}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.tab}
                label={tab.label}
                leftSection={tab.Icon}
                active={activeTab === tab.tab}
                onClick={() => setActiveTab(tab.tab)}
                styles={{
                  root: { borderRadius: 'var(--mantine-radius-sm)', padding: '6px 10px' },
                  label: { fontSize: 'var(--mantine-font-size-sm)' },
                }}
              />
            ))}
          </Stack>
        </ScrollArea>

        {/* 底部操作区 */}
        <Box style={{ flexShrink: 0 }}>
          <Divider />
          <Flex px="xs" py={6} align="center" justify="center">
            <Tooltip label={t('Toggle theme')} position="right" withArrow>
              <ActionIcon
                size={32}
                variant="subtle"
                onClick={() => toggleColorScheme()}
              >
                {isDark ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>
      </AppShell.Navbar>

      {/* ── Main content ── */}
      <AppShell.Main>
        <ScrollArea
          h={`calc(100vh - ${STATUSBAR_HEIGHT}px)`}
        >
          <Box p="lg">{CurrentView ? <CurrentView /> : null}</Box>
        </ScrollArea>
      </AppShell.Main>

      {/* ── Status Bar ── */}
      <AppShell.Footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          backgroundColor: isDark
            ? 'var(--mantine-color-dark-9)'
            : 'var(--mantine-color-green-9)',
        }}
      >
        <Anchor
          size="xs"
          style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}
          onClick={() => void openUrl(`${REPOSITORY_URL}/releases/tag/v${appVersion}`)}
        >
          JustTodo v{appVersion}
        </Anchor>
        <Anchor
          size="xs"
          style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}
          onClick={() => void openUrl('https://likanug.top')}
        >
          © {new Date().getFullYear()} likanug
        </Anchor>
      </AppShell.Footer>
    </AppShell>
  );
}

export default memo(MainWindow);
