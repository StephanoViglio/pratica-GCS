// Configuração do Playwright (testes E2E executados contra o ambiente de staging)
const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://localhost:8080';

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Execução local: sem BASE_URL, sobe um servidor estático com a pasta src/
  webServer: process.env.BASE_URL
    ? undefined
    : {
      command: 'npm start',
      url: baseURL,
      reuseExistingServer: true
    }
});
