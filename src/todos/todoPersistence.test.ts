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

describe('todoPersistence', () => {
  beforeEach(() => {
    storeState.clear();
    mockStore.get.mockClear();
    mockStore.set.mockClear();
    mockStore.save.mockClear();
  });

  it('loads default state for invalid payload and persists normalized data', async () => {
    storeState.set('todo_items', null);

    const { loadTodoListState } = await import('./todoPersistence');
    const state = await loadTodoListState();

    expect(state.version).toBe(1);
    expect(state.items).toEqual([]);
    expect(mockStore.set).toHaveBeenCalled();
    expect(mockStore.save).toHaveBeenCalled();
  });

  it('patches todo list while preserving existing fields', async () => {
    storeState.set('todo_items', {
      version: 1,
      items: [
        {
          id: 'todo-1',
          title: 'Existing',
          completed: false,
          createdAt: '2026-05-10T00:00:00.000Z',
          updatedAt: '2026-05-10T00:00:00.000Z',
        },
      ],
    });

    const { patchTodoListState, loadTodoListState } = await import('./todoPersistence');

    const patched = await patchTodoListState({
      items: [
        {
          id: 'todo-1',
          title: 'Updated',
          completed: true,
          createdAt: '2026-05-10T00:00:00.000Z',
          updatedAt: '2026-05-11T00:00:00.000Z',
        },
      ],
    });

    expect(patched.items).toHaveLength(1);
    expect(patched.items[0].title).toBe('Updated');
    expect(patched.items[0].completed).toBe(true);

    const reloaded = await loadTodoListState();
    expect(reloaded.items[0].title).toBe('Updated');
    expect(mockStore.save).toHaveBeenCalled();
  });
});

export {};
