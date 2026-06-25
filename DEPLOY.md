# Deploy - GestãoFácil

## Opção 1: Vercel + Neon (Recomendado)

### 1. Criar banco no Neon

1. Acesse https://neon.tech
2. Crie conta com GitHub
3. Crie um novo projeto
4. Copie a connection string (formato: `postgresql://...@ep-xxx.us-east-2.aws.neon.tech/gestaofacil?sslmode=require`)

### 2. Importar projeto no Vercel

1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New..." → "Project"
4. Selecione o repositório do GestãoFácil
5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npx prisma generate && next build`
   - **Install Command**: `npm install`

### 3. Variáveis de Ambiente

No dashboard do Vercel, vá em Settings → Environment Variables e adicione:

| Variável | Valor | Observação |
|----------|-------|------------|
| `DATABASE_URL` | `postgresql://...` | Connection string do Neon |
| `NEXTAUTH_URL` | `https://seu-app.vercel.app` | URL do deploy |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Gere um valor seguro |

### 4. Deploy

1. O deploy é automático após push ao GitHub
2. Para forçar redeploy: Settings → Deployments → Redeploy

### 5. Inicializar banco

Após o primeiro deploy, execute localmente:

```bash
# Configure o DATABASE_URL apontando para o Neon
npx prisma db push
```

Ou crie um script de seed para dados iniciais.

---

## Opção 2: Docker + PostgreSQL Local

### docker-compose.yml

```yaml
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: gestaofacil
      POSTGRES_PASSWORD: sua-senha
      POSTGRES_DB: gestaofacil
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://gestaofacil:sua-senha@db:5432/gestaofacil
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: seu-segredo-aqui
    depends_on:
      - db

volumes:
  pgdata:
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

### Iniciar

```bash
docker-compose up -d
npx prisma db push
```

---

## Opção 3: Render

1. Crie conta no https://render.com
2. Crie um "Web Service" apontando para o repositório
3. Configure:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Adicione as variáveis de ambiente (mesmas do Vercel)
5. Crie um "PostgreSQL" no Render para o banco

---

## Comandos Úteis

```bash
# Gerar cliente Prisma
npx prisma generate

# Sincronizar schema (desenvolvimento)
npx prisma db push

# Criar migration (produção)
npx prisma migrate deploy

# Visualizar banco
npx prisma studio

# Verificar erros
npm run lint
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | URL de conexão PostgreSQL |
| `NEXTAUTH_URL` | Sim | URL base da aplicação |
| `NEXTAUTH_SECRET` | Sim | Segredo para JWT |
| `STRIPE_SECRET_KEY` | Não | Para pagamentos |
| `STRIPE_PUBLISHABLE_KEY` | Não | Para pagamentos |

## Produção

### Checklist

- [ ] Variáveis de ambiente configuradas
- [ ] `NEXTAUTH_SECRET` seguro (não usar o padrão)
- [ ] `NEXTAUTH_URL` com HTTPS
- [ ] Banco de dados inicializado com `prisma migrate deploy`
- [ ] Dominio personalizado configurado
- [ ] SSL/HTTPS habilitado

### Performance

- O Prisma Client é singleton em desenvolvimento (evita connections excessivas)
- Em produção, considere connection pooling (PgBouncer ou Neon Pooler)
- O build já gera o cliente Prisma automaticamente

### Limitações dos Planos Gratuitos

| Serviço | Limite |
|---------|--------|
| **Neon** | 0.5GB storage, compute pausa após inatividade |
| **Vercel** | 100GB bandwidth/mês, 100h build |
| **Render** | 750h/mês, suspende após 15min inatividade |

### Recomendações

- Neon Pro ($19/mês): compute 24/7 + mais storage
- Vercel Pro ($20/mês): mais bandwidth + analytics
- Domain personalizado via Vercel ou Cloudflare
