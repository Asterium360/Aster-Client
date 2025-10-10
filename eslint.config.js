import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // === Override para archivos de test (Jest) ===
  {
    files: ['**/*.{test,spec}.{js,jsx}', '**/tests/**/*.{js,jsx}'],
    languageOptions: {
      // añadimos las globals de jest para que ESLint reconozca describe/test/expect/etc.
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    // Opcional: reglas específicas para tests (ejemplo: no fallar por console.* en tests)
    rules: {
      'no-console': 'off',
    },
  },
])


