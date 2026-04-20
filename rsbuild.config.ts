import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    // 静态站点默认使用根路径；如果托管平台要求子路径，可通过 PUBLIC_BASE 覆盖。
    assetPrefix: process.env.PUBLIC_BASE || '/',
  },
  html: {
    title: '肉鸽卡牌 · MVP 战斗',
    favicon: './public/favicon.svg',
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
