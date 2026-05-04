#!/usr/bin/env node

import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const eslint = new ESLint({
    baseConfig: {
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
        sourceType: 'module'
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': ['error', { allow: ['warn', 'error'] }]
      }
    },
    useEslintrc: false
  });

  const results = await eslint.lintFiles(['src/**/*.ts']);
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = await formatter.format(results);

  if (resultText) {
    console.log(resultText);
  }

  const errorCount = results.reduce((count, result) => count + result.errorCount, 0);
  if (errorCount > 0) {
    process.exit(1);
  }
})();
