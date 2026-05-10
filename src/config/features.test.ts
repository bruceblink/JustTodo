const mockPackageJson = vi.hoisted(() => ({ scaffold: undefined as unknown }));

vi.mock('../../package.json', () => ({
  default: mockPackageJson,
}));

describe('featureFlags', () => {
  beforeEach(() => {
    vi.resetModules();
    mockPackageJson.scaffold = undefined;
  });

  it('uses defaults when scaffold features are missing', async () => {
    const { featureFlags } = await import('./features');

    expect(featureFlags.updater).toBe(true);
    expect(featureFlags.autostart).toBe(true);
  });

  it('uses scaffold overrides when provided', async () => {
    mockPackageJson.scaffold = {
      features: {
        updater: false,
        autostart: true,
      },
    };

    const { featureFlags } = await import('./features');

    expect(featureFlags.updater).toBe(false);
    expect(featureFlags.autostart).toBe(true);
  });

  it('falls back for missing single feature values', async () => {
    mockPackageJson.scaffold = {
      features: {
        updater: false,
      },
    };

    const { featureFlags } = await import('./features');

    expect(featureFlags.updater).toBe(false);
    expect(featureFlags.autostart).toBe(true);
  });
});

export {};
