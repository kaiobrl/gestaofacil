# Deploy do GestaoFacil no Vercel + Neon

## Passo 1: Criar conta no Neon
1. Acesse https://neon.tech
2. Crie uma conta gratuita com GitHub
3. Crie um novo projeto
4. Copie a connection string (formato: `postgresql://...`)

## Passo 2: Criar conta no Vercel
1. Acesse https://vercel.com
2. Faça login com GitHub
3. Importe o repositório do GestaoFacil

## Passo 3: Configurar Variáveis de Ambiente
No dashboard do Vercel, vá em Settings → Environment Variables:
- `DATABASE_URL` = a connection string do Neon
- `NEXTAUTH_URL` = a URL do seu app no Vercel (ex: `https://gestaofacil.vercel.app`)
- `NEXTAUTH_SECRET` = um valor secreto forte (gere com `openssl rand -base64 32`)

## Passo 4: Deploy
1. O deploy será automático após push ao GitHub
2. Para forçar um novo deploy, faça push novamente

## Passo 5: Inicializar o Banco
Após o primeiro deploy, rode o comando:
```bash
npx prisma db push
```
Ou configure o build script para rodar automaticamente.

## Comandos Úteis
```bash
# Gerar cliente Prisma
npx prisma generate

# Sincronizar schema com banco
npx prisma db push

# Criar migration
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio
```

## Limitações do Plano Gratuito
- **Neon:** 0.5GB storage, 24/7 compute off (pausa após inatividade)
- **Vercel:** 100GB bandwidth/mês, 100 horas de build

## Para Produção
- Considere um plano pago do Neon ($19/mês) para compute 24/7
- Adicione domínio personalizado no Vercel
- Configure variáveis de ambiente para Stripe (se usar assinaturas)
