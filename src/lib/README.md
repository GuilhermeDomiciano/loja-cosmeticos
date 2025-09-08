# Contexto da pasta `src/lib`

- Utilitários e clientes compartilhados.
- Arquivos principais:
  - `prisma.ts`: singleton do `PrismaClient` (logs: `error`, `warn`).
  - `supabase.ts`: cliente Supabase (usar apenas server-side; requer `SUPABASE_SERVICE_ROLE_KEY`).
  - `utils.ts`: helpers de UI/formatadores/etc.
