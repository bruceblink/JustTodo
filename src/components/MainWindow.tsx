import { memo, useState } from 'react';
import {
  AppShell,
  ActionIcon,
  Avatar,
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
  UnstyledButton,
  useMantineColorScheme,
  type MantineTheme,
} from '@mantine/core';
import {
  IconSettings,
  IconSearch,
  IconLayoutGrid,
  IconList,
  IconPlus,
  IconChevronDown,
  IconFolder,
  IconRocket,
  IconListDetails,
  IconChartBar,
  IconBolt,
  IconEye,
  IconShield,
  IconWorld,
  IconBuilding,
  IconUsers,
  IconDots,
} from '@tabler/icons-react';

import Home from './Home';
import Settings from './settings-ui/Settings.tsx';
import About from './About';
import { ESettingTab } from '../types/ISetting';
import { useTranslation } from 'react-i18next';

type LayoutMode = 'grid' | 'list';

const getSurfaceColor = (theme: MantineTheme, isDark: boolean) =>
  isDark ? theme.colors.dark[8] : theme.white;

const getMutedSurfaceColor = (theme: MantineTheme, isDark: boolean) =>
  isDark ? theme.colors.dark[7] : theme.colors.gray[0];

const getBorderColor = (theme: MantineTheme, isDark: boolean) =>
  isDark ? theme.colors.dark[4] : theme.colors.gray[3];

