# Recurso `organizacoes`

- Escopo multi-tenant do sistema; cada recurso pertence a uma organização.
- Campos: `nome` (único), `criadoEm`.
- Operações típicas:
  - `GET /api/organizacoes`
  - `POST /api/organizacoes`
  - `GET|PUT|DELETE /api/organizacoes/:id`
