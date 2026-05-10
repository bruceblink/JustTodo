// 导入 jest-dom 扩展，支持 toBeInTheDocument 等方法
import '@testing-library/jest-dom';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
