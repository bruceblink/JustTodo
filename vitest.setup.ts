// 导入 jest-dom 扩展，支持 toBeInTheDocument 等方法
import '@testing-library/jest-dom';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!window.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: ResizeObserver,
  });
}
