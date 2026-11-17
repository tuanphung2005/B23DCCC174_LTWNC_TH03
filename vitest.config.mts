// vitest.config.mts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      include: [
        'src/lib/permissions.ts',
        'src/lib/loan-schema.ts',
        'src/lib/format.ts',
        'src/components/LoanForm.tsx',
      ],
    },
  },
});
