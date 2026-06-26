# GestãoFácil

CRM multi-tenant para gestão de contatos, negócios e pipeline de vendas.

## Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS 4 + shadcn/ui
- **Backend**: Next.js API Routes
- **Banco**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (JWT + Credentials)

## Funcionalidades

- Autenticação (login/registro) com isolamento multi-tenant
- Dashboard com métricas em tempo real
- Gestão de contatos (CRUD completo + busca + vinculação a empresas)
- Gestão de empresas (CRUD completo)
- Pipeline de vendas com drag-and-drop
- Gestão de negócios (CRUD completo com contatos e empresas vinculados)
- Atividades (CRUD completo com vinculação a contatos e negócios)
- Relatórios de desempenho com dados reais
- Configurações de perfil, empresa e senha

## Estrutura

```
src/
├── app/
│   ├── (auth)/                # Login e registro
│   ├── (marketing)/           # Landing page
│   ├── api/
│   │   ├── auth/              # Autenticação NextAuth
│   │   ├── contacts/          # CRUD contatos + [id]
│   │   ├── companies/         # CRUD empresas + [id]
│   │   ├── deals/             # CRUD negócios
│   │   ├── activities/        # CRUD atividades
│   │   ├── user/              # Perfil + senha
│   │   ├── tenant/            # Configurações empresa
│   │   ├── reports/           # Dados agregados
│   │   └── health/            # Health check
│   └── dashboard/             # Área autenticada
├── components/
│   ├── layout/                # Sidebar, Header
│   └── ui/                    # Componentes shadcn/ui
├── lib/
│   ├── auth.ts                # Configuração NextAuth
│   ├── prisma.ts              # Singleton Prisma
│   ├── session.ts             # Helpers de sessão
│   ├── utils.ts               # Helpers utilitários
│   └── validations/           # Schemas Zod
└── generated/                 # Tipos Prisma gerados
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
- **Contact**: Contatos do CRM (vinculados a empresas)
- **Company**: Empresas
- **Deal**: Negócios/oportunidades (vinculados a contatos e empresas)
- **Pipeline**: Fluxo de vendas com estágios
- **Activity**: Atividades (chamadas, emails, reuniões, notas)
- **Task**: Tarefas

## API Endpoints

### Autenticação
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/auth/register` | POST | Criar conta |
| `/api/auth/[...nextauth]` | GET/POST | Autenticação |

### Contatos
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/contacts` | GET/POST/DELETE | Listar/criar/excluir contatos |
| `/api/contacts/[id]` | GET/PATCH/DELETE | Buscar/atualizar/excluir contato |

### Empresas
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/companies` | GET/POST/DELETE | Listar/criar/excluir empresas |
| `/api/companies/[id]` | GET/PATCH/DELETE | Buscar/atualizar/excluir empresa |

### Negócios
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/deals` | GET/POST/PATCH/DELETE | Listar/criar/atualizar/excluir negócios |

### Atividades
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/activities` | GET/POST/PATCH/DELETE | Listar/criar/atualizar/excluir atividades |

### Configurações
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/user` | GET/PATCH | Perfil do usuário |
| `/api/user/password` | PATCH | Alterar senha |
| `/api/tenant` | GET/PATCH | Configurações da empresa |

### Relatórios
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/reports` | GET | Dados agregados de desempenho |

### Sistema
| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/api/health` | GET | Health check do sistema |

## Deploy

Consulte [DEPLOY.md](./DEPLOY.md) para instruções de deploy no Vercel + Neon.
