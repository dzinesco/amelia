import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['regenerator-runtime/runtime']
  },
  server: {
    https: true
  },
  preview: {
    https: true
  }
});