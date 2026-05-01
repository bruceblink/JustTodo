import { memo } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Grid,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconActivity, IconDots, IconGitBranch, IconBrandGithub } from '@tabler/icons-react';

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
        <Text fw={600} fz="xl">
          Overview
        </Text>
        <Badge color="gray" variant="light">
          Dark Mode
        </Badge>
      </Group>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card
            bg="dark.8"
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({ borderColor: theme.colors.dark[4] })}
          >
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={600}>Usage</Text>
                <Badge color="red" variant="light">
                  Paused
                </Badge>
              </Group>
              {usageItems.map((item) => (
                <Box key={item.label}>
                  <Group justify="space-between" mb={6}>
                    <Text fz="sm" c="gray.2">
                      {item.label}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      {item.value}
                    </Text>
                  </Group>
                  <Progress value={item.progress} size="xs" color="gray" />
                </Box>
              ))}
            </Stack>
          </Card>

          <Card
            mt="md"
            bg="dark.8"
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({ borderColor: theme.colors.dark[4] })}
          >
            <Stack gap="xs" align="center" py="md">
              <ThemeIcon size={36} radius="xl" variant="light" color="gray">
                <IconActivity size="1rem" />
              </ThemeIcon>
              <Text fw={600}>Get alerted for anomalies</Text>
              <Text c="dimmed" fz="sm" ta="center">
                Automatically monitor your projects and get notifications.
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="sm">
            <Text fw={600}>Projects</Text>
            <Grid gutter="md">
              {projects.map((project) => (
                <Grid.Col key={project.name} span={{ base: 12, md: 6 }}>
                  <Card
                    bg="dark.8"
                    withBorder
                    radius="md"
                    p="md"
                    style={(theme) => ({ borderColor: theme.colors.dark[4] })}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Box style={{ minWidth: 0 }}>
                          <Text fw={600} truncate>
                            {project.name}
                          </Text>
                          <Text c="dimmed" fz="sm" truncate>
                            {project.domain}
                          </Text>
                        </Box>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDots size="1rem" />
                        </ActionIcon>
                      </Group>

                      <Group gap={6} wrap="nowrap">
                        <IconBrandGithub size="0.9rem" />
                        <Text fz="xs" c="gray.3" truncate>
                          {project.repo}
                        </Text>
                      </Group>

                      <Text fz="sm" c="gray.2" lineClamp={2}>
                        {project.commit}
                      </Text>

                      <Group justify="space-between" mt={4}>
                        <Text fz="xs" c="dimmed">
                          {project.updated}
                        </Text>
                        <Group gap={4} wrap="nowrap">
                          <IconGitBranch size="0.85rem" />
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
