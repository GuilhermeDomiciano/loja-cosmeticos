# Recurso `lotes`

- Lotes de estoque por variação: quantidade disponível e validade (`venceEm`).
- Campos: `variacaoId`, `quantidade`, `codigo?`, `venceEm?`, `organizacaoId`.
- Operações típicas:
  - `GET /api/lotes?organizacaoId=<id>&variacaoId=<id>`
  - `POST /api/lotes`
  - `GET|PUT|DELETE /api/lotes/:id`
