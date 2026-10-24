import '@testing-library/jest-dom/vitest';
import '../lib/i18n';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './server';

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());
