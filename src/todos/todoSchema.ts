export const TODO_SCHEMA_VERSION = 1;

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoListState {
  version: number;
  items: TodoItem[];
}

export const defaultTodoListState: TodoListState = {
  version: TODO_SCHEMA_VERSION,
  items: [],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeBoolean(value: unknown): boolean {
  return typeof value === 'boolean' ? value : false;
}

function normalizeTimestamp(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function normalizeTodoItem(input: unknown): TodoItem | null {
  if (!isObject(input)) {
    return null;
  }

  const title = normalizeString(input.title);
  if (!title) {
    return null;
  }

  const now = new Date().toISOString();
  const id = normalizeString(input.id) || crypto.randomUUID();

  return {
    id,
    title,
    completed: normalizeBoolean(input.completed),
    createdAt: normalizeTimestamp(input.createdAt, now),
    updatedAt: normalizeTimestamp(input.updatedAt, now),
  };
}

export function normalizeTodoListState(input: unknown): TodoListState {
  if (!isObject(input) || !Array.isArray(input.items)) {
    return { ...defaultTodoListState };
  }

  return {
    version: TODO_SCHEMA_VERSION,
    items: input.items
      .map((item) => normalizeTodoItem(item))
      .filter((item): item is TodoItem => item !== null),
  };
}
