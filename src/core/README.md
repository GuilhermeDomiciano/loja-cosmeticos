# Contexto da pasta `src/core`

- Núcleo de domínio da aplicação, livre de Next.js.
- Padrão em camadas:
  - `controllers`: interface HTTP (usa NextResponse), valida entrada e chama serviços.
  - `services`: regras de negócio e orquestração.
  - `repositories`: acesso a dados com Prisma.
  - `models`: schemas Zod e tipos de domínio.
- Objetivo: permitir reuso e testes isolados do domínio.
