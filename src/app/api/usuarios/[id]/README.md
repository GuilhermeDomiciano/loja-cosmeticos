# Pasta dinâmica `[id]`

- Representa operações de item único (por `id`) para o recurso `usuarios`.
- Métodos esperados no `route.ts`:
  - `GET`: detalhes do usuário.
  - `PUT`: atualização parcial/total conforme `usuarioUpdateSchema`.
  - `DELETE`: remoção lógica/física conforme regra de negócio.
