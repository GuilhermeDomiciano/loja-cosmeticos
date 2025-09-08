# Contexto da pasta `prisma`

- `schema.prisma`: definição do modelo de dados (PostgreSQL) e enums.
- Comandos úteis:
  - `npx prisma generate` → gerar cliente.
  - `npx prisma db push` → sincronizar schema no banco.
  - `npx prisma migrate dev` → criar/rodar migrações versionadas.
- Variável `DATABASE_URL` deve estar definida em `.env.local`.
