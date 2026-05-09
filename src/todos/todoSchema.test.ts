import { normalizeTodoListState } from './todoSchema';

describe('normalizeTodoListState', () => {
  it('falls back to default state for invalid payloads', () => {
    expect(normalizeTodoListState(null)).toEqual({ version: 1, items: [] });
  });

  it('keeps valid todos and drops invalid ones', () => {
    const result = normalizeTodoListState({
      items: [
        {
          id: 'todo-1',
          title: 'Ship desktop shell',
          completed: true,
          createdAt: '2026-05-09T00:00:00.000Z',
          updatedAt: '2026-05-09T00:00:00.000Z',
        },
        {
          id: 'todo-2',
          title: '   ',
          completed: false,
        },
      ],
    });

    expect(result.version).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: 'todo-1',
      title: 'Ship desktop shell',
      completed: true,
    });
  });
});
