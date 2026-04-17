import { defineConfig } from '@rstest/core';
import { withRsbuildConfig } from '@rstest/adapter-rsbuild';

export default defineConfig({
  extends: withRsbuildConfig(),
  testEnvironment: 'node',
  include: ['tests/**/*.test.ts'],
});
