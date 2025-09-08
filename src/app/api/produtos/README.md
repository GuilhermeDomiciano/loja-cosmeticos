# Recurso `produtos`

- Item do catálogo; pode possuir múltiplas `variacoes`.
- Campos: `nome`, `descricao?`, `sku?`, `ativo`, `imagemUrl?`, `categoriaId?`, `organizacaoId`.
- Operações típicas:
  - `GET /api/produtos?organizacaoId=<id>&categoriaId=<id>`
  - `POST /api/produtos`
  - `GET|PUT|DELETE /api/produtos/:id`
