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
  },
  optimizeDeps: {
    include: ['tweetnacl'],
    exclude: [
      'lucide-react',
      'react-fast-compare',
      'ethers',
      'uuid',
      '@solana/spl-token-metadata',
      '@dynamic-labs/embedded-wallet-solana',
      '@ethersproject/signing-key',
      '@crossmint/wallets-sdk'
    ],
    esbuildOptions: {
      mainFields: ['exports', 'browser', 'module', 'main']
    }
  },
  resolve: {
    mainFields: ['exports', 'browser', 'module', 'main']
  },
});
