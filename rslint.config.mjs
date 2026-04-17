import { defineConfig, reactPlugin, ts } from '@rslint/core';

export default defineConfig([
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
  ts.configs.recommended,
  reactPlugin.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
