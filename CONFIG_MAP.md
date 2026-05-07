# CONFIG_MAP

## Itens de Configuração (ICs)

| Tipo | Nome | Descrição | Versão |
|------|------|------|------|
| Interface | index.html | Interface principal do Portal da Universidade | 1.0.0 |
| Código-fonte | app.js | Lógica JavaScript da aplicação | 1.0.0 |
| Configuração | config.env | Variáveis de ambiente e configuração | 1.0.0 |
| Documentação | README.md | Documentação principal do projeto | 1.0.0 |
| Documentação | CONFIG_MAP.md | Mapeamento dos ICs do projeto | 1.0.0 |
| Controle de versão | Git | Sistema de versionamento distribuído | 2.x |
| Linguagem | JavaScript | Linguagem da aplicação | ES6 |
| Linguagem | HTML5 | Estrutura da interface web | HTML5 |

---

## Funcionalidades Controladas por Feature Flags

| Flag | Descrição | Estado Inicial |
|------|------|------|
| EXIBIR_IA | Habilita o Chat Acadêmico com IA | true |

---

## Política de Versionamento

O projeto utiliza Versionamento Semântico (SemVer):

MAJOR.MINOR.PATCH

### Regras

- MAJOR:
  Alterações incompatíveis ou breaking changes

- MINOR:
  Novas funcionalidades compatíveis

- PATCH:
  Correções de bugs e ajustes menores

### Exemplos

- 1.0.0 → Primeira versão estável
- 1.1.0 → Nova funcionalidade
- 1.1.1 → Correção de bugs
- 2.0.0 → Mudança incompatível