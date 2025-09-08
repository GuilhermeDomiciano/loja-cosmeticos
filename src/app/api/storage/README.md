# Recurso `storage`

- Operações server-side relacionadas a uploads/downloads no Supabase Storage.
- Recomendações:
  - Realizar uploads no servidor usando `SUPABASE_SERVICE_ROLE_KEY` (nunca no cliente).
  - Gravar metadados em `Arquivo` após upload.
