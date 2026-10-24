import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    env: { VITE_API_URL: 'https://test.mock/flights' },
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './reports/coverage',
      reporter: ['text', 'html'],
    },
  },
});
