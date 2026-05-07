# Documentação Técnica — Portal da Universidade

## 1. Visão Geral

O projeto **Portal da Universidade** foi desenvolvido como atividade prática de Gerência de Configuração de Software (GCS), utilizando Git para versionamento e controle dos Itens de Configuração (ICs).

A aplicação simula um portal acadêmico simples com suporte a Feature Flags para habilitação controlada de funcionalidades experimentais.

---

# 2. Objetivo do Projeto

O sistema possui como objetivo:

* Demonstrar organização de repositório;
* Aplicar conceitos de GCS;
* Utilizar controle de versões com Git;
* Criar e documentar uma baseline;
* Demonstrar uso de Feature Flags;
* Separar interface e lógica da aplicação.

---

# 3. Estrutura do Projeto

```txt
meu-projeto/
│
├── src/
│   ├── index.html
│   └── app.js
│
├── config/
│   └── config.env
│
├── docs/
│   └── documentacao.md
│
├── README.md
├── CONFIG_MAP.md
└── .gitignore
```

---

# 4. Tecnologias Utilizadas

| Tecnologia | Finalidade                |
| ---------- | ------------------------- |
| HTML5      | Estrutura da interface    |
| JavaScript | Lógica da aplicação       |
| Git        | Controle de versão        |
| GitHub     | Hospedagem do repositório |

---

# 5. Funcionalidades

## 5.1 Portal Acadêmico

O sistema exibe:

* título do portal;
* status do sistema;
* área de interação do usuário.

---

## 5.2 Feature Flag

A funcionalidade experimental “Chat Acadêmico com IA” é controlada pela Feature Flag:

```javascript
EXIBIR_IA
```

Quando habilitada:

* o painel é exibido;
* alterações visuais são aplicadas;
* a funcionalidade fica acessível ao usuário.

---

## 5.3 Interação do Usuário

O sistema permite:

* inserção de perguntas;
* simulação de envio;
* retorno visual da interação.

---

# 6. Controle de Configuração

Os principais Itens de Configuração do projeto são:

| IC            | Tipo              |
| ------------- | ----------------- |
| index.html    | Interface         |
| app.js        | Código-fonte      |
| config.env    | Configuração      |
| README.md     | Documentação      |
| CONFIG_MAP.md | Mapeamento de ICs |

---

# 7. Versionamento

O projeto utiliza Versionamento Semântico:

```txt
MAJOR.MINOR.PATCH
```

Exemplos:

* 1.0.0 → primeira versão estável;
* 1.1.0 → nova funcionalidade;
* 1.1.1 → correção de bugs;
* 2.0.0 → breaking change.

---

# 8. Baseline

A baseline inicial do sistema foi criada através da tag:

```bash
git tag -a v1.0.0 -m "Baseline inicial do portal universitario"
```

Essa tag representa a primeira versão estável do projeto.

---

# 9. Considerações Finais

O projeto demonstra a aplicação prática de conceitos fundamentais de Gerência de Configuração de Software, incluindo:

* controle de versões;
* rastreabilidade;
* organização de repositório;
* identificação de ICs;
* criação de baseline;
* controle de funcionalidades por Feature Flags.
