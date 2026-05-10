const mocks = vi.hoisted(() => {
  const initSettings = vi.fn();
  const initTodos = vi.fn();
  const changeLanguage = vi.fn();
  const render = vi.fn();
  const createRoot = vi.fn(() => ({ render }));
  return { initSettings, initTodos, changeLanguage, render, createRoot };
});

vi.mock('./hooks/useSettingStore.tsx', () => ({
  useSettingStore: {
    getState: () => ({
      initSettings: mocks.initSettings,
      language: 'zh-CN',
    }),
  },
}));

vi.mock('./hooks/useTodoStore.ts', () => ({
  useTodoStore: {
    getState: () => ({
      initTodos: mocks.initTodos,
    }),
  },
}));

vi.mock('./i18n.ts', () => ({
  default: {
    changeLanguage: mocks.changeLanguage,
  },
}));

vi.mock('react-dom/client', () => ({
  default: { createRoot: mocks.createRoot },
  createRoot: mocks.createRoot,
}));

describe('main bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
    mocks.initSettings.mockResolvedValue(undefined);
    mocks.initTodos.mockResolvedValue(undefined);
    mocks.changeLanguage.mockResolvedValue(undefined);
  });

  it('hydrates settings and todos then switches language before render', async () => {
    await import('./main');
    await Promise.resolve();
    await Promise.resolve();

    expect(mocks.initSettings).toHaveBeenCalledTimes(1);
    expect(mocks.initTodos).toHaveBeenCalledTimes(1);
    expect(mocks.changeLanguage).toHaveBeenCalledWith('zh-CN');
    expect(mocks.createRoot).toHaveBeenCalledTimes(1);
    expect(mocks.render).toHaveBeenCalledTimes(1);
  });

  it('still renders app when hydration fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.initSettings.mockRejectedValueOnce(new Error('boom'));

    await import('./main');
    await Promise.resolve();
    await Promise.resolve();

    expect(mocks.createRoot).toHaveBeenCalledTimes(1);
    expect(mocks.render).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});

export {};
