import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
    Buffer: 'buffer/',
  },
  optimizeDeps: {
    include: ['@project-serum/anchor', 'bn.js'],
    exclude: ['lucide-react', '@wallet-standard/errors'],
    esbuildOptions: {
      mainFields: ['exports', 'browser', 'module', 'main']
    }
  },
  resolve: {
    mainFields: ['exports', 'browser', 'module', 'main']
  },
});
