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

  it('falls back when language and theme are blank strings', () => {
    const result = normalizeSettings({
      language: '   ',
      theme: '   ',
      allowAutoStartUp: true,
      closeToTray: true,
    });

    expect(result.language).toBe(defaultAppSettings.language);
    expect(result.theme).toBe(defaultAppSettings.theme);
    expect(result.allowAutoStartUp).toBe(true);
    expect(result.closeToTray).toBe(true);
  });

  it('falls back when closeToTray and autostart are non-boolean', () => {
    const result = normalizeSettings({
      language: 'en',
      theme: 'dark',
      allowAutoStartUp: 1,
      closeToTray: 'false',
    });

    expect(result.allowAutoStartUp).toBe(defaultAppSettings.allowAutoStartUp);
    expect(result.closeToTray).toBe(defaultAppSettings.closeToTray);
  });
});
