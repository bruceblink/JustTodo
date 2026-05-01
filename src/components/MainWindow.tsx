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
  type MantineTheme,
} from '@mantine/core';
import {
  IconSun,
  IconMoonStars,
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
import { ColorScheme, ColorSchemeType, ESettingTab } from '../types/ISetting';
import { DispatchType } from '../types/IEvents.ts';
import { handleSettingChange } from '../utils/handleSettingChange.ts';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '@/hooks/useSettingStore.tsx';

type LayoutMode = 'grid' | 'list';

function MainWindow() {
  const [activeTab, setActiveTab] = useState<ESettingTab>(ESettingTab.Home);
  const [mobileOpened, setMobileOpened] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('list');
  const { theme } = useSettingStore();
  const { t } = useTranslation();

  const navButtonStyle = (active: boolean) => (theme: MantineTheme) => ({
    borderRadius: theme.radius.sm,
    padding: '8px 10px',
    backgroundColor: active ? theme.colors.dark[6] : 'transparent',
    border: `1px solid ${active ? theme.colors.dark[4] : 'transparent'}`,
  });

  const toggleTheme = () => {
    const next = theme === ColorSchemeType.Dark ? ColorSchemeType.Light : ColorSchemeType.Dark;
    handleSettingChange(DispatchType.ChangeAppTheme, next as ColorScheme);
  };

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
      bg="dark.9"
    >
      <AppShell.Navbar
        bg="dark.8"
        style={(theme) => ({ borderRight: `1px solid ${theme.colors.dark[4]}` })}
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
                  backgroundColor: theme.colors.dark[7],
                  borderColor: theme.colors.dark[4],
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

            <Divider color="dark.4" />

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
            <Divider color="dark.4" />
            <UnstyledButton style={navButtonStyle(false)} onClick={toggleTheme}>
              <Group gap={10} wrap="nowrap">
                {theme === ColorSchemeType.Dark ? (
                  <IconSun size="0.95rem" />
                ) : (
                  <IconMoonStars size="0.95rem" />
                )}
                <Text>{t('Theme')}</Text>
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
              borderBottom: `1px solid ${theme.colors.dark[4]}`,
              backgroundColor: theme.colors.dark[8],
            })}
          >
            <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
              <Burger
                opened={mobileOpened}
                onClick={() => setMobileOpened((v) => !v)}
                hiddenFrom="sm"
                size="sm"
              />
              <Button variant="subtle" rightSection={<IconChevronDown size="0.85rem" />}>
                All Projects
              </Button>
            </Group>
            <Text fw={600} visibleFrom="sm">
              Overview
            </Text>
            <Group gap={6} wrap="nowrap">
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
          </Group>

          <Box p="md" style={(theme) => ({ borderBottom: `1px solid ${theme.colors.dark[4]}` })}>
            <Input
              leftSection={<IconSearch size="0.9rem" />}
              placeholder={t('Search Projects...')}
              size="md"
              styles={(theme) => ({
                input: {
                  backgroundColor: theme.colors.dark[8],
                  borderColor: theme.colors.dark[4],
                },
              })}
            />
          </Box>

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
