import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@solana/spl-account-compression'],
    esbuildOptions: {
      mainFields: ['exports', 'browser', 'module', 'main']
    }
  },
  resolve: {
    mainFields: ['exports', 'browser', 'module', 'main']
  },
});
