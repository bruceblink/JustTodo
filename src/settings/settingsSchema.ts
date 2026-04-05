import defaultSettingsJson from '../../src-tauri/src/app/default/settings.json';
import { ColorSchemeType, type ColorScheme, type ISettingStoreVariables } from '@/types/ISetting';

export const SETTINGS_SCHEMA_VERSION = 1;

export interface AppSettings extends ISettingStoreVariables {
  version: number;
}

const fallbackTheme = defaultSettingsJson.theme as ColorScheme;
const fallbackLanguage = defaultSettingsJson.language;

export const defaultAppSettings: AppSettings = {
  version: SETTINGS_SCHEMA_VERSION,
  language: fallbackLanguage,
  theme: fallbackTheme,
  allowAutoStartUp: defaultSettingsJson.allowAutoStartUp ?? false,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeTheme(value: unknown): ColorScheme {
  if (value === ColorSchemeType.Light || value === ColorSchemeType.Dark) {
    return value;
  }
  return defaultAppSettings.theme;
}

function normalizeLanguage(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  return defaultAppSettings.language;
}

function normalizeAutoStart(value: unknown): boolean {
  return typeof value === 'boolean' ? value : defaultAppSettings.allowAutoStartUp;
}

export function normalizeSettings(input: unknown): AppSettings {
  if (!isObject(input)) {
    return { ...defaultAppSettings };
  }

  return {
    version: SETTINGS_SCHEMA_VERSION,
    language: normalizeLanguage(input.language),
    theme: normalizeTheme(input.theme),
    allowAutoStartUp: normalizeAutoStart(input.allowAutoStartUp),
  };
}
