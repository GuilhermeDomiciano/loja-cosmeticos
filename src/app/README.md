# Contexto da pasta `src/app`

- Estrutura do App Router (Next.js 15):
  - `layout.tsx`: layout raiz da aplicação.
  - `globals.css`: estilos globais.
  - `page.tsx`: página inicial.
- `api/`: rotas HTTP (REST) que delegam à camada de `core`.
- Convenções de API:
  - Coleções: `GET` (listar), `POST` (criar).
  - Item (`[id]`): `GET` (buscar), `PUT` (atualizar), `DELETE` (remover).

## ⚠️ IMPORTANTE: MOBILE-FIRST

**Todas as páginas e componentes visuais devem seguir abordagem mobile-first:**
- Desenvolva PRIMEIRO para telas mobile (smartphones)
- Use classes base do Tailwind para mobile
- Adicione breakpoints (`md:`, `lg:`) apenas para ajustes em telas maiores
- Garanta que botões e áreas de toque tenham no mínimo 44x44px
- Teste sempre em dispositivo mobile ou emulador antes de considerar concluído