function MainWindow() {
  const [activeTab, setActiveTab] = useState<ESettingTab>(ESettingTab.Home);
  const [mobileOpened, setMobileOpened] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('list');
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const isHome = activeTab === ESettingTab.Home;
  const pageTitle =
    activeTab === ESettingTab.Settings
      ? t('Settings')
      : activeTab === ESettingTab.About
        ? t('About')
        : 'Overview';

  const navButtonStyle = (active: boolean) => (theme: MantineTheme) => ({
    borderRadius: theme.radius.sm,
    padding: '8px 10px',
    backgroundColor: active
      ? isDark
        ? theme.colors.dark[6]
        : theme.colors.gray[1]
      : 'transparent',
    border: `1px solid ${active ? getBorderColor(theme, isDark) : 'transparent'}`,
  });

  const primaryNav = [
    { label: 'Deployments', icon: <IconRocket size="0.95rem" /> },
    { label: 'Logs', icon: <IconListDetails size="0.95rem" /> },
    { label: 'Analytics', icon: <IconChartBar size="0.95rem" /> },
    { label: 'Speed Insights', icon: <IconBolt size="0.95rem" /> },
    { label: 'Observability', icon: <IconEye size="0.95rem" /> },
    { label: 'Firewall', icon: <IconShield size="0.95rem" /> },
    { label: 'CDN', icon: <IconWorld size="0.95rem" /> },
  ];

  const secondaryNav = [
    { label: 'Environment Variables', icon: <IconBolt size="0.95rem" /> },
    { label: 'Domains', icon: <IconWorld size="0.95rem" /> },
    { label: 'Integrations', icon: <IconBuilding size="0.95rem" /> },
  ];

  return (
    <AppShell
      padding={0}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
    >
      <AppShell.Navbar
        style={(theme) => ({
          borderRight: `1px solid ${getBorderColor(theme, isDark)}`,
          backgroundColor: getSurfaceColor(theme, isDark),
        })}
      >
        <Flex h="100%" direction="column" justify="space-between" p="sm">
          <Stack gap="sm">
            <Group justify="space-between" px={4} wrap="nowrap">
              <Group gap={8} wrap="nowrap">
                <Avatar size={20} radius="xl" color="pink" />
                <Text fw={600} fz="sm" truncate>
                  likanug's projects
                </Text>
              </Group>
              <Badge color="red" variant="light" size="xs">
                Paused
              </Badge>
            </Group>

            <Input
              leftSection={<IconSearch size="0.9rem" />}
              rightSection={<Badge variant="outline">F</Badge>}
              placeholder="Find..."
              size="sm"
              styles={(theme) => ({
                input: {
                  backgroundColor: getMutedSurfaceColor(theme, isDark),
                  borderColor: getBorderColor(theme, isDark),
                },
              })}
            />

            <Stack gap={4}>
              <UnstyledButton
                style={navButtonStyle(activeTab === ESettingTab.Home)}
                onClick={() => setActiveTab(ESettingTab.Home)}
              >
                <Group gap={10} wrap="nowrap">
                  <IconFolder size="0.95rem" />
                  <Text fw={500}>Projects</Text>
                </Group>
              </UnstyledButton>
              {primaryNav.map((item) => (
                <UnstyledButton key={item.label} style={navButtonStyle(false)}>
                  <Group gap={10} wrap="nowrap">
                    <Box c="dimmed">{item.icon}</Box>
                    <Text c="dimmed" truncate>
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>

            <Divider color="gray.4" />

            <Stack gap={4}>
              {secondaryNav.map((item) => (
                <UnstyledButton key={item.label} style={navButtonStyle(false)}>
                  <Group gap={10} wrap="nowrap">
                    <Box c="dimmed">{item.icon}</Box>
                    <Text c="dimmed" truncate>
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          </Stack>

          <Stack gap="xs">
            <Divider color="gray.4" />
            <UnstyledButton
              style={navButtonStyle(activeTab === ESettingTab.Settings)}
              onClick={() => setActiveTab(ESettingTab.Settings)}
            >
              <Group gap={10} wrap="nowrap">
                <IconSettings size="0.95rem" />
                <Text>{t('Settings')}</Text>
              </Group>
            </UnstyledButton>
            <UnstyledButton style={navButtonStyle(false)}>
              <Group justify="space-between" wrap="nowrap">
                <Group gap={10} wrap="nowrap">
                  <IconUsers size="0.95rem" />
                  <Text truncate>Bruce Blink</Text>
                </Group>
                <IconDots size="0.9rem" />
              </Group>
            </UnstyledButton>
          </Stack>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>
        <Flex direction="column" h="100vh">
          <Group
            px="md"
            py="sm"
            justify="space-between"
            wrap="nowrap"
            style={(theme) => ({
              borderBottom: `1px solid ${getBorderColor(theme, isDark)}`,
              backgroundColor: getSurfaceColor(theme, isDark),
            })}
          >
            <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
              <Burger
                opened={mobileOpened}
                onClick={() => setMobileOpened((v) => !v)}
                hiddenFrom="sm"
                size="sm"
              />
              {isHome ? (
                <Button variant="subtle" rightSection={<IconChevronDown size="0.85rem" />}>
                  All Projects
                </Button>
              ) : (
                <Text fw={600}>{pageTitle}</Text>
              )}
            </Group>

            <Text fw={600} visibleFrom="sm">
              {pageTitle}
            </Text>

            <Group gap={6} wrap="nowrap" />
          </Group>

          {isHome && (
            <Box
              px="md"
              py="sm"
              style={(theme) => ({ borderBottom: `1px solid ${getBorderColor(theme, isDark)}` })}
            >
              <Group gap="sm" wrap="nowrap" align="center">
                <Input
                  leftSection={<IconSearch size="0.9rem" />}
                  placeholder={t('Search Projects...')}
                  size="md"
                  style={{ flex: 1 }}
                  styles={(theme) => ({
                    input: {
                      backgroundColor: getMutedSurfaceColor(theme, isDark),
                      borderColor: getBorderColor(theme, isDark),
                    },
                  })}
                />
                <ActionIcon
                  variant={layoutMode === 'grid' ? 'filled' : 'subtle'}
                  onClick={() => setLayoutMode('grid')}
                >
                  <IconLayoutGrid size="0.95rem" />
                </ActionIcon>
                <ActionIcon
                  variant={layoutMode === 'list' ? 'filled' : 'subtle'}
                  onClick={() => setLayoutMode('list')}
                >
                  <IconList size="0.95rem" />
                </ActionIcon>
                <Button leftSection={<IconPlus size="0.9rem" />} size="sm" visibleFrom="sm">
                  Add New...
                </Button>
              </Group>
            </Box>
          )}

          <ScrollArea flex={1} type="scroll" scrollbars="y">
            <Box p="md">
              {activeTab === ESettingTab.Home && <Home layoutMode={layoutMode} />}
              {activeTab === ESettingTab.Settings && <Settings />}
              {activeTab === ESettingTab.About && <About />}
            </Box>
          </ScrollArea>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
}

export default memo(MainWindow);
