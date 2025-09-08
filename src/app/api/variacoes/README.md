# Recurso `variacoes`

- Variações de um produto: SKU, unidade (`UN`, `ML`, `G`, `KG`, `L`), preço/custo e estoque mínimo.
- Relacionam-se com `lotes` e `movimentacoes`.
- Operações típicas:
  - `GET /api/variacoes?organizacaoId=<id>&produtoId=<id>`
  - `POST /api/variacoes`
  - `GET|PUT|DELETE /api/variacoes/:id`
