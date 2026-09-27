# Projeto de Prática de GCS

[![CI/CD Pipeline](https://github.com/StephanoViglio/pratica-GCS/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/StephanoViglio/pratica-GCS/actions/workflows/ci-cd.yml)

Versão atual: **v1.0.0**

Projeto desenvolvido para demonstrar práticas de Gerência de Configuração de Software (GCS), incluindo:
- controle de versões;
- identificação de ICs;
- baseline;
- feature flags;
- organização de repositório;
- pipeline de CI/CD com GitHub Actions.

## Estrutura

- src/: código-fonte
- config/: arquivos de configuração
- docs/: documentação adicional (inclui [PIPELINE.md](docs/PIPELINE.md))
- tests/: testes unitários (Jest) e E2E (Playwright)
- .github/workflows/: pipeline de CI/CD

## Tecnologias

- JavaScript
- Node.js
- Git
- GitHub Actions (CI/CD)
- Docker / Nginx

## Pipeline de CI/CD

A cada Pull Request e a cada push na `main` o pipeline executa lint, detecção de segredos, SAST (CodeQL), testes unitários, build da imagem Docker com scan de CVE (Trivy), deploy em **staging** com testes E2E (Playwright) e DAST (OWASP ZAP) e, após aprovação manual, deploy em **produção** (GitHub Pages).

Detalhes e passo a passo: [docs/PIPELINE.md](docs/PIPELINE.md).

```bash
npm install
npm run lint
npm run test:coverage
npm run test:e2e
```
