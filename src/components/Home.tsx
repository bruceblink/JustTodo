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
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconActivity,
  IconDots,
  IconGitBranch,
  IconBrandGithub,
  IconExternalLink,
} from '@tabler/icons-react';

const usageItems = [
  { label: 'Edge Requests', value: '1.6K / 1M', progress: 12 },
  { label: 'Fast Data Transfer', value: '2.23 MB / 100 GB', progress: 3 },
  { label: 'Fast Origin Transfer', value: '0 / 10 GB', progress: 0 },
  { label: 'Edge Request CPU Duration', value: '0 / 1h', progress: 0 },
];

const projects = [
  {
    name: 'next-tv',
    domain: 'next-tv-sepia.vercel.app',
    repo: 'bruceblink/NextTV',
    commit: 'refactor: simplify landing page and remove extra hero elements',
    updated: '9/21/25',
    branch: 'main',
  },
  {
    name: 'notion-next',
    domain: 'blog.likang.top',
    repo: 'bruceblink/NotionNext',
    commit: 'chore: remove unnecessary theme',
    updated: '8/23/25',
    branch: 'main',
  },
  {
    name: 'n-gon',
    domain: 'n-gon-azure.vercel.app',
    repo: 'bruceblink/n-gon',
    commit: 'quick bug fix',
    updated: '12/9/25',
    branch: 'master',
  },
  {
    name: 'fast-analytics',
    domain: 'fast-analytics-pearl.vercel.app',
    repo: 'bruceblink/fast-analytics',
    commit: 'chore: clean unused import',
    updated: '12/14/25',
    branch: 'main',
  },
  {
    name: 'nextjs-dashboard',
    domain: 'nextjs-dashboard-nine-ashen.vercel.app',
    repo: 'bruceblink/nextjs-dashboard',
    commit: 'docs: update readme and default login account',
    updated: '9/13/25',
    branch: 'dev',
  },
  {
    name: 'material-kit-react',
    domain: 'material-kit-react-rose.vercel.app',
    repo: 'bruceblink/material-kit-react',
    commit: 'docs: update readme page urls',
    updated: '9/6/25',
    branch: 'master',
  },
];

function Home() {
  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Text fw={600} fz="lg">
          Overview
        </Text>
        <Badge color="gray" variant="light" size="sm">
          Dark Mode
        </Badge>
      </Group>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Stack gap="md">
            <Card
              bg="dark.8"
              withBorder
              radius="md"
              p="md"
              style={(theme) => ({ borderColor: theme.colors.dark[4] })}
            >
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} fz="sm">
                    Usage
                  </Text>
                  <Badge color="red" variant="light" size="sm">
                    Paused
                  </Badge>
                </Group>
                {usageItems.map((item) => (
                  <Box key={item.label}>
                    <Group justify="space-between" mb={5}>
                      <Text fz="xs" c="gray.1">
                        {item.label}
                      </Text>
                      <Text fz="xs" c="dimmed">
                        {item.value}
                      </Text>
                    </Group>
                    <Progress value={item.progress} size={5} color="gray" radius="xl" />
                  </Box>
                ))}
                <Button variant="outline" size="xs" mt="xs">
                  Upgrade
                </Button>
              </Stack>
            </Card>

            <Card
              bg="dark.8"
              withBorder
              radius="md"
              p="md"
              style={(theme) => ({ borderColor: theme.colors.dark[4] })}
            >
              <Stack gap="xs" align="center" py="md">
                <ThemeIcon size={34} radius="xl" variant="light" color="gray">
                  <IconActivity size="0.95rem" />
                </ThemeIcon>
                <Text fw={600} fz="sm">
                  Get alerted for anomalies
                </Text>
                <Text c="dimmed" fz="xs" ta="center">
                  Automatically monitor your projects and get notifications.
                </Text>
                <Button variant="outline" size="xs" mt="xs">
                  Upgrade to Pro
                </Button>
              </Stack>
            </Card>

            <Card
              bg="dark.8"
              withBorder
              radius="md"
              p="md"
              style={(theme) => ({ borderColor: theme.colors.dark[4] })}
            >
              <Stack gap="xs" align="center" py="md">
                <ThemeIcon size={34} radius="xl" variant="light" color="gray">
                  <IconExternalLink size="0.9rem" />
                </ThemeIcon>
                <Text fw={600} fz="sm">
                  Recent Previews
                </Text>
                <Text c="dimmed" fz="xs" ta="center">
                  Preview deployments you recently opened will appear here.
                </Text>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xl: 8 }}>
          <Stack gap="sm">
            <Text fw={600} fz="sm">
              Projects
            </Text>
            <Grid gutter="md">
              {projects.map((project) => (
                <Grid.Col key={project.name} span={{ base: 12, lg: 6 }}>
                  <Card
                    bg="dark.8"
                    withBorder
                    radius="md"
                    p="md"
                    style={(theme) => ({ borderColor: theme.colors.dark[4] })}
                  >
                    <Stack gap={8}>
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Box style={{ minWidth: 0 }}>
                          <Text fw={600} fz="sm" truncate>
                            {project.name}
                          </Text>
                          <Text c="dimmed" fz="xs" truncate>
                            {project.domain}
                          </Text>
                        </Box>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <IconDots size="0.9rem" />
                        </ActionIcon>
                      </Group>

                      <Group gap={6} wrap="nowrap">
                        <IconBrandGithub size="0.85rem" />
                        <Text fz="xs" c="gray.3" truncate>
                          {project.repo}
                        </Text>
                      </Group>

                      <Text fz="xs" c="gray.1" lineClamp={2}>
                        {project.commit}
                      </Text>

                      <Group justify="space-between" mt={2}>
                        <Text fz="xs" c="dimmed">
                          {project.updated}
                        </Text>
                        <Group gap={4} wrap="nowrap">
                          <IconGitBranch size="0.8rem" />
                          <Text fz="xs" c="dimmed">
                            {project.branch}
                          </Text>
                        </Group>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default memo(Home);
