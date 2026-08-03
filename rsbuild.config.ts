import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';

export default defineConfig({
  plugins: [
    pluginReact({
      reactRefreshOptions: {
        exclude: [/\.css\.ts$/],
      },
    }),
  ],
  output: {
    // 静态站点默认使用根路径；如果托管平台要求子路径，可通过 PUBLIC_BASE 覆盖。
    assetPrefix: process.env.PUBLIC_BASE || '/',
  },
  performance: {
    chunkSplit: {
      override: {
        cacheGroups: {
          vanilla: {
            test: /@vanilla-extract\/webpack-plugin/,
            name: process.env.NODE_ENV === 'development' ? 'vanilla' : undefined,
            chunks: 'all',
          },
        },
      },
    },
  },
  html: {
    title: '辉芯工坊 · 双枪构筑试炼',
    favicon: './public/favicon.svg',
    meta: {
      viewport: 'width=device-width, initial-scale=1',
      'theme-color': '#145e65',
    },
    tags: [
      {
        tag: 'link',
        attrs: { rel: 'manifest', href: './manifest.webmanifest' },
      },
    ],
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
  tools: {
    rspack: {
      plugins: [new VanillaExtractPlugin()],
    },
  },
});
