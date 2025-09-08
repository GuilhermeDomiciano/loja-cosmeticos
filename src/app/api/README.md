# Contexto da pasta `src/app/api`

- Endpoints REST por entidade do domínio.
- Cada subpasta representa um recurso (ex.: `usuarios`, `produtos`).
- Handlers (`route.ts`) apenas validam/roteiam e delegam para `core/controllers`.
- Uso recomendado dos métodos HTTP:
  - `GET /api/<recurso>` → listar
  - `POST /api/<recurso>` → criar
  - `GET|PUT|DELETE /api/<recurso>/:id` → operações no item
