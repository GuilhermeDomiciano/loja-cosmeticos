# Recurso `itens-kit`

- Itens que compõem um `Kit` (vínculo `kitId` ↔ `variacaoId` + `quantidade`).
- Restrições: `@@unique([kitId, variacaoId])` no Prisma.
- Operações típicas:
  - `GET /api/itens-kit?organizacaoId=<id>&kitId=<id>`
  - `POST /api/itens-kit`
  - `GET|PUT|DELETE /api/itens-kit/:id`
