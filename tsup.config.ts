import { defineConfig } from 'tsup';

export default defineConfig([
  // ライブラリビルド（Node.js用）
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: true,
    target: 'es2022',
    outDir: 'dist',
  },
  // ブラウザ用ビルド（ファイルシステム非依存）
  {
    entry: { browser: 'src/browser.ts' },
    format: ['esm'],
    dts: true,
    clean: false,
    minify: true,
    sourcemap: true,
    target: 'es2022',
    outDir: 'dist',
    platform: 'browser',
  },
  // CLIビルド
  {
    entry: ['cli/bin.ts'],
    format: ['esm'],
    dts: false,
    clean: false,
    minify: false,
    sourcemap: false,
    target: 'es2022',
    outDir: 'dist',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
