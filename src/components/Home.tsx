import { memo } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  type MantineTheme,
} from '@mantine/core';
import {
  IconActivity,
  IconDots,
  IconGitBranch,
  IconBrandGithub,
  IconExternalLink,
  IconInfoCircle,
  IconWaveSine,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { projects, usageItems } from './home-data';

interface HomeProps {
  layoutMode: 'grid' | 'list';
}

const getSurfaceColor = (theme: MantineTheme, isDark: boolean) =>
  isDark ? theme.colors.dark[8] : theme.white;

const getBorderColor = (theme: MantineTheme, isDark: boolean) =>
  isDark ? theme.colors.dark[4] : theme.colors.gray[3];

function Home({ layoutMode }: HomeProps) {
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Grid gutter="md" align="stretch">
      <Grid.Col span={{ base: 12, xl: 4 }}>
        <Stack gap="md" h="100%">
          <Card
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({
              backgroundColor: getSurfaceColor(theme, isDark),
              borderColor: getBorderColor(theme, isDark),
            })}
          >
            <Stack gap="sm">
              <Group justify="space-between" wrap="nowrap">
                <Stack gap={2} style={{ minWidth: 0 }}>
                  <Group gap={6} wrap="nowrap">
                    <Text fw={700} c="red.4">
                      {t('Paused')}
                    </Text>
                    <IconAlertCircle size="0.9rem" color="var(--mantine-color-red-4)" />
                  </Group>
                  <Text c="dimmed" fz="sm" truncate>
                    {t('Upgrade to resume service')}
                  </Text>
                </Stack>
                <Button size="xs" variant="light" color="gray">
                  {t('Upgrade')}
                </Button>
              </Group>

              {usageItems.map((item) => (
                <Box key={item.label}>
                  <Group justify="space-between" mb={5} wrap="nowrap">
                    <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
                      <IconInfoCircle size="0.75rem" />
                      <Text fz="md" fw={600} truncate>
                        {t(item.label)}
                      </Text>
                    </Group>
                    <Text fz="md" c={isDark ? 'gray.1' : 'gray.7'}>
                      {item.value}
                    </Text>
                  </Group>
                  <Progress value={item.progress} size={6} color="gray" radius="xl" />
                </Box>
              ))}
            </Stack>
          </Card>

          <Card
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({
              backgroundColor: getSurfaceColor(theme, isDark),
              borderColor: getBorderColor(theme, isDark),
            })}
          >
            <Text fw={700} fz="xl" mb="md">
              {t('Alerts')}
            </Text>
            <Stack gap="xs" align="center" py="md">
              <ThemeIcon size={42} radius="xl" variant="light" color="gray">
                <IconActivity size="1rem" />
              </ThemeIcon>
              <Text fw={700}>{t('Get alerted for anomalies')}</Text>
              <Text c="dimmed" fz="md" ta="center">
                {t('Automatically monitor your projects for anomalies and get notified.')}
              </Text>
              <Button variant="outline" size="sm" mt="xs">
                {t('Upgrade to Pro')}
              </Button>
            </Stack>
          </Card>

          <Card
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({
              backgroundColor: getSurfaceColor(theme, isDark),
              borderColor: getBorderColor(theme, isDark),
              flex: 1,
            })}
          >
            <Text fw={700} fz="xl" mb="md">
              {t('Recent Previews')}
            </Text>
            <Stack gap="xs" align="center" justify="center" h="100%" py="md">
              <ThemeIcon size={42} radius="xl" variant="light" color="gray">
                <IconExternalLink size="1rem" />
              </ThemeIcon>
              <Text c="dimmed" fz="lg" ta="center">
                {t(
                  'Preview deployments that you have recently visited or created will appear here.',
                )}
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, xl: 8 }}>
        {layoutMode === 'list' ? (
          <Card
            withBorder
            radius="md"
            p={0}
            style={(theme) => ({
              backgroundColor: getSurfaceColor(theme, isDark),
              borderColor: getBorderColor(theme, isDark),
            })}
          >
            <Stack gap={0}>
              {projects.map((project, index) => (
                <Box
                  key={project.name}
                  p="md"
                  style={(theme) => ({
                    borderBottom:
                      index === projects.length - 1
                        ? 'none'
                        : `1px solid ${getBorderColor(theme, isDark)}`,
                  })}
                >
                  <Group justify="space-between" align="center" wrap="wrap">
                    <Group gap="sm" style={{ minWidth: 0, flex: 1 }} wrap="nowrap">
                      <ThemeIcon
                        size={34}
                        radius="xl"
                        variant="light"
                        color={project.status === 'warning' ? 'yellow' : 'teal'}
                      >
                        <IconWaveSine size="1rem" />
                      </ThemeIcon>
                      <Stack gap={2} style={{ minWidth: 0 }}>
                        <Text fw={700} fz="xl" truncate>
                          {project.name}
                        </Text>
                        <Text c="dimmed" fz="lg" truncate>
                          {project.domain}
                        </Text>
                      </Stack>
                    </Group>

                    <Stack gap={2} style={{ minWidth: 220, flex: 1 }}>
                      <Text fw={700} fz="lg" lineClamp={1}>
                        {project.commit}
                      </Text>
                      <Group gap={6} wrap="nowrap">
                        <Text c="dimmed" fz="md">
                          {project.updated}
                        </Text>
                        <IconGitBranch size="0.9rem" />
                        <Text c="dimmed" fz="md" truncate>
                          {project.branch}
                        </Text>
                      </Group>
                    </Stack>

                    <Group gap="xs" wrap="nowrap">
                      <Badge
                        variant="filled"
                        color="gray"
                        size="lg"
                        leftSection={<IconBrandGithub size="0.85rem" />}
                      >
                        {project.repo}
                      </Badge>
                      <ThemeIcon
                        size={34}
                        radius="xl"
                        variant="outline"
                        color={project.status === 'warning' ? 'yellow' : 'gray'}
                      >
                        {project.status === 'warning' ? (
                          <IconAlertCircle size="0.95rem" />
                        ) : (
                          <IconWaveSine size="0.95rem" />
                        )}
                      </ThemeIcon>
                      <ActionIcon variant="subtle" color="gray" size="lg">
                        <IconDots size="1rem" />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Box>
              ))}
            </Stack>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {projects.map((project) => (
              <Card
                key={project.name}
                withBorder
                radius="md"
                p="md"
                style={(theme) => ({
                  backgroundColor: getSurfaceColor(theme, isDark),
                  borderColor: getBorderColor(theme, isDark),
                })}
              >
                <Stack gap="sm">
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                      <ThemeIcon
                        size={32}
                        radius="xl"
                        variant="light"
                        color={project.status === 'warning' ? 'yellow' : 'teal'}
                      >
                        <IconWaveSine size="0.95rem" />
                      </ThemeIcon>
                      <Text fw={700} truncate>
                        {project.name}
                      </Text>
                    </Group>
                    <ActionIcon variant="subtle" color="gray" size="sm">
                      <IconDots size="0.9rem" />
                    </ActionIcon>
                  </Group>
                  <Text c="dimmed" fz="sm" truncate>
                    {project.domain}
                  </Text>
                  <Text fw={600} lineClamp={2}>
                    {project.commit}
                  </Text>
                  <Group gap={6}>
                    <IconGitBranch size="0.85rem" />
                    <Text c="dimmed" fz="sm" truncate>
                      {project.branch}
                    </Text>
                    <Text c="dimmed" fz="sm">
                      {project.updated}
                    </Text>
                  </Group>
                  <Group justify="space-between" wrap="nowrap">
                    <Badge
                      variant="filled"
                      color="gray"
                      leftSection={<IconBrandGithub size="0.8rem" />}
                    >
                      {project.repo}
                    </Badge>
                    <ThemeIcon
                      size={30}
                      radius="xl"
                      variant="outline"
                      color={project.status === 'warning' ? 'yellow' : 'gray'}
                    >
                      {project.status === 'warning' ? (
                        <IconAlertCircle size="0.85rem" />
                      ) : (
                        <IconWaveSine size="0.85rem" />
                      )}
                    </ThemeIcon>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Grid.Col>
    </Grid>
  );
}

export default memo(Home);
