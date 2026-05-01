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

  const sidebar = (
    <Flex h="100%" direction="column" justify="space-between" p="sm" bg="dark.8">
      <Stack gap="sm">
        <Group justify="space-between" align="center" px="xs" py={6}>
          <Text fw={600} fz="sm">
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
                padding: '8px 10px',
                backgroundColor: activeTab === tab.tab ? theme.colors.dark[6] : 'transparent',
                border: `1px solid ${activeTab === tab.tab ? theme.colors.dark[4] : 'transparent'}`,
              })}
            >
              <Group gap="sm" wrap="nowrap">
                <Box c={activeTab === tab.tab ? 'gray.0' : 'dimmed'}>{tab.Icon}</Box>
                <Text fz="sm" c={activeTab === tab.tab ? 'gray.0' : 'dimmed'}>
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
              padding: '8px 10px',
              border: `1px solid ${theme.colors.dark[4]}`,
            })}
          >
            <Group gap="sm" wrap="nowrap">
              {colorScheme === ColorSchemeType.Dark ? (
                <IconSun size="1rem" />
              ) : (
                <IconMoonStars size="1rem" />
              )}
              <Text fz="sm" c="dimmed">
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
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
      bg="dark.9"
    >
      <AppShell.Navbar>{sidebar}</AppShell.Navbar>

      <AppShell.Main>
        <Flex direction="column" h="100vh">
          <Group
            px="md"
            py="sm"
            justify="space-between"
            wrap="nowrap"
            style={(theme) => ({
              borderBottom: `1px solid ${theme.colors.dark[4]}`,
              backgroundColor: theme.colors.dark[8],
            })}
          >
            <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
              <Burger
                opened={mobileOpened}
                onClick={() => setMobileOpened((opened) => !opened)}
                hiddenFrom="sm"
                size="sm"
              />
              <Button variant="subtle" rightSection={<IconChevronDown size="0.9rem" />}>
                {t('All Projects')}
              </Button>
              <Input
                placeholder={t('Search Projects...')}
                leftSection={<IconSearch size="0.9rem" />}
                w={{ base: 160, sm: 360 }}
              />
            </Group>
            <Group gap="xs" wrap="nowrap">
              <ActionIcon variant="subtle" size="lg">
                <IconLayoutGrid size="1rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size="lg">
                <IconList size="1rem" />
              </ActionIcon>
              <Button leftSection={<IconPlus size="0.95rem" />} size="sm">
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
