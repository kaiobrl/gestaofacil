# GestãoFácil

CRM multi-tenant para gestão de contatos, negócios e pipeline de vendas.

## Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS 4 + shadcn/ui
- **Backend**: Next.js API Routes
- **Banco**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v4 (JWT + Credentials)

## Funcionalidades

- Autenticação (login/registro) com isolamento multi-tenant
- Dashboard com métricas
- Gestão de contatos com busca
- Gestão de empresas
- Pipeline de vendas com drag-and-drop
- Gestão de negócios (deals) com estágios
- Atividades (chamadas, emails, reuniões, notas)
- Relatórios de desempenho
- Configurações de perfil e empresa

## Estrutura

```
src/
├── app/
│   ├── (auth)/           # Login e registro
│   ├── (marketing)/      # Landing page
│   ├── api/              # API REST
│   └── dashboard/        # Área autenticada
├── components/
│   ├── layout/           # Sidebar, Header
│   └── ui/               # Componentes shadcn/ui
├── lib/
│   ├── auth.ts           # Configuração NextAuth
│   ├── prisma.ts         # Singleton Prisma
│   └── utils.ts          # Helpers utilitários
└── generated/            # Tipos Prisma gerados
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou Neon/Supabase)

## Instalação

```bash
# Clonar repositório
git clone <url-do-repositorio>
cd gestaofacil

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Gerar cliente Prisma
npx prisma generate

# Sincronizar banco de dados
npx prisma db push

# Iniciar desenvolvimento
npm run dev
```

Acesse http://localhost:3000

## Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:password@host:5432/gestaofacil"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-segredo-aqui"
```

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Verificar código

npm run db:push      # Sincronizar schema com banco
npm run db:migrate   # Criar migration
npm run db:studio    # Abrir Prisma Studio
```

## Modelo de Dados

Entidades principais:
- **Tenant**: Empresa/organização (multi-tenant)
- **User**: Usuários com roles (ADMIN/USER)
- **Contact**: Contatos do CRM
- **Company**: Empresas
- **Deal**: Negócios/oportunidades
- **Pipeline**: Fluxo de vendas com estágios
- **Activity**: Atividades (chamadas, emails, reuniões)
- **Task**: Tarefas

## API Endpoints

| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/auth/register` | POST | Criar conta |
| `/api/auth/[...nextauth]` | GET/POST | Autenticação |
| `/api/contacts` | GET/POST | Listar/criar contatos |
| `/api/companies` | GET/POST | Listar/criar empresas |
| `/api/deals` | GET/POST/PATCH | Negócios |
| `/api/activities` | GET/POST/PATCH | Atividades |

## Deploy

Consulte [DEPLOY.md](./DEPLOY.md) para instruções de deploy no Vercel + Neon.
