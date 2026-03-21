    # CI/CD Pipeline - USCS Inventário

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                            │
│                                                                     │
│  sandbox (DEV) ──→ release (HML) ──→ master (PRD)                 │
└───────┬─────────────────┬─────────────────┬─────────────────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ GitHub Actions│ │ GitHub Actions│ │ GitHub Actions│
│  Build & Deploy│ │ Build & Deploy│ │ Build & Deploy│
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────┐
│              GitHub Pages (site único)               │
│                                                     │
│  /dev/  ←── sandbox                                 │
│  /hml/  ←── release                                 │
│  /      ←── master (produção)                       │
└─────────────────────────────────────────────────────┘
```

## Estrutura de Branches

| Branch    | Ambiente    | URL                                     |
|-----------|-------------|-----------------------------------------|
| `sandbox` | **DEV**     | `https://<user>.github.io/<repo>/dev/`  |
| `release` | **HML**     | `https://<user>.github.io/<repo>/hml/`  |
| `master`  | **PRD**     | `https://<user>.github.io/<repo>/`      |

## Fluxo de Trabalho

### CI (Continuous Integration)
Executado automaticamente em **PRs** para `master`, `release` e `sandbox`:

1. **Lint** — Verifica qualidade do código com ESLint
2. **Build** — Compila a aplicação Next.js (valida que compila)

### CD (Continuous Deployment)
Executado automaticamente em **pushes** para `master`, `release` e `sandbox`:

1. **Setup** — Determina o ambiente e basePath baseado na branch
2. **Build** — Compila a aplicação com `output: export` do Next.js
3. **Deploy** — Publica no GitHub Pages (mantendo todos os ambientes)

O deploy preserva os ambientes anteriores. Por exemplo, ao fazer push em `sandbox`, apenas a pasta `/dev/` é atualizada — `/hml/` e `/` (PRD) permanecem intactos.

## Setup Inicial

### 1. Habilitar GitHub Pages

1. Vá em **Settings → Pages** no repositório
2. Em **Build and deployment → Source**, selecione **GitHub Actions**

### 2. Criar Branches

```bash
# Branch de desenvolvimento
git checkout -b sandbox
git push origin sandbox

# Branch de homologação
git checkout -b release
git push origin release
```

### 3. Configurar Variáveis (opcional)

Vá em **Settings → Environments** no repositório e crie 3 environments:

- `dev`
- `hml`
- `prd`

Para cada environment, configure as seguintes **variables** (se necessário):

| Variable                | Descrição                       |
|-------------------------|---------------------------------|
| `NEXT_PUBLIC_API_URL`   | URL da API do backend           |

### 4. Primeiro Deploy

Faça um push em qualquer uma das branches para acionar o deploy:

```bash
git checkout sandbox
git push origin sandbox
```

Após o workflow completar, acesse:
- **DEV**: `https://<user>.github.io/<repo>/dev/`
- **HML**: `https://<user>.github.io/<repo>/hml/`
- **PRD**: `https://<user>.github.io/<repo>/`

## Estrutura de Arquivos

```
.github/
  workflows/
    ci.yml              # CI: lint + build (PRs)
    cd.yml              # CD: build + deploy GitHub Pages (push)
infra/
  README.md             # Esta documentação
```

## Notas

- **GitHub Pages** é gratuito para repositórios públicos e privados (GitHub Pro/Teams)
- O build usa `output: 'export'` do Next.js, gerando arquivos estáticos
- O `basePath` é configurado automaticamente por ambiente via variável de ambiente
- A pasta `infra/terraform/` contém IaC para AWS caso queira migrar futuramente
