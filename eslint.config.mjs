import { defineConfig } from 'eslint/config';
import { globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      'no-useless-escape': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Custom ignores:
    'src/api/client/@tanstack/**/*', // Fichiers générés automatiquement
    'next.config.js', // Configuration Next.js
    'next.config.mjs', // Configuration Next.js
  ]),
]);

export default eslintConfig;
