/**
 * Testes E2E (validação): fluxos completos do ponto de vista do usuário,
 * executados em um navegador real contra a aplicação em execução.
 */
const { test, expect } = require('@playwright/test');

// Estado da feature flag EXIBIR_IA lido do app.js publicado no ambiente
async function flagIaLigada(request) {
  const js = await (await request.get('./app.js')).text();
  return /EXIBIR_IA\s*:\s*true/.test(js);
}

test.describe('Portal da Universidade (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('página principal carrega com título e cabeçalho', async ({ page }) => {
    await expect(page).toHaveTitle('Portal da Universidade');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portal da Universidade');
  });

  test('status do sistema passa de "Online" para "Estável"', async ({ page }) => {
    await expect(page.locator('#status')).toHaveText('Estável', { timeout: 10000 });
  });

  test('visibilidade do Chat Acadêmico com IA respeita a feature flag', async ({ page, request }) => {
    const painel = page.locator('#nova-funcao');
    if (await flagIaLigada(request)) {
      await expect(painel).toBeVisible();
    } else {
      await expect(painel).toBeHidden();
    }
  });

  test('usuário envia pergunta e recebe confirmação', async ({ page, request }) => {
    test.skip(!(await flagIaLigada(request)), 'Chat com IA desligado pela feature flag');
    await page.getByPlaceholder('Pergunte algo...').fill('Qual o horário da biblioteca?');
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.locator('#resposta')).toHaveText('Pergunta enviada: "Qual o horário da biblioteca?"');
  });

  test('pergunta vazia é rejeitada', async ({ page, request }) => {
    test.skip(!(await flagIaLigada(request)), 'Chat com IA desligado pela feature flag');
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.locator('#resposta')).toHaveText('Digite uma pergunta válida.');
  });

  test('endpoint de health check responde com status ok', async ({ request }) => {
    const resp = await request.get('./health.json');
    expect(resp.ok()).toBeTruthy();
    expect((await resp.json()).status).toBe('ok');
  });
});
