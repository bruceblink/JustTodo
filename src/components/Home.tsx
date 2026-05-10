import { memo, useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconCheck, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTodoStore } from '@/hooks/useTodoStore.ts';

function Home() {
  const { hydrated, items, addTodo, toggleTodo, removeTodo, updateTodoTitle } = useTodoStore();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const remainingCount = useMemo(() => items.filter((item) => !item.completed).length, [items]);

  const handleCreate = async () => {
    await addTodo(draft);
    setDraft('');
  };

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleSubmitEdit = async () => {
    if (!editingId) return;
    await updateTodoTitle(editingId, editingTitle);
    setEditingId(null);
    setEditingTitle('');
  };

  return (
    <Stack gap="lg">
      <Flex align="center" justify="space-between" wrap="wrap" gap="sm">
        <div>
          <Text fw={700} size="xl">
            Todo Inbox
          </Text>
          <Text c="dimmed">
            Capture tasks locally and keep them available after the app restarts.
          </Text>
        </div>
        <Group gap="xs">
          <Badge variant="light">{items.length} total</Badge>
          <Badge variant="light" color={remainingCount ? 'blue' : 'green'}>
            {remainingCount} open
          </Badge>
        </Group>
      </Flex>

      <Group align="end">
        <TextInput
          style={{ flex: 1 }}
          label="New todo"
          placeholder="Write down the next thing to do"
          value={draft}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void handleCreate();
            }
          }}
        />
        <Button leftSection={<IconPlus size="1rem" />} onClick={() => void handleCreate()}>
          Add
        </Button>
      </Group>

      {!hydrated ? (
        <Text c="dimmed">Loading local todos...</Text>
      ) : items.length === 0 ? (
        <Card withBorder radius="md" p="lg">
          <Text fw={500}>No todos yet</Text>
          <Text c="dimmed" size="sm" mt="xs">
            Add your first task to turn this scaffold into a usable desktop workspace.
          </Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {items.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <Card key={item.id} withBorder radius="md" p="md">
                <Flex align="center" justify="space-between" gap="md" wrap="wrap">
                  <Group align="flex-start" style={{ flex: 1 }}>
                    <Checkbox
                      checked={item.completed}
                      onChange={() => void toggleTodo(item.id)}
                      mt={2}
                    />
                    <Stack gap={4} style={{ flex: 1 }}>
                      {isEditing ? (
                        <TextInput
                          value={editingTitle}
                          onChange={(event) => setEditingTitle(event.currentTarget.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              void handleSubmitEdit();
                            }
                          }}
                        />
                      ) : (
                        <Text
                          td={item.completed ? 'line-through' : undefined}
                          c={item.completed ? 'dimmed' : undefined}
                        >
                          {item.title}
                        </Text>
                      )}
                      <Text size="xs" c="dimmed">
                        Updated {new Date(item.updatedAt).toLocaleString()}
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap="xs">
                    {isEditing ? (
                      <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => void handleSubmitEdit()}
                      >
                        <IconCheck size="1rem" />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        variant="light"
                        onClick={() => handleStartEdit(item.id, item.title)}
                      >
                        <IconPencil size="1rem" />
                      </ActionIcon>
                    )}
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => void removeTodo(item.id)}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                </Flex>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export default memo(Home);
