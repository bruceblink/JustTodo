import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // 使用全局 describe/it/expect
    environment: 'jsdom', // 模拟浏览器环境
    setupFiles: './vitest.setup.ts', // 全局测试初始化
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'], // 测试文件匹配
    coverage: {
      provider: 'istanbul', // 覆盖率
      reporter: ['text', 'lcov'],
    },
  },
});
