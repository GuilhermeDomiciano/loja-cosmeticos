# Contexto da pasta `src/app`

- Estrutura do App Router (Next.js 15):
  - `layout.tsx`: layout raiz da aplicação.
  - `globals.css`: estilos globais.
  - `page.tsx`: página inicial.
- `api/`: rotas HTTP (REST) que delegam à camada de `core`.
- Convenções de API:
  - Coleções: `GET` (listar), `POST` (criar).
  - Item (`[id]`): `GET` (buscar), `PUT` (atualizar), `DELETE` (remover).
