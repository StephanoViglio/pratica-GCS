// Configuração do ESLint (verificação estática do JavaScript)
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/', 'coverage/', 'playwright-report/', 'test-results/', 'dist/']
  },

  js.configs.recommended,

  // Código da aplicação: roda no navegador como script clássico
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { ...globals.browser }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error'
    }
  },

  // Arquivos de configuração (Node)
  {
    files: ['*.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node }
    }
  },

  // Testes unitários (Jest + jsdom: Node + DOM do navegador)
  {
    files: ['tests/unit/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.jest, ...globals.browser }
    }
  },

  // Testes E2E (Playwright)
  {
    files: ['tests/e2e/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node }
    }
  }
];
