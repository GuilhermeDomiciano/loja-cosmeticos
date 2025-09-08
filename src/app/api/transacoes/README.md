# Recurso `transacoes`

- Registros financeiros `a pagar/receber` com `status` e `metodo`.
- Podem se relacionar a uma `movimentacao`.
- Operações típicas:
  - `GET /api/transacoes?organizacaoId=<id>&status=<status>`
  - `POST /api/transacoes`
  - `GET|PUT|DELETE /api/transacoes/:id`
