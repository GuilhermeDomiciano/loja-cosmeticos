# Recurso `usuarios`

- Usuários pertencem a uma `organizacao` e possuem `email`, `nome`, `senha (hash)` e `papel`.
- Controller: `usuarioController` (camada `core/controllers`).
- Operações:
  - `GET /api/usuarios?organizacaoId=<id>`
  - `POST /api/usuarios`
  - Item em `[id]`: `GET|PUT|DELETE /api/usuarios/:id`
