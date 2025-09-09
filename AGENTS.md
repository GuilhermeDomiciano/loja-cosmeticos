# Contexto Geral do Projeto — Loja de Cosméticos

## Visão Geral

- Aplicação web construída com `Next.js 15` (App Router) e `TypeScript`.
- Backend via rotas de API (`src/app/api/*`) em camadas (Controller → Service → Repository → Prisma).
- Banco de dados `PostgreSQL` com `Prisma ORM` (schema em `prisma/schema.prisma`).
- Armazenamento de arquivos com `Supabase` (cliente em `src/lib/supabase.ts`).
- UI com `Tailwind CSS` v4; estado e dados com `Zustand` e `@tanstack/react-query`.

## Objetivo do Sistema

- Gerenciar catálogo (categorias, produtos, variações) e estoque (lotes e movimentações).
- Montar e vender kits de produtos.
- Registrar transações financeiras (a pagar/receber) atreladas a movimentações de estoque.
- Controlar usuários e organizações (multi-tenant por `organizacaoId`).
- Armazenar arquivos (imagens, anexos) em bucket do Supabase.

## Arquitetura e Pastas

- `src/app`
  - Páginas, `layout.tsx`, estilos globais e rotas de API (pasta `api`).
- `src/core`
  - `controllers`: valida HTTP e orquestra os serviços (ex.: `usuarioController`).
  - `services`: regras de negócio (ex.: `produtoService`).
  - `repositories`: acesso a dados (Prisma) por entidade.
  - `models`: schemas de validação (`zod`) e tipos de domínio.
- `src/lib`
  - `prisma.ts`: singleton do `PrismaClient`.
  - `supabase.ts`: cliente do Supabase (uso server-side).
- `prisma`
  - `schema.prisma`: definição do modelo de dados e enums.
- `public`: ativos estáticos.
- `.env.local`: variáveis de ambiente (não versionado).

## Fluxos Principais

- Catálogo: criar categorias → produtos → variações (SKU, unidade, preços).
- Estoque: registrar lotes por variação e movimentações (entrada/saída com motivo, canal, preços e totais).
- Kits: definir itens (variações + quantidades) que compõem um kit vendável.
- Financeiro: gerar transações (a pagar/receber), com status e método de pagamento, referentes a movimentações.
- Arquivos: vincular uploads a entidades (produto, kit, movimentação, etc.).

## Entidades (resumo)

- `Organizacao`: escopo multi-tenant; relaciona todas as demais entidades.
- `Usuario`: pertence a uma organização; guarda `email`, `nome`, `senha (hash)` e `papel`.
- `Categoria`: agrupa produtos por organização.
- `Produto`: item de catálogo; pode ter várias `VariacaoProduto`.
- `VariacaoProduto`: SKU, unidade (`UN`, `ML`, `G`, `KG`, `L`), preço/custo, código de barras; movimenta estoque.
- `LoteEstoque`: lote por variação, com quantidade e validade.
- `MovimentacaoEstoque`: entrada/saída com `motivo`, `canal`, quantidades e totais; pode se vincular a transações.
- `Kit`: agrupador vendável composto por `ItemKit` (variações + quantidades).
- `ItemKit`: vínculo `kit` ↔ `variacao` com quantidade.
- `TransacaoFinanceira`: `tipo` (receber/pagar), `status`, método, valores e vencimento; opcionalmente ligada a uma movimentação.
- `Arquivo`: metadados de arquivos no Supabase, ligados a uma entidade e `entidadeId`.

Enums principais: `Unidade`, `TipoMovimentacao`, `MotivoMovimentacao`, `CanalVenda`, `MetodoPagamento`, `TipoTransacao`, `StatusTransacao`.

## Rotas de API (padrão)

- Convenção REST na App Router do Next.js:
  - Coleções: `GET /api/<entidade>` (listar), `POST /api/<entidade>` (criar).
  - Item: `GET|PUT|DELETE /api/<entidade>/:id` (ex.: `src/app/api/usuarios/[id]/route.ts`).
- Exemplo: `src/app/api/usuarios/route.ts` delega para `usuarioController` (camada de controller → service → repository).

## Variáveis de Ambiente

- `DATABASE_URL`: conexão Postgres para Prisma.
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase (exposta no client quando necessário).
- `SUPABASE_SERVICE_ROLE_KEY`: chave com permissões elevadas (uso estritamente server-side).

Observações:
- Mantenha `SUPABASE_SERVICE_ROLE_KEY` somente em código/rotas executados no servidor.
- `src/lib/supabase.ts` deve ser importado apenas em contexto server (sem expor a chave ao browser).

## Como Rodar Localmente

1. Pré-requisitos: `Node.js >= 18`, banco Postgres acessível e `.env.local` preenchido.
2. Instalar dependências: `npm install`.
3. Gerar cliente Prisma: `npx prisma generate`.
4. Criar/sincronizar schema: `npx prisma db push` (ou `npx prisma migrate dev` se usar migrações).
5. Rodar dev server: `npm run dev` e abrir `http://localhost:3000`.

## Bibliotecas e Convenções

- Validação: `zod` em `src/core/models/*Schema.ts`.
- Estado/dados: `@tanstack/react-query`, `zustand`.
- Formulários: `react-hook-form`.
- UI: `tailwindcss` v4 e utilitários (`clsx`, `tailwind-merge`), ícones `lucide-react`.
- Utilidades de datas: `date-fns`.
- Segurança/cripto: `bcryptjs` (hash de senha), `jose` (JWT/assinaturas).
- Prisma loga `error` e `warn` por padrão (`src/lib/prisma.ts`).

## Próximos Passos Sugeridos

- Autenticação e autorização (login, JWT, middleware por `organizacaoId`).
- Políticas no Supabase (RLS) e wrappers server-only para uploads/downloads.
- Migrações versionadas do Prisma (`migrate`) e seeds iniciais.
- Testes de unidade/integração para services e repositories.
- Observabilidade mínima (logs estruturados) e métricas.

