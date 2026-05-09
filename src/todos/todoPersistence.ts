import { load } from '@tauri-apps/plugin-store';
import { defaultTodoListState, normalizeTodoListState, type TodoListState } from './todoSchema';

const TODOS_FILE = 'todos.json';
const TODOS_KEY = 'todo_items';

let storePromise: ReturnType<typeof load> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = load(TODOS_FILE);
  }
  return storePromise;
}

export async function loadTodoListState(): Promise<TodoListState> {
  const store = await getStore();
  const raw = await store.get(TODOS_KEY);
  const normalized = normalizeTodoListState(raw ?? defaultTodoListState);

  await store.set(TODOS_KEY, normalized);
  await store.save();

  return normalized;
}

export async function saveTodoListState(next: TodoListState): Promise<void> {
  const store = await getStore();
  const normalized = normalizeTodoListState(next);

  await store.set(TODOS_KEY, normalized);
  await store.save();
}

export async function patchTodoListState(patch: Partial<TodoListState>): Promise<TodoListState> {
  const current = await loadTodoListState();
  const next = normalizeTodoListState({ ...current, ...patch });
  await saveTodoListState(next);
  return next;
}
