// src/components/MainWindow.tsx
import { memo, useMemo, useState } from 'react';
import {
  AppShell,
  ActionIcon,
  Box,
  Flex,
  ScrollArea,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconCat, IconSettings, IconInfoCircle, IconSun, IconMoonStars } from '@tabler/icons-react';

import Home from './Home';
import Settings from './settings-ui/Settings.tsx';
import About from './About';
import { ColorScheme, ColorSchemeType, ESettingTab, SideNavBarTabs } from '../types/ISetting';
import { useSettingStore } from '../hooks/useSettingStore.tsx';
import { DispatchType } from '../types/IEvents.ts';
import { handleSettingChange } from '../utils/handleSettingChange.ts';
import { useTranslation } from 'react-i18next';

function MainWindow() {
  /** 获取设置 */
  const { theme: colorScheme } = useSettingStore();
  /** 当前激活视图（桌面应用：状态 ≠ 路由） */
  const [activeTab, setActiveTab] = useState<ESettingTab>(ESettingTab.Home);

  /** 示例：主题状态（后面你可以接 store） */
  const { setColorScheme } = useMantineColorScheme();
  /** i18n */
  const { t } = useTranslation();

  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme =
      value ||
      (colorScheme === ColorSchemeType.Dark ? ColorSchemeType.Light : ColorSchemeType.Dark);

    setColorScheme(newTheme);
    handleSettingChange(DispatchType.ChangeAppTheme, newTheme);
  };

  /** Activity Bar 注册表 */
  const tabs: SideNavBarTabs[] = useMemo(
    () => [
      {
        tab: ESettingTab.Home,
        label: t('Home'),
        Icon: <IconCat size="1.2rem" />,
        Component: Home,
      },
      {
        tab: ESettingTab.Settings,
        label: t('Settings'),
        Icon: <IconSettings size="1.2rem" />,
        Component: Settings,
      },
      {
        tab: ESettingTab.About,
        label: t('About'),
        Icon: <IconInfoCircle size="1.2rem" />,
        Component: About,
      },
    ],
    [t],
  );

  const CurrentView = tabs.find((t) => t.tab === activeTab)?.Component;

  return (
    <AppShell
      padding={0}
      navbar={{
        width: 64,
        breakpoint: 0,
      }}
    >
      {/* 左侧：Activity Bar（VS Code 同款语义） */}
      <AppShell.Navbar p="xs">
        <Flex h="100%" direction="column" justify="space-between" align="center">
          {/* 上：功能区 */}
          <Stack gap={6} align="center">
            {tabs.map((tab) => (
              <ActionIcon
                key={tab.tab}
                size={40}
                variant={activeTab === tab.tab ? 'filled' : 'subtle'}
                onClick={() => setActiveTab(tab.tab)}
                title={tab.label}
              >
                {tab.Icon}
              </ActionIcon>
            ))}
          </Stack>

          {/* 下：全局操作 */}
          <Stack gap={6} align="center">
            <ActionIcon
              size={36}
              variant="subtle"
              onClick={() => toggleColorScheme()}
              title={t('Toggle theme')}
            >
              {colorScheme === ColorSchemeType.Dark ? (
                <IconSun size="1.1rem" />
              ) : (
                <IconMoonStars size="1.1rem" />
              )}
            </ActionIcon>
          </Stack>
        </Flex>
      </AppShell.Navbar>

      {/* 右侧：Workbench */}
      <AppShell.Main>
        <ScrollArea h="100vh">
          <Box p="lg">{CurrentView ? <CurrentView /> : <Text>Empty</Text>}</Box>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}

export default memo(MainWindow);
