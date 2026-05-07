// ===============================
// CONFIGURAÇÕES DO SISTEMA
// ===============================

const flags = {
  EXIBIR_IA: true
};

// ===============================
// ELEMENTOS DA INTERFACE
// ===============================

const painelIA = document.getElementById('nova-funcao');
const botaoEnviar = document.getElementById('btn-enviar');
const campoPergunta = document.getElementById('pergunta');
const resposta = document.getElementById('resposta');
const statusSistema = document.getElementById('status');

// ===============================
// FEATURE FLAG
// ===============================

if (flags.EXIBIR_IA) {

  painelIA.style.display = 'block';

  painelIA.style.background = '#fd5d5d';

  console.log('Feature IA habilitada.');

} else {

  console.log('Feature IA desabilitada.');

}

// ===============================
// INTERAÇÃO SIMPLES
// ===============================

botaoEnviar.addEventListener('click', () => {

  const pergunta = campoPergunta.value;

  if (pergunta.trim() === '') {

    resposta.innerHTML =
      'Digite uma pergunta válida.';

    return;
  }

  resposta.innerHTML =
    `Pergunta enviada: "${pergunta}"`;

});

// ===============================
// SIMULAÇÃO DE MONITORAMENTO
// ===============================

setTimeout(() => {

  statusSistema.innerHTML = 'Estável';

}, 3000);