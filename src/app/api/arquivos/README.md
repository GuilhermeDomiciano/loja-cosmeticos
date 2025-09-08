# Recurso `arquivos`

- Representa metadados de arquivos armazenados no Supabase (bucket).
- Vínculo com uma entidade (`entidade`, `entidadeId`) e URL/caminho do arquivo.
- Operações típicas:
  - `GET /api/arquivos?organizacaoId=<id>`: lista por organização/entidade.
  - `POST /api/arquivos`: registra metadados após upload server-side.
  - `GET|DELETE /api/arquivos/:id`: obtém/remove registro.
