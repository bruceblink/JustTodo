import { memo, useEffect, useMemo, useState } from 'react';
import {
  AppShell,
  ActionIcon,
  Badge,
  Box,
  Burger,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCat,
  IconSettings,
  IconInfoCircle,
  IconSun,
  IconMoonStars,
  IconSearch,
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconChevronDown,
} from '@tabler/icons-react';

import Home from './Home';
import Settings from './settings-ui/Settings.tsx';
import About from './About';
import { ColorScheme, ColorSchemeType, ESettingTab, SideNavBarTabs } from '../types/ISetting';
import { useSettingStore } from '../hooks/useSettingStore.tsx';
import { DispatchType } from '../types/IEvents.ts';
import { handleSettingChange } from '../utils/handleSettingChange.ts';
import { useTranslation } from 'react-i18next';

function MainWindow() {
  const { theme: colorScheme } = useSettingStore();
  const [activeTab, setActiveTab] = useState<ESettingTab>(ESettingTab.Home);
  const [mobileOpened, setMobileOpened] = useState(false);
  const { setColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();

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

  const tabs: SideNavBarTabs[] = useMemo(
    () => [
      {
        tab: ESettingTab.Home,
        label: t('Projects'),
        Icon: <IconCat size="0.95rem" />,
        Component: Home,
      },
      {
        tab: ESettingTab.Settings,
        label: t('Settings'),
        Icon: <IconSettings size="0.95rem" />,
        Component: Settings,
      },
      {
        tab: ESettingTab.About,
        label: t('About'),
        Icon: <IconInfoCircle size="0.95rem" />,
        Component: About,
      },
    ],
    [t],
  );

  const CurrentView = tabs.find((tab) => tab.tab === activeTab)?.Component;

  const sidebar = (
    <Flex h="100%" direction="column" justify="space-between" p={10} bg="dark.8">
      <Stack gap="sm">
        <Group justify="space-between" align="center" px={4} py={6}>
          <Text fw={600} fz="sm" c="gray.0">
            JustTodo
          </Text>
          <Badge variant="light" size="xs" color="gray">
            beta
          </Badge>
        </Group>
        <Divider color="dark.4" />
        <Stack gap={4}>
          {tabs.map((tab) => (
            <UnstyledButton
              key={tab.tab}
              onClick={() => {
                setActiveTab(tab.tab);
                setMobileOpened(false);
              }}
              style={(theme) => ({
                borderRadius: theme.radius.sm,
                padding: '7px 10px',
                backgroundColor: activeTab === tab.tab ? theme.colors.dark[6] : 'transparent',
                border: `1px solid ${activeTab === tab.tab ? theme.colors.dark[4] : 'transparent'}`,
              })}
            >
              <Group gap={8} wrap="nowrap">
                <Box c={activeTab === tab.tab ? 'gray.0' : 'dark.1'}>{tab.Icon}</Box>
                <Text fz="13px" fw={500} c={activeTab === tab.tab ? 'gray.0' : 'dark.1'}>
                  {tab.label}
                </Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Stack>

      <Stack gap="xs">
        <Divider color="dark.4" />
        <Tooltip label={t('Toggle theme')} position="right">
          <UnstyledButton
            onClick={() => toggleColorScheme()}
            style={(theme) => ({
              borderRadius: theme.radius.sm,
              padding: '7px 10px',
              border: `1px solid ${theme.colors.dark[4]}`,
              backgroundColor: theme.colors.dark[7],
            })}
          >
            <Group gap={8} wrap="nowrap">
              {colorScheme === ColorSchemeType.Dark ? (
                <IconSun size="0.95rem" />
              ) : (
                <IconMoonStars size="0.95rem" />
              )}
              <Text fz="13px" c="dark.1">
                {t('Theme')}
              </Text>
            </Group>
          </UnstyledButton>
        </Tooltip>
      </Stack>
    </Flex>
  );

  return (
    <AppShell
      padding={0}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
      bg="dark.9"
    >
      <AppShell.Navbar>{sidebar}</AppShell.Navbar>

      <AppShell.Main>
        <Flex direction="column" h="100vh">
          <Group
            px="md"
            py={10}
            justify="space-between"
            wrap="nowrap"
            style={(theme) => ({
              borderBottom: `1px solid ${theme.colors.dark[4]}`,
              backgroundColor: theme.colors.dark[8],
            })}
          >
            <Group gap={10} wrap="nowrap" style={{ minWidth: 0 }}>
              <Burger
                opened={mobileOpened}
                onClick={() => setMobileOpened((opened) => !opened)}
                hiddenFrom="sm"
                size="sm"
              />
              <Button
                variant="subtle"
                size="compact-sm"
                color="gray"
                rightSection={<IconChevronDown size="0.8rem" />}
              >
                {t('All Projects')}
              </Button>
              <Input
                placeholder={t('Search Projects...')}
                leftSection={<IconSearch size="0.85rem" />}
                size="sm"
                w={{ base: 160, sm: 340 }}
              />
            </Group>
            <Group gap={6} wrap="nowrap">
              <ActionIcon variant="subtle" size="lg" color="gray">
                <IconLayoutGrid size="0.95rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size="lg" color="gray">
                <IconList size="0.95rem" />
              </ActionIcon>
              <Button leftSection={<IconPlus size="0.9rem" />} size="xs">
                {t('Add New...')}
              </Button>
            </Group>
          </Group>

          <ScrollArea flex={1} type="scroll" scrollbars="y">
            <Box p="md">{CurrentView ? <CurrentView /> : <Text>Empty</Text>}</Box>
          </ScrollArea>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
}

export default memo(MainWindow);
