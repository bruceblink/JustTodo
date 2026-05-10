const loadTodoListState = vi.fn();
const saveTodoListState = vi.fn();

vi.mock('@/todos/todoPersistence', () => ({
  loadTodoListState,
  saveTodoListState,
}));

describe('useTodoStore', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    loadTodoListState.mockResolvedValue({ version: 1, items: [] });
    saveTodoListState.mockResolvedValue(undefined);

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('todo-uuid-1'),
    });
  });

  it('hydrates todos from persistence', async () => {
    loadTodoListState.mockResolvedValueOnce({
      version: 1,
      items: [
        {
          id: 'todo-1',
          title: 'Hydrated item',
          completed: false,
          createdAt: '2026-05-10T00:00:00.000Z',
          updatedAt: '2026-05-10T00:00:00.000Z',
        },
      ],
    });

    const { useTodoStore } = await import('./useTodoStore');

    await useTodoStore.getState().initTodos();

    expect(useTodoStore.getState().hydrated).toBe(true);
    expect(useTodoStore.getState().items).toHaveLength(1);
    expect(useTodoStore.getState().items[0].title).toBe('Hydrated item');
  });

  it('adds todo and persists trimmed title', async () => {
    const { useTodoStore } = await import('./useTodoStore');

    await useTodoStore.getState().addTodo('  New task  ');

    const items = useTodoStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('todo-uuid-1');
    expect(items[0].title).toBe('New task');
    expect(saveTodoListState).toHaveBeenCalledTimes(1);
    expect(saveTodoListState.mock.calls[0][0].items[0].title).toBe('New task');
  });

  it('toggles completion and persists updated state', async () => {
    const { useTodoStore } = await import('./useTodoStore');

    await useTodoStore.getState().addTodo('Task A');
    await useTodoStore.getState().toggleTodo('todo-uuid-1');

    const item = useTodoStore.getState().items[0];
    expect(item.completed).toBe(true);
    expect(saveTodoListState).toHaveBeenCalledTimes(2);
    expect(saveTodoListState.mock.calls[1][0].items[0].completed).toBe(true);
  });

  it('updates title and removes todo', async () => {
    const { useTodoStore } = await import('./useTodoStore');

    await useTodoStore.getState().addTodo('Task B');
    await useTodoStore.getState().updateTodoTitle('todo-uuid-1', '  Updated task  ');

    expect(useTodoStore.getState().items[0].title).toBe('Updated task');

    await useTodoStore.getState().removeTodo('todo-uuid-1');
    expect(useTodoStore.getState().items).toHaveLength(0);
    expect(saveTodoListState).toHaveBeenCalledTimes(3);
  });
});

export {};
