import { defaultAppSettings, normalizeSettings } from './settingsSchema';

describe('normalizeSettings', () => {
  it('returns defaults for invalid payload', () => {
    expect(normalizeSettings(null)).toEqual(defaultAppSettings);
  });

  it('normalizes invalid fields and keeps valid ones', () => {
    const result = normalizeSettings({
      language: 'zh-CN',
      theme: 'dark',
      allowAutoStartUp: 'yes',
      closeToTray: false,
    });

    expect(result.language).toBe('zh-CN');
    expect(result.theme).toBe('dark');
    expect(result.allowAutoStartUp).toBe(defaultAppSettings.allowAutoStartUp);
    expect(result.closeToTray).toBe(false);
    expect(result.version).toBe(defaultAppSettings.version);
  });
});
