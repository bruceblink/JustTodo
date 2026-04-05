import { load } from '@tauri-apps/plugin-store';
import { ColorSchemeType } from '@/types/ISetting.ts';
import { defaultAppSettings, normalizeSettings, type AppSettings } from './settingsSchema';

const SETTINGS_FILE = 'settings.json';
const SETTINGS_KEY = 'app_settings';

let storePromise: ReturnType<typeof load> | null = null;
let initialized = false;

function getStore() {
  if (!storePromise) {
    storePromise = load(SETTINGS_FILE);
  }
  return storePromise;
}

function readLegacySettings(): Partial<AppSettings> {
  const legacyTheme = localStorage.getItem('theme');
  return {
    language: localStorage.getItem('language') ?? undefined,
    theme:
      legacyTheme === ColorSchemeType.Light || legacyTheme === ColorSchemeType.Dark
        ? legacyTheme
        : undefined,
  };
}

function clearLegacySettings() {
  localStorage.removeItem('language');
  localStorage.removeItem('theme');
}

export async function loadAppSettings(): Promise<AppSettings> {
  const store = await getStore();

  const raw = await store.get(SETTINGS_KEY);
  const rawSettings =
    typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : undefined;
  const merged = initialized
    ? normalizeSettings(raw)
    : normalizeSettings({ ...defaultAppSettings, ...readLegacySettings(), ...rawSettings });

  initialized = true;

  await store.set(SETTINGS_KEY, merged);
  await store.save();
  clearLegacySettings();

  return merged;
}

export async function saveAppSettings(next: AppSettings): Promise<void> {
  const store = await getStore();
  const normalized = normalizeSettings(next);

  await store.set(SETTINGS_KEY, normalized);
  await store.save();
}

export async function patchAppSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const current = await loadAppSettings();
  const next = normalizeSettings({ ...current, ...patch });
  await saveAppSettings(next);
  return next;
}
