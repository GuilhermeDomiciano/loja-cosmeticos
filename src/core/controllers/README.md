# `controllers`

- Focados em HTTP: parse de `Request`, validação com Zod e respostas `NextResponse`.
- Não contêm regras de negócio; delegam para `services`.
- Padrões de erro:
  - 400: entrada inválida.
  - 404: recurso não encontrado.
  - 500: erro inesperado.
