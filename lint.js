#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const isLocalMode = process.env.ESLINT_LOCAL === '1';

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
        'no-console': isLocalMode ? 'off' : ['error', { allow: ['warn', 'error'] }]
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

  const i18nGuard = isLocalMode
    ? { status: 0 }
    : spawnSync(
      process.execPath,
      [path.join(__dirname, 'scripts', 'check-i18n-hardcoded.mjs')],
      { stdio: 'inherit' }
    );

  if (!isLocalMode && (errorCount > 0 || i18nGuard.status !== 0)) {
    process.exit(1);
  }
})();
