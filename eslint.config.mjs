import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cfg = {
  extends: ['prettier', 'next/core-web-vitals', 'next/typescript'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: cfg,
});

export default compat.config(cfg);
