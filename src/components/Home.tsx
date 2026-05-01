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
  IconInfoCircle,
  IconWaveSine,
  IconAlertCircle,
} from '@tabler/icons-react';
import { projects, usageItems } from './home-data';

function Home() {
  return (
    <Grid gutter="md" align="stretch">
      <Grid.Col span={{ base: 12, xl: 4 }}>
        <Stack gap="md" h="100%">
          <Card
            bg="dark.8"
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({ borderColor: theme.colors.dark[4] })}
          >
            <Stack gap="sm">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Group gap={6}>
                    <Text fw={700} c="red.4">
                      Paused
                    </Text>
                    <IconAlertCircle size="0.9rem" color="var(--mantine-color-red-4)" />
                  </Group>
                  <Text c="dimmed" fz="sm">
                    Upgrade to resume service
                  </Text>
                </Stack>
                <Button size="xs" variant="light" color="gray">
                  Upgrade
                </Button>
              </Group>

              {usageItems.map((item) => (
                <Box key={item.label}>
                  <Group justify="space-between" mb={5}>
                    <Group gap={6}>
                      <IconInfoCircle size="0.75rem" />
                      <Text fz="md" fw={600}>
                        {item.label}
                      </Text>
                    </Group>
                    <Text fz="md" c="gray.1">
                      {item.value}
                    </Text>
                  </Group>
                  <Progress value={item.progress} size={6} color="gray" radius="xl" />
                </Box>
              ))}
            </Stack>
          </Card>

          <Card
            bg="dark.8"
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({ borderColor: theme.colors.dark[4] })}
          >
            <Text fw={700} fz="xl" mb="md">
              Alerts
            </Text>
            <Stack gap="xs" align="center" py="md">
              <ThemeIcon size={42} radius="xl" variant="light" color="gray">
                <IconActivity size="1rem" />
              </ThemeIcon>
              <Text fw={700}>Get alerted for anomalies</Text>
              <Text c="dimmed" fz="md" ta="center">
                Automatically monitor your projects for anomalies and get notified.
              </Text>
              <Button variant="outline" size="sm" mt="xs">
                Upgrade to Pro
              </Button>
            </Stack>
          </Card>

          <Card
            bg="dark.8"
            withBorder
            radius="md"
            p="md"
            style={(theme) => ({ borderColor: theme.colors.dark[4], flex: 1 })}
          >
            <Text fw={700} fz="xl" mb="md">
              Recent Previews
            </Text>
            <Stack gap="xs" align="center" justify="center" h="100%" py="md">
              <ThemeIcon size={42} radius="xl" variant="light" color="gray">
                <IconExternalLink size="1rem" />
              </ThemeIcon>
              <Text c="dimmed" fz="lg" ta="center">
                Preview deployments that you have recently visited or created will appear here.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, xl: 8 }}>
        <Card
          bg="dark.8"
          withBorder
          radius="md"
          p={0}
          style={(theme) => ({ borderColor: theme.colors.dark[4] })}
        >
          <Stack gap={0}>
            {projects.map((project, index) => (
              <Box
                key={project.name}
                p="md"
                style={(theme) => ({
                  borderBottom:
                    index === projects.length - 1 ? 'none' : `1px solid ${theme.colors.dark[4]}`,
                })}
              >
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Group gap="sm" style={{ minWidth: 0 }} wrap="nowrap">
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
                      <Text c="dimmed" fz="xl" truncate>
                        {project.domain}
                      </Text>
                    </Stack>
                  </Group>

                  <Stack gap={2} style={{ minWidth: 220, flex: 1 }}>
                    <Text fw={700} fz="xl" lineClamp={1}>
                      {project.commit}
                    </Text>
                    <Group gap={6}>
                      <Text c="dimmed" fz="xl">
                        {project.updated}
                      </Text>
                      <IconGitBranch size="0.9rem" />
                      <Text c="dimmed" fz="xl">
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
      </Grid.Col>
    </Grid>
  );
}

export default memo(Home);
