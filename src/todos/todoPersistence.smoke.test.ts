const storeState = new Map<string, unknown>();

const mockStore = {
  get: vi.fn(async (key: string) => storeState.get(key)),
  set: vi.fn(async (key: string, value: unknown) => {
    storeState.set(key, value);
  }),
  save: vi.fn(async () => undefined),
};

vi.mock('@tauri-apps/plugin-store', () => ({
  load: vi.fn(async () => mockStore),
}));

describe('todo persistence smoke', () => {
  beforeEach(() => {
    storeState.clear();
    mockStore.get.mockClear();
    mockStore.set.mockClear();
    mockStore.save.mockClear();
  });

  it('persists todo list and restores normalized state', async () => {
    const { saveTodoListState, loadTodoListState } = await import('./todoPersistence');

    await saveTodoListState({
      version: 1,
      items: [
        {
          id: 'todo-1',
          title: 'Ship smoke tests',
          completed: false,
          createdAt: '2026-05-10T00:00:00.000Z',
          updatedAt: '2026-05-10T00:00:00.000Z',
        },
      ],
    });

    const restored = await loadTodoListState();

    expect(restored.version).toBe(1);
    expect(restored.items).toHaveLength(1);
    expect(restored.items[0]).toMatchObject({ id: 'todo-1', title: 'Ship smoke tests' });
    expect(mockStore.save).toHaveBeenCalled();
  });
});

export {};
