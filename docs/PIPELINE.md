# Pipeline de CI/CD — GitHub Actions

Atividade: **Construindo um pipeline de CI/CD** (Aula 04 — Pipelines Modernos de CI/CD).

O pipeline está definido em [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml) e segue a
arquitetura canônica vista em aula: **Linting & SAST → Testes Automatizados → Build & Scanner CVE →
Publicação no Registry → Staging → Promoção para Produção**.

---

## 1. Visão geral dos jobs

| # | Job | O que faz | Ferramentas | Tipo de verificação | Ambiente |
|---|-----|-----------|-------------|---------------------|----------|
| 1 | `lint` | Procura segredos no histórico, faz lint de JS e HTML, audita dependências | Gitleaks, ESLint, HTMLHint, `npm audit` | **Estática** | — |
| 1b | `sast` | Análise de segurança do código (SAST); resultados vão para a aba *Security* | GitHub **CodeQL** | **Estática** | — |
| 2 | `unit-tests` | Testes unitários com cobertura mínima (quality gate) | Jest + jsdom | Dinâmica (isolada) | — |
| 3–4 | `build` | Gera a imagem Docker (artefato imutável, tag = SHA do commit), escaneia CVEs e publica no registry | Docker Buildx, **Trivy**, GHCR | Estática (imagem) | — |
| 5 | `deploy-staging` | Sobe o contêiner, faz health check/smoke test, roda E2E e DAST | Docker, Playwright, **OWASP ZAP** | **Dinâmica** | **`staging`** |
| 6a | `approve-production` | Pausa o pipeline até um revisor aprovar (Continuous Delivery) | GitHub Environments | — | **`production`** |
| 6b | `deploy-production` | Extrai o site da **mesma** imagem testada e publica; smoke test pós-deploy | GitHub Pages | Dinâmica (smoke) | **`github-pages`** |

```
lint ──► unit-tests ──┐
                      ├──► build ──► deploy-staging ──► approve-production ──► deploy-production
sast ─────────────────┘                                  (só push na main)
```

**Quando cada parte roda**

| Evento | Jobs executados |
|--------|-----------------|
| Pull Request para `main` | 1, 1b, 2, 3 (sem publicar imagem) e 5 (staging) |
| Push/merge na `main` | Todos; a imagem é publicada no GHCR e produção aguarda aprovação |
| Manual (*Run workflow*) | Igual ao push na branch escolhida |

### Conceitos da aula aplicados

- **Shift-Left:** lint, segredos e SAST rodam primeiro e em segundos (*fail-fast*).
- **Artefato imutável:** a imagem é construída **uma vez** (`sha-<commit>`); staging e produção usam o mesmo binário. Produção não recompila nada.
- **Segredos fora do código:** só se usa `secrets.GITHUB_TOKEN`; nada de credenciais em `ARG`/`ENV`.
- **Health check:** `health.json` informa `status`, `version` e `commit`; o pipeline confere se o commit publicado é o esperado.
- **Continuous Delivery:** produção exige aprovação manual pelo *environment* `production`.
- **Deploy × Release:** a feature flag `EXIBIR_IA` continua funcionando. Os testes leem o valor da flag, então ligar ou desligar a funcionalidade não quebra o pipeline.
- **Menor privilégio:** cada job declara apenas as `permissions` de que precisa, e as actions estão travadas por versão (`@v7`, `@v0.36.0`, nunca `@latest`).

---

## 2. Arquivos adicionados ao repositório

| Arquivo | Função |
|---------|--------|
| `.github/workflows/ci-cd.yml` | Definição do pipeline |
| `package.json` / `package-lock.json` | Dependências de desenvolvimento e scripts (`lint`, `test`, `test:e2e`, `start`) |
| `eslint.config.js` | Regras do ESLint |
| `.htmlhintrc` | Regras do HTMLHint |
| `jest.config.js` | Testes unitários e limites de cobertura |
| `tests/unit/app.test.js` | Testes unitários do `src/app.js` |
| `playwright.config.js` | Configuração dos testes E2E |
| `tests/e2e/portal.spec.js` | Testes E2E (fluxos do usuário) |
| `Dockerfile` | Build multi-stage da imagem (nginx sem root) |
| `nginx.conf` | Servidor web + cabeçalhos de segurança |
| `.dockerignore` / `.gitignore` | Exclusões de build/versionamento |
| `src/health.json` | Health check (é sobrescrito no build com versão/commit) |

---

## 3. Passo a passo para colocar o pipeline no ar

### Passo 1 — Levar os arquivos para o repositório

```bash
git clone https://github.com/StephanoViglio/pratica-GCS.git
cd pratica-GCS
git checkout -b feature/pipeline-ci-cd
# copie os arquivos desta entrega para a raiz do repositório
# (ou aplique o patch:  git am 0001-*.patch)
```

### Passo 2 — Testar localmente (opcional, recomendado)

Requer Node.js 20+.

