/**
 * Testes unitários do src/app.js (verificação dinâmica isolada, sem servidor).
 * O HTML real (src/index.html) é carregado no jsdom e o script é executado
 * sobre ele, como aconteceria no navegador.
 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../../src/index.html'), 'utf8');
const bodyHtml = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];

// Lê o estado atual da feature flag direto do código-fonte, para que ligar/desligar
// a flag (release) não quebre o pipeline (deploy).
const appSource = fs.readFileSync(path.join(__dirname, '../../src/app.js'), 'utf8');
const FLAG_IA = /EXIBIR_IA\s*:\s*true/.test(appSource);

function carregarApp() {
  document.body.innerHTML = bodyHtml;
  jest.isolateModules(() => {
    require('../../src/app.js');
  });
}

describe('Portal da Universidade - app.js', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    carregarApp();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test(`painel do Chat com IA respeita a feature flag EXIBIR_IA (${FLAG_IA})`, () => {
    const painel = document.getElementById('nova-funcao');
    if (FLAG_IA) {
      expect(painel.style.display).toBe('block');
      expect(console.log).toHaveBeenCalledWith('Feature IA habilitada.');
    } else {
      expect(painel.style.display).toBe('none');
      expect(console.log).toHaveBeenCalledWith('Feature IA desabilitada.');
    }
  });

  test('pergunta vazia exibe mensagem de validação', () => {
    document.getElementById('pergunta').value = '   ';
    document.getElementById('btn-enviar').click();
    expect(document.getElementById('resposta').innerHTML).toBe('Digite uma pergunta válida.');
  });

  test('pergunta válida é enviada e exibida na resposta', () => {
    document.getElementById('pergunta').value = 'Quando começa o semestre?';
    document.getElementById('btn-enviar').click();
    expect(document.getElementById('resposta').innerHTML)
      .toBe('Pergunta enviada: "Quando começa o semestre?"');
  });

  test('status do sistema muda para "Estável" após 3 segundos', () => {
    const status = document.getElementById('status');
    expect(status.innerHTML).toBe('Online');
    jest.advanceTimersByTime(3000);
    expect(status.innerHTML).toBe('Estável');
  });

  test('inicialização no DOMContentLoaded aplica a feature flag', () => {
    const painel = document.getElementById('nova-funcao');
    painel.style.display = 'none';
    window.dispatchEvent(new Event('DOMContentLoaded'));
    expect(painel.style.display).toBe(FLAG_IA ? 'block' : 'none');
  });
});
