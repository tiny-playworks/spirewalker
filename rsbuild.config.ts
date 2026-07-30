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
    title: 'Spirewalker · 连势构筑之旅',
    favicon: './public/favicon.svg',
    meta: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      'theme-color': '#0a0a0b',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
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
