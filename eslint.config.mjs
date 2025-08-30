import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cfg = {
  extends: ['prettier', 'next/core-web-vitals', 'next/typescript'],
  plugins: ['prettier', 'simple-import-sort'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: cfg,
});

export default compat.config(cfg);
