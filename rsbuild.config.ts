import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    // GitHub Pages 项目页需要带仓库子路径；自定义域名可覆盖为 "/"
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
