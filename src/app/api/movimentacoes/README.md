# Recurso `movimentacoes`

- Movimentação de estoque: `ENTRADA` ou `SAIDA` com `motivo`, `canal`, `quantidade`, `precoUnitario` e `total`.
- Pode gerar/associar `TransacaoFinanceira`.
- Operações típicas:
  - `GET /api/movimentacoes?organizacaoId=<id>&variacaoId=<id>`
  - `POST /api/movimentacoes`
  - `GET|PUT|DELETE /api/movimentacoes/:id`
