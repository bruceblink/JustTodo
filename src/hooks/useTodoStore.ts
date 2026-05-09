import { create } from 'zustand';
import { defaultTodoListState, type TodoItem } from '@/todos/todoSchema';
import { loadTodoListState, saveTodoListState } from '@/todos/todoPersistence';

interface TodoStoreState {
  hydrated: boolean;
  items: TodoItem[];
  initTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  updateTodoTitle: (id: string, title: string) => Promise<void>;
}

function createTodoItem(title: string): TodoItem {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export const useTodoStore = create<TodoStoreState>()((set, get) => ({
  hydrated: false,
  items: defaultTodoListState.items,
  initTodos: async () => {
    const todos = await loadTodoListState();
    set({ hydrated: true, items: todos.items });
  },
  addTodo: async (title) => {
    const nextTitle = title.trim();
    if (!nextTitle) return;

    const nextItems = [createTodoItem(nextTitle), ...get().items];
    set({ items: nextItems });
    await saveTodoListState({ version: defaultTodoListState.version, items: nextItems });
  },
  toggleTodo: async (id) => {
    const nextItems = get().items.map((item) =>
      item.id === id
        ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
        : item,
    );
    set({ items: nextItems });
    await saveTodoListState({ version: defaultTodoListState.version, items: nextItems });
  },
  removeTodo: async (id) => {
    const nextItems = get().items.filter((item) => item.id !== id);
    set({ items: nextItems });
    await saveTodoListState({ version: defaultTodoListState.version, items: nextItems });
  },
  updateTodoTitle: async (id, title) => {
    const nextTitle = title.trim();
    if (!nextTitle) return;

    const nextItems = get().items.map((item) =>
      item.id === id ? { ...item, title: nextTitle, updatedAt: new Date().toISOString() } : item,
    );
    set({ items: nextItems });
    await saveTodoListState({ version: defaultTodoListState.version, items: nextItems });
  },
}));