```bash
npm install                 # instala ESLint, Jest, Playwright...
npm run lint                # verificação estática
npm run test:coverage       # testes unitários + cobertura
npx playwright install chromium
npm run test:e2e            # E2E (sobe um servidor local automaticamente)
```

Com Docker instalado, dá para simular o staging:

```bash
docker build -t portal:local --build-arg GIT_SHA=$(git rev-parse HEAD) .
docker run -d -p 8080:8080 --name portal portal:local
curl http://localhost:8080/health.json
BASE_URL=http://localhost:8080/ npm run test:e2e
docker rm -f portal
```

### Passo 3 — Configurar o GitHub (uma única vez)

1. **Pages:** *Settings → Pages → Build and deployment → Source:* selecione **GitHub Actions**.
2. **Ambientes:** em *Settings → Environments* crie:
   - **`staging`**: sem regras de proteção.
   - **`production`**: marque **Required reviewers**, adicione seu usuário e, em *Deployment branches and tags*, restrinja a `main`.
   - O ambiente **`github-pages`** é criado automaticamente pelo GitHub quando você ativa o Pages. Confirme que ele permite a branch `main`.
3. **Code scanning:** em *Settings → Code security*, deixe o **CodeQL "Default setup" desativado**. O workflow já usa a configuração avançada, e as duas juntas conflitam.
4. **Workflow permissions** (*Settings → Actions → General*): pode ficar em "Read repository contents". O workflow pede as permissões extras job a job.

### Passo 4 — Abrir o Pull Request (CI)

```bash
git add .
git commit -m "ci: adiciona pipeline de CI/CD com GitHub Actions"
git push -u origin feature/pipeline-ci-cd
```

Abra o PR para `main`. Na aba **Actions** você verá os jobs 1 → 5 rodando. O deploy em produção **não** acontece em PR.

### Passo 5 — Proteger a `main` (recomendado)

*Settings → Branches → Add rule* (ou *Rulesets*) para `main`:
- ✅ *Require a pull request before merging*
- ✅ *Require status checks to pass*: selecione `1. Lint & Segredos`, `1b. SAST (CodeQL)`, `2. Testes Unitários`, `3. Build, Scan & Publish` e `5. Deploy Staging + E2E + DAST`.

### Passo 6 — Merge e promoção para produção (CD)

1. Faça o merge do PR. O pipeline completo roda na `main`.
2. Ao chegar em **6a. Aprovação Produção**, o pipeline fica em **"Waiting"**. Clique em **Review deployments → production → Approve and deploy**.
3. O job **6b** publica no GitHub Pages e confere se `health.json` responde com o commit certo.
4. O site fica em `https://stephanoviglio.github.io/pratica-GCS/` e a imagem em *Packages* (`ghcr.io/stephanoviglio/pratica-gcs`).

---

## 4. Onde ver os resultados

| Resultado | Onde |
|-----------|------|
| Status de cada job | Aba **Actions** → execução do workflow |
| Resumo de cobertura, aprovação e URL de produção | *Summary* da execução |
| Alertas do CodeQL e do Trivy | Aba **Security → Code scanning** |
| Relatórios de cobertura, Playwright e ZAP | *Artifacts* no fim da execução |
| Histórico de deploys por ambiente | Página inicial do repo → **Environments / Deployments** |
| Imagem Docker publicada | Perfil/repositório → **Packages** |

---

## 5. Sugestões de demonstração (evidências para a atividade)

- **Quality gate estático:** num PR, adicione `var x = 1;` sem uso em `app.js`. O job 1 falha no ESLint e nada mais roda.
- **Teste falhando:** mude a mensagem `'Digite uma pergunta válida.'`. O job 2 falha.
- **Feature flag (deploy ≠ release):** mude `EXIBIR_IA` para `false`. O pipeline passa (os testes se adaptam) e o painel some em produção.
- **Aprovação:** tire prints da tela "Waiting for review" e do ambiente `production` aprovado.

---

## 6. Observações

- **Staging efêmero:** o ambiente `staging` roda o contêiner no próprio runner do GitHub durante o job, onde passam os testes dinâmicos (E2E + DAST). Em uma empresa, esse passo faria deploy num servidor/cluster de homologação permanente.
- **OWASP ZAP** está configurado como informativo (`fail_action: false`); o relatório fica nos *Artifacts*. Para torná-lo um gate, mude para `true`.
- **Trivy** bloqueia o pipeline se a imagem tiver CVE **HIGH/CRITICAL** com correção disponível. Se isso acontecer, basta rodar de novo mais tarde (a imagem base `stable-alpine` recebe patches) ou atualizar a base.
- **Cobertura mínima:** o gate está em 75% de linhas (80% de funções). Com a flag desligada, parte do código não executa e a cobertura cai para ~78%; um limite de 80% bloquearia um simples *release toggle*.
- Para ambientes profissionais, recomenda-se travar as actions pelo **SHA completo** do commit (ex.: `uses: actions/checkout@<sha>`) em vez da tag.
