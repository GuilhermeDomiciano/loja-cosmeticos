# 🚀 PLANO DE IMPLEMENTAÇÃO - LOJA DE COSMÉTICOS

## 📋 Índice

1. [Estado Atual do Projeto](#estado-atual)
2. [Fase 0: Fundação](#fase-0-fundação)
3. [Fase 1: Autenticação e Autorização](#fase-1-autenticação-e-autorização)
4. [Fase 2: Gestão de Catálogo](#fase-2-gestão-de-catálogo)
5. [Fase 3: Gestão de Estoque](#fase-3-gestão-de-estoque)
6. [Fase 4: Kits de Produtos](#fase-4-kits-de-produtos)
7. [Fase 5: Financeiro](#fase-5-financeiro)
8. [Fase 6: Vendas e Movimentações](#fase-6-vendas-e-movimentações)
9. [Fase 7: Relatórios e Dashboard](#fase-7-relatórios-e-dashboard)
10. [Fase 8: Refinamentos e Otimizações](#fase-8-refinamentos-e-otimizações)
11. [Fase 9: Lançamento](#fase-9-lançamento)

---

## 🔍 Estado Atual do Projeto

### ✅ O que já está implementado:

- **Backend completo**:
  - ✅ Arquitetura em camadas (Controllers → Services → Repositories)
  - ✅ Todas as rotas de API REST funcionais
  - ✅ Schema Prisma completo com todas entidades
  - ✅ Validação com Zod em todos os modelos
  - ✅ Multi-tenancy por `organizacaoId`
  - ✅ Integração com Supabase para arquivos

- **Infraestrutura**:
  - ✅ Next.js 15 com App Router
  - ✅ TypeScript configurado
  - ✅ Tailwind CSS v4
  - ✅ Componentes base UI do shadcn/ui (button, input)
  - ✅ Providers configurados (React Query, Theme)

- **Documentação**:
  - ✅ AGENTS.md completo
  - ✅ WARP.md completo
  - ✅ READMEs em todas as pastas importantes

### ❌ O que falta implementar:

- **Frontend completo** (páginas e componentes)
- **Sistema de autenticação** (login, registro, proteção de rotas)
- **Interface de usuário** (todas as telas)
- **Testes** (unitários e de integração)
- **Migrações versionadas** do Prisma
- **Seeds** de dados iniciais
- **Deploy** e CI/CD

---

## 📦 Fase 0: Fundação

> **Objetivo**: Preparar ambiente e componentes base para desenvolvimento
> **Duração estimada**: 2-3 dias

### 0.1 - Configuração de Ambiente ✅ (JÁ FEITO)

- [x] Criar `.env.local` com variáveis necessárias
- [x] Configurar banco de dados PostgreSQL
- [x] Executar `npx prisma generate`
- [x] Executar `npx prisma db push`

### 0.2 - Sistema de Componentes UI

**Criar componentes base seguindo mobile-first:**

```bash
# Componentes shadcn/ui necessários
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add sheet
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add textarea
npx shadcn@latest add calendar
npx shadcn@latest add popover
```

**Componentes customizados mobile-first:**
- [ ] `src/components/layout/MobileNav.tsx` - Navegação mobile (bottom nav)
- [ ] `src/components/layout/Sidebar.tsx` - Sidebar desktop
- [ ] `src/components/layout/Header.tsx` - Header com menu hambúrguer
- [ ] `src/components/layout/Container.tsx` - Container responsivo
- [ ] `src/components/common/LoadingSpinner.tsx`
- [ ] `src/components/common/EmptyState.tsx`
- [ ] `src/components/common/ErrorBoundary.tsx`

### 0.3 - Utilities e Hooks

**Criar utilitários:**
- [ ] `src/lib/api.ts` - Cliente HTTP para consumir API
- [ ] `src/lib/utils.ts` - Funções auxiliares (formatadores, validators)
- [ ] `src/lib/constants.ts` - Constantes da aplicação

**Hooks customizados:**
- [ ] `src/hooks/useAuth.ts` - Hook de autenticação
- [ ] `src/hooks/useMediaQuery.ts` - Detecção de breakpoints
- [ ] `src/hooks/useLocalStorage.ts` - Persistência local
- [ ] `src/hooks/useDebounce.ts` - Debounce para busca

### 0.4 - Stores Zustand

**Criar stores de estado global:**
- [ ] `src/store/authStore.ts` - Estado de autenticação
- [ ] `src/store/organizationStore.ts` - Organização atual
- [ ] `src/store/uiStore.ts` - Estado da UI (sidebar, modals)

**Checklist de conclusão:**
- [ ] Todos os componentes base criados e testados no mobile
- [ ] Hooks funcionando corretamente
- [ ] Stores configurados e integrados

---

## 🔐 Fase 1: Autenticação e Autorização

> **Objetivo**: Sistema completo de login/registro e proteção de rotas
> **Duração estimada**: 4-5 dias
> **Dependências**: Fase 0

### 1.1 - Backend de Autenticação

**Melhorar rotas de autenticação:**
- [ ] `src/app/api/auth/login/route.ts` - Login com JWT
- [ ] `src/app/api/auth/signup/route.ts` - Registro de usuário/organização
- [ ] `src/app/api/auth/logout/route.ts` - Logout (limpar cookie)
- [ ] `src/app/api/auth/me/route.ts` - Obter usuário autenticado
- [ ] `src/app/api/auth/refresh/route.ts` - Refresh token

**Implementar no backend:**
- [ ] Geração de JWT com `jose` (access + refresh tokens)
- [ ] Middleware de autenticação mais robusto
- [ ] Validação de organização no middleware
- [ ] Rate limiting básico para login

### 1.2 - Páginas de Autenticação (Mobile-First)

**Criar páginas:**
- [ ] `src/app/(auth)/login/page.tsx` - Tela de login
  - Form com email/senha
  - Link para registro
  - Esqueci senha (placeholder)
  - Totalmente responsivo mobile-first
  
- [ ] `src/app/(auth)/signup/page.tsx` - Tela de registro
  - Form com nome, email, senha, nome da organização
  - Termos de uso (placeholder)
  - Link para login
  
- [ ] `src/app/(auth)/layout.tsx` - Layout para páginas de auth
  - Design limpo e mobile-first
  - Logo centralizado
  - Background responsivo

**Componentes de autenticação:**
- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/SignupForm.tsx`
- [ ] `src/components/auth/ProtectedRoute.tsx`

### 1.3 - Integração Frontend-Backend

**Implementar:**
- [ ] Context/Provider de autenticação
- [ ] Interceptor de API para adicionar token
- [ ] Redirect automático em 401
- [ ] Persistência de sessão (cookie httpOnly)
- [ ] Refresh token automático

**Checklist de conclusão:**
- [ ] Usuário consegue se registrar e criar organização
- [ ] Usuário consegue fazer login e recebe token
- [ ] Token é validado em todas as rotas protegidas
- [ ] Logout funciona corretamente
- [ ] Middleware protege rotas adequadamente
- [ ] Tudo funciona perfeitamente em mobile

---

## 📦 Fase 2: Gestão de Catálogo

> **Objetivo**: CRUD completo de categorias, produtos e variações
> **Duração estimada**: 5-7 dias
> **Dependências**: Fase 1

### 2.1 - Dashboard Principal

**Criar página inicial após login:**
- [ ] `src/app/(dashboard)/page.tsx` - Dashboard home
  - Cards com métricas principais
  - Resumo de estoque
  - Movimentações recentes
  - Layout mobile-first com grid responsivo

### 2.2 - Categorias

**Páginas:**
- [ ] `src/app/(dashboard)/categorias/page.tsx` - Listagem
  - Tabela responsiva (em mobile vira cards)
  - Busca/filtro
  - Botão "Nova Categoria"
  - Ações: editar, deletar
  
- [ ] `src/app/(dashboard)/categorias/nova/page.tsx` - Criar categoria
- [ ] `src/app/(dashboard)/categorias/[id]/editar/page.tsx` - Editar

**Componentes:**
- [ ] `src/components/categorias/CategoriaList.tsx`
- [ ] `src/components/categorias/CategoriaForm.tsx`
- [ ] `src/components/categorias/CategoriaCard.tsx` (mobile)
- [ ] `src/components/categorias/DeleteCategoriaDialog.tsx`

**Integração:**
- [ ] Hooks com React Query para CRUD
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Toast notifications

### 2.3 - Produtos

**Páginas:**
- [ ] `src/app/(dashboard)/produtos/page.tsx` - Listagem
  - Grid de cards com imagem (mobile-first)
  - Filtros por categoria
  - Busca
  - Status ativo/inativo
  
- [ ] `src/app/(dashboard)/produtos/novo/page.tsx` - Criar produto
  - Form multi-step (mobile-friendly)
  - Upload de imagem (Supabase)
  - Categoria, nome, descrição, SKU
  
- [ ] `src/app/(dashboard)/produtos/[id]/page.tsx` - Detalhes
  - Visualização completa
  - Lista de variações
  - Botão "Adicionar Variação"
  
- [ ] `src/app/(dashboard)/produtos/[id]/editar/page.tsx` - Editar

**Componentes:**
- [ ] `src/components/produtos/ProdutoGrid.tsx`
- [ ] `src/components/produtos/ProdutoCard.tsx` (mobile-first)
- [ ] `src/components/produtos/ProdutoForm.tsx`
- [ ] `src/components/produtos/ProdutoDetails.tsx`
- [ ] `src/components/produtos/ImageUpload.tsx`
- [ ] `src/components/produtos/DeleteProdutoDialog.tsx`

### 2.4 - Variações de Produto

**Páginas:**
- [ ] `src/app/(dashboard)/produtos/[id]/variacoes/nova/page.tsx`
- [ ] `src/app/(dashboard)/produtos/[id]/variacoes/[variacaoId]/editar/page.tsx`

**Componentes:**
- [ ] `src/components/variacoes/VariacaoList.tsx`
- [ ] `src/components/variacoes/VariacaoForm.tsx`
- [ ] `src/components/variacoes/VariacaoCard.tsx`
- [ ] `src/components/variacoes/UnidadeSelect.tsx` (UN, ML, G, KG, L)

**Checklist de conclusão:**
- [ ] CRUD completo de categorias funcional
- [ ] CRUD completo de produtos funcional
- [ ] CRUD completo de variações funcional
- [ ] Upload de imagens funcionando
- [ ] Filtros e buscas operacionais
- [ ] Interface 100% mobile-first e responsiva
- [ ] Validações client-side + server-side

---

## 📊 Fase 3: Gestão de Estoque

> **Objetivo**: Controle de lotes e visualização de estoque
> **Duração estimada**: 4-5 dias
> **Dependências**: Fase 2

### 3.1 - Lotes de Estoque

**Páginas:**
- [ ] `src/app/(dashboard)/estoque/page.tsx` - Visão geral
  - Lista de produtos com quantidade em estoque
  - Alertas de estoque mínimo (badges vermelhos)
  - Produtos perto do vencimento
  - Filtros por categoria/produto
  
- [ ] `src/app/(dashboard)/estoque/lotes/page.tsx` - Listagem de lotes
  - Tabela/cards com lotes
  - Filtro por produto/variação
  - Status: válido, perto do vencimento, vencido
  
- [ ] `src/app/(dashboard)/estoque/lotes/novo/page.tsx` - Criar lote
  - Seleção de variação
  - Quantidade
  - Data de validade
  - Código do lote (opcional)
  
- [ ] `src/app/(dashboard)/estoque/lotes/[id]/editar/page.tsx` - Editar lote

**Componentes:**
- [ ] `src/components/estoque/EstoqueOverview.tsx`
- [ ] `src/components/estoque/EstoqueByProduct.tsx`
- [ ] `src/components/estoque/LoteList.tsx`
- [ ] `src/components/estoque/LoteForm.tsx`
- [ ] `src/components/estoque/LoteCard.tsx`
- [ ] `src/components/estoque/EstoqueAlert.tsx` (alerta de estoque baixo)
- [ ] `src/components/estoque/ValididadeAlert.tsx` (alerta de vencimento)

### 3.2 - Relatórios de Estoque

**Componentes:**
- [ ] `src/components/estoque/EstoqueResumo.tsx` - Cards com totais
- [ ] `src/components/estoque/ProdutosBaixoEstoque.tsx`
- [ ] `src/components/estoque/ProdutosVencendo.tsx`

**Checklist de conclusão:**
- [ ] Visualização clara do estoque atual
- [ ] CRUD de lotes funcional
- [ ] Alertas de estoque mínimo visíveis
- [ ] Alertas de vencimento próximo
- [ ] Interface mobile-first

---

## 📦 Fase 4: Kits de Produtos

> **Objetivo**: Criação e gestão de kits vendáveis
> **Duração estimada**: 3-4 dias
> **Dependências**: Fase 2

### 4.1 - CRUD de Kits

**Páginas:**
- [ ] `src/app/(dashboard)/kits/page.tsx` - Listagem
  - Grid de cards com kits
  - Imagem, nome, preço
  - Status ativo/inativo
  
- [ ] `src/app/(dashboard)/kits/novo/page.tsx` - Criar kit
  - Informações básicas (nome, SKU, preço, imagem)
  - Seleção de variações e quantidades
  - Cálculo automático de custo baseado nos itens
  
- [ ] `src/app/(dashboard)/kits/[id]/page.tsx` - Detalhes do kit
  - Info completa
  - Lista de itens (variações + quantidades)
  - Margem de lucro
  
- [ ] `src/app/(dashboard)/kits/[id]/editar/page.tsx` - Editar kit

**Componentes:**
- [ ] `src/components/kits/KitGrid.tsx`
- [ ] `src/components/kits/KitCard.tsx`
- [ ] `src/components/kits/KitForm.tsx`
- [ ] `src/components/kits/KitItemsManager.tsx` - Gerenciar itens do kit
- [ ] `src/components/kits/AddKitItemDialog.tsx`
- [ ] `src/components/kits/KitItemList.tsx`
- [ ] `src/components/kits/KitCustoCalculator.tsx` - Cálculo de custo/margem

**Checklist de conclusão:**
- [ ] CRUD completo de kits
- [ ] Adicionar/remover itens do kit
- [ ] Cálculo automático de custo
- [ ] Visualização de margem de lucro
- [ ] Interface mobile-first

---

## 💰 Fase 5: Financeiro

> **Objetivo**: Gestão de contas a pagar e receber
> **Duração estimada**: 4-5 dias
> **Dependências**: Fase 3

### 5.1 - Transações Financeiras

**Páginas:**
- [ ] `src/app/(dashboard)/financeiro/page.tsx` - Visão geral
  - Cards: total a receber, total a pagar, saldo
  - Gráfico de fluxo de caixa
  - Vencimentos próximos (alerta)
  
- [ ] `src/app/(dashboard)/financeiro/a-receber/page.tsx` - Contas a receber
  - Lista de transações tipo RECEBER
  - Filtros: status, período, método pagamento
  - Ação: marcar como recebido
  
- [ ] `src/app/(dashboard)/financeiro/a-pagar/page.tsx` - Contas a pagar
  - Lista de transações tipo PAGAR
  - Filtros similares
  - Ação: marcar como pago
  
- [ ] `src/app/(dashboard)/financeiro/nova-transacao/page.tsx` - Nova transação
  - Tipo: pagar ou receber
  - Valor, descrição, data vencimento
  - Método de pagamento
  - Link com movimentação (opcional)
  
- [ ] `src/app/(dashboard)/financeiro/[id]/editar/page.tsx` - Editar transação

**Componentes:**
- [ ] `src/components/financeiro/FinanceiroOverview.tsx`
- [ ] `src/components/financeiro/FluxoCaixaChart.tsx` - Gráfico com recharts
- [ ] `src/components/financeiro/TransacaoList.tsx`
- [ ] `src/components/financeiro/TransacaoCard.tsx` (mobile)
- [ ] `src/components/financeiro/TransacaoForm.tsx`
- [ ] `src/components/financeiro/TransacaoFilters.tsx`
- [ ] `src/components/financeiro/MarcarPagoDialog.tsx`
- [ ] `src/components/financeiro/StatusBadge.tsx`
- [ ] `src/components/financeiro/VencimentosProximos.tsx`

### 5.2 - Relatórios Financeiros

**Componentes:**
- [ ] `src/components/financeiro/ResumoMensal.tsx`
- [ ] `src/components/financeiro/TransacoesPorMetodo.tsx`
- [ ] `src/components/financeiro/ExportTransacoes.tsx` - Exportar CSV

**Checklist de conclusão:**
- [ ] CRUD completo de transações
- [ ] Filtros e buscas funcionais
- [ ] Marcar como pago/recebido
- [ ] Visualização de fluxo de caixa
- [ ] Alertas de vencimento
- [ ] Interface mobile-first

---

## 🛒 Fase 6: Vendas e Movimentações

> **Objetivo**: Registrar vendas e movimentações de estoque
> **Duração estimada**: 5-6 dias
> **Dependências**: Fases 3, 4, 5

### 6.1 - Movimentações de Estoque

**Páginas:**
- [ ] `src/app/(dashboard)/movimentacoes/page.tsx` - Listagem
  - Lista de todas movimentações
  - Filtros: tipo (entrada/saída), motivo, período, canal
  - Cards mobile-friendly
  
- [ ] `src/app/(dashboard)/movimentacoes/nova/page.tsx` - Nova movimentação
  - Tipo: entrada ou saída
  - Motivo: compra, venda, ajuste, devolução, etc.
  - Seleção de variação
  - Quantidade, preço unitário (cálculo automático do total)
  - Canal de venda (se aplicável)
  - Lote (opcional)
  - Observações
  - Opção: criar transação financeira automática
  
- [ ] `src/app/(dashboard)/movimentacoes/[id]/page.tsx` - Detalhes

**Componentes:**
- [ ] `src/components/movimentacoes/MovimentacaoList.tsx`
- [ ] `src/components/movimentacoes/MovimentacaoCard.tsx`
- [ ] `src/components/movimentacoes/MovimentacaoForm.tsx`
- [ ] `src/components/movimentacoes/MovimentacaoFilters.tsx`
- [ ] `src/components/movimentacoes/TipoMovimentacaoSelect.tsx`
- [ ] `src/components/movimentacoes/MotivoSelect.tsx`
- [ ] `src/components/movimentacoes/CanalVendaSelect.tsx`

### 6.2 - Fluxo de Venda Rápida

**Criar fluxo otimizado para mobile:**
- [ ] `src/app/(dashboard)/venda-rapida/page.tsx` - PDV simplificado
  - Busca rápida de produto/kit
  - Adicionar ao carrinho
  - Finalizar venda em poucos toques
  - Gera movimentação + transação financeira automaticamente
  - Interface otimizada para mobile (uso em balcão)

**Componentes:**
- [ ] `src/components/venda/CarrinhoRapido.tsx`
- [ ] `src/components/venda/ProdutoBuscaRapida.tsx`
- [ ] `src/components/venda/FinalizarVendaDialog.tsx`
- [ ] `src/components/venda/ResumoVenda.tsx`

### 6.3 - Histórico e Auditoria

**Componentes:**
- [ ] `src/components/movimentacoes/HistoricoVariacao.tsx` - Histórico por produto
- [ ] `src/components/movimentacoes/MovimentacoesPorPeriodo.tsx`

**Checklist de conclusão:**
- [ ] Registrar movimentações de entrada/saída
- [ ] Vincular movimentação com transação financeira
- [ ] Fluxo de venda rápida funcional
- [ ] Histórico completo de movimentações
- [ ] Interface mobile-first (especialmente venda rápida)

---

## 📈 Fase 7: Relatórios e Dashboard

> **Objetivo**: Analytics e visualizações de dados
> **Duração estimada**: 4-5 dias
> **Dependências**: Todas as fases anteriores

### 7.1 - Dashboard Administrativo

**Melhorar dashboard principal:**
- [ ] `src/app/(dashboard)/page.tsx` - Dashboard completo
  - Métricas principais (cards): vendas do mês, lucro, produtos baixo estoque
  - Gráfico de vendas por período (recharts)
  - Top produtos vendidos
  - Movimentações recentes
  - Contas a vencer hoje/esta semana
  - Layout mobile-first com grid responsivo

**Componentes:**
- [ ] `src/components/dashboard/MetricCard.tsx`
- [ ] `src/components/dashboard/VendasChart.tsx`
- [ ] `src/components/dashboard/TopProdutos.tsx`
- [ ] `src/components/dashboard/UltimasMovimentacoes.tsx`
- [ ] `src/components/dashboard/ContasVencendo.tsx`
- [ ] `src/components/dashboard/EstoqueBaixo.tsx`

### 7.2 - Relatórios Específicos

**Páginas:**
- [ ] `src/app/(dashboard)/relatorios/page.tsx` - Hub de relatórios
  - Links para diferentes relatórios
  - Exportações
  
- [ ] `src/app/(dashboard)/relatorios/vendas/page.tsx` - Relatório de vendas
  - Filtros por período, canal, produto
  - Gráficos e tabelas
  - Total de vendas, ticket médio
  
- [ ] `src/app/(dashboard)/relatorios/estoque/page.tsx` - Relatório de estoque
  - Valor total em estoque
  - Produtos por categoria
  - Produtos críticos
  
- [ ] `src/app/(dashboard)/relatorios/financeiro/page.tsx` - Relatório financeiro
  - Receitas x Despesas
  - Lucro líquido
  - Previsão de caixa

**Componentes:**
- [ ] `src/components/relatorios/DateRangePicker.tsx`
- [ ] `src/components/relatorios/ExportButton.tsx`
- [ ] `src/components/relatorios/ReportCard.tsx`
- [ ] `src/components/relatorios/ReportChart.tsx`

### 7.3 - Exportações

**Implementar:**
- [ ] Exportar relatórios em CSV
- [ ] Exportar relatórios em PDF (react-pdf ou similar)
- [ ] Botões de exportação em todas as listas

**Checklist de conclusão:**
- [ ] Dashboard completo e informativo
- [ ] Relatórios de vendas, estoque e financeiro
- [ ] Gráficos funcionais (recharts)
- [ ] Exportações CSV/PDF
- [ ] Interface mobile-first

---

## ✨ Fase 8: Refinamentos e Otimizações

> **Objetivo**: Melhorar UX, performance e adicionar features extras
> **Duração estimada**: 5-7 dias
> **Dependências**: Todas as fases anteriores

### 8.1 - Melhorias de UX

**Implementar:**
- [ ] Loading skeletons em todas as listas
- [ ] Animações suaves (framer-motion ou Tailwind animate)
- [ ] Feedback visual para todas as ações
- [ ] Empty states com ilustrações
- [ ] Error states amigáveis
- [ ] Confirmações para ações destrutivas
- [ ] Breadcrumbs para navegação
- [ ] Atalhos de teclado (desktop)
- [ ] Pull-to-refresh (mobile)
- [ ] Infinite scroll onde aplicável

### 8.2 - Performance

**Otimizar:**
- [ ] Implementar paginação no backend onde necessário
- [ ] Lazy loading de componentes pesados
- [ ] Otimizar imagens (next/image)
- [ ] Cache agressivo com React Query
- [ ] Debounce em buscas
- [ ] Memoização de componentes caros
- [ ] Code splitting adequado
- [ ] Análise com Lighthouse (mobile + desktop)

### 8.3 - Acessibilidade

**Garantir:**
- [ ] Navegação por teclado funcional
- [ ] Labels adequados em formulários
- [ ] Contraste adequado (WCAG AA)
- [ ] Aria labels onde necessário
- [ ] Focus visible em elementos interativos
- [ ] Textos alternativos em imagens
- [ ] Testes com leitor de tela básico

### 8.4 - Features Extras

**Implementar se houver tempo:**
- [ ] Modo escuro (já tem next-themes)
- [ ] Notificações push (web push)
- [ ] Favoritos/atalhos rápidos
- [ ] Histórico de ações do usuário
- [ ] Tour guiado para novos usuários
- [ ] Suporte multi-idioma (i18n)
- [ ] PWA (Progressive Web App)
  - [ ] Manifest.json
  - [ ] Service Worker
  - [ ] Funcionar offline (básico)

### 8.5 - Gestão de Usuários e Organizações

**Páginas administrativas:**
- [ ] `src/app/(dashboard)/configuracoes/page.tsx` - Configurações
  - Perfil do usuário
  - Alterar senha
  - Dados da organização
  
- [ ] `src/app/(dashboard)/usuarios/page.tsx` - Gestão de usuários
  - Listar usuários da organização
  - Adicionar novo usuário
  - Editar permissões (se implementar roles)
  - Desativar usuário

**Componentes:**
- [ ] `src/components/configuracoes/PerfilForm.tsx`
- [ ] `src/components/configuracoes/OrganizacaoForm.tsx`
- [ ] `src/components/usuarios/UsuarioList.tsx`
- [ ] `src/components/usuarios/UsuarioForm.tsx`

**Checklist de conclusão:**
- [ ] UX refinada e consistente
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Acessibilidade básica garantida
- [ ] Features extras implementadas
- [ ] Configurações e gestão de usuários funcionais

---

## 🧪 Fase 9: Testes e Qualidade

> **Objetivo**: Garantir qualidade e estabilidade do código
> **Duração estimada**: 3-5 dias
> **Dependências**: Fase 8

### 9.1 - Configuração de Testes

**Setup:**
- [ ] Instalar Vitest (ou Jest)
- [ ] Instalar React Testing Library
- [ ] Configurar MSW (Mock Service Worker) para APIs
- [ ] Configurar Playwright para E2E (opcional)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitejs/plugin-react jsdom
npm install -D msw
```

### 9.2 - Testes Unitários

**Testar:**
- [ ] Services principais (`produtoService`, `usuarioService`, etc.)
- [ ] Repositories (com Prisma mock)
- [ ] Hooks customizados
- [ ] Utilities (formatadores, validadores)
- [ ] Stores Zustand
- [ ] Cobertura mínima: 60%

### 9.3 - Testes de Integração

**Testar:**
- [ ] Fluxo completo de autenticação
- [ ] CRUD de produtos (API + DB)
- [ ] Criação de movimentação + transação
- [ ] Criação de kit com itens

### 9.4 - Testes E2E (Opcional mas recomendado)

**Testar fluxos críticos:**
- [ ] Login → Criar produto → Adicionar variação
- [ ] Login → Registrar venda → Verificar estoque
- [ ] Login → Criar kit → Vender kit

### 9.5 - Qualidade de Código

**Implementar:**
- [ ] ESLint configurado corretamente
- [ ] Prettier para formatação consistente
- [ ] Husky + lint-staged (pre-commit hooks)
- [ ] Conventional commits
- [ ] Code review checklist

**Checklist de conclusão:**
- [ ] Testes unitários implementados
- [ ] Testes de integração nos fluxos principais
- [ ] Cobertura de código satisfatória
- [ ] Linting sem erros
- [ ] Code quality tools configurados

---

## 🚀 Fase 10: Deploy e Lançamento

> **Objetivo**: Colocar aplicação em produção
> **Duração estimada**: 2-3 dias
> **Dependências**: Todas as fases anteriores

### 10.1 - Preparação para Deploy

**Configurar:**
- [ ] Variáveis de ambiente de produção
- [ ] Banco de dados PostgreSQL em produção (Supabase, Neon, Railway, etc.)
- [ ] Bucket Supabase em produção
- [ ] Migrações do Prisma

```bash
# Gerar migrações a partir do schema atual
npx prisma migrate dev --name initial

# Em produção, aplicar migrações
npx prisma migrate deploy
```

### 10.2 - Seeds de Dados Iniciais

**Criar seed script:**
- [ ] `prisma/seed.ts` - Script de seed
  - Organização demo (opcional)
  - Categorias padrão (Maquiagem, Skincare, Perfumes, etc.)
  - Unidades padrão (já são enums)

```bash
# Adicionar ao package.json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}

# Rodar seed
npx prisma db seed
```

### 10.3 - Deploy na Vercel

**Passos:**
1. [ ] Criar conta na Vercel (se não tiver)
2. [ ] Conectar repositório GitHub
3. [ ] Configurar variáveis de ambiente:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET` (para geração de tokens)
4. [ ] Deploy automático
5. [ ] Verificar build bem-sucedido
6. [ ] Testar aplicação em produção

**Alternativas de deploy:**
- [ ] Railway (mais simples, inclui DB)
- [ ] Render
- [ ] Fly.io
- [ ] AWS (mais complexo)

### 10.4 - CI/CD

**Configurar GitHub Actions:**
- [ ] `.github/workflows/ci.yml` - Pipeline de CI
  - Rodar lint
  - Rodar testes
  - Build da aplicação
  - Deploy automático (opcional)

```yaml
# Exemplo básico
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 10.5 - Monitoramento

**Configurar:**
- [ ] Sentry para error tracking (opcional)
- [ ] Vercel Analytics (gratuito)
- [ ] Google Analytics (opcional)
- [ ] Logs estruturados (winston ou pino)

### 10.6 - Documentação Final

**Criar documentação de usuário:**
- [ ] `docs/USUARIO.md` - Manual do usuário
  - Como fazer login
  - Como cadastrar produtos
  - Como registrar vendas
  - Como gerar relatórios
  
- [ ] `docs/DEPLOY.md` - Guia de deploy
  - Como fazer deploy
  - Variáveis de ambiente necessárias
  - Troubleshooting

### 10.7 - Launch Checklist

**Antes do lançamento:**
- [ ] Todas as funcionalidades core testadas
- [ ] Testes em múltiplos dispositivos mobile
- [ ] Performance otimizada (Lighthouse)
- [ ] SEO básico configurado (metadata)
- [ ] Favicon e manifest.json
- [ ] Página de erro 404 customizada
- [ ] Página de erro 500 customizada
- [ ] Terms of Service e Privacy Policy (se aplicável)
- [ ] Backup do banco de dados configurado
- [ ] Monitoramento configurado
- [ ] Domínio personalizado configurado (opcional)

**Checklist de conclusão:**
- [ ] Aplicação em produção e funcionando
- [ ] CI/CD configurado
- [ ] Monitoramento ativo
- [ ] Documentação completa
- [ ] Usuários podem usar o sistema

---

## 📊 Cronograma Estimado

| Fase | Duração | Entregas Principais |
|------|---------|---------------------|
| **Fase 0** | 2-3 dias | Componentes base, hooks, stores |
| **Fase 1** | 4-5 dias | Autenticação completa |
| **Fase 2** | 5-7 dias | Catálogo (categorias, produtos, variações) |
| **Fase 3** | 4-5 dias | Gestão de estoque e lotes |
| **Fase 4** | 3-4 dias | Kits de produtos |
| **Fase 5** | 4-5 dias | Financeiro completo |
| **Fase 6** | 5-6 dias | Movimentações e vendas |
| **Fase 7** | 4-5 dias | Dashboard e relatórios |
| **Fase 8** | 5-7 dias | Refinamentos, UX, features extras |
| **Fase 9** | 3-5 dias | Testes e qualidade |
| **Fase 10** | 2-3 dias | Deploy e lançamento |
| **TOTAL** | **41-55 dias** | **Aplicação completa em produção** |

**Estimativa realista**: 6-8 semanas de desenvolvimento full-time
**Estimativa part-time**: 3-4 meses

---

## 🎯 Priorização (MoSCoW)

### Must Have (MVP)
- ✅ Autenticação
- ✅ Produtos e Variações
- ✅ Estoque básico
- ✅ Movimentações (entrada/saída)
- ✅ Venda simples
- ✅ Dashboard básico

### Should Have (V1.0)
- ✅ Kits de produtos
- ✅ Financeiro (contas a pagar/receber)
- ✅ Relatórios
- ✅ Gestão de usuários
- ✅ Mobile-first UI

### Could Have (V1.1+)
- Modo escuro
- PWA
- Notificações
- Exportações avançadas
- Multi-idioma

### Won't Have (Futuro)
- App mobile nativo
- Integração com marketplaces
- IA para previsão de demanda
- Sistema de CRM avançado

---

## 📝 Notas Importantes

### Desenvolvimento Mobile-First
**LEMBRE-SE:** Toda interface deve ser desenvolvida pensando PRIMEIRO em mobile:
- Design no mobile primeiro
- Classes base Tailwind = mobile
- Breakpoints (`md:`, `lg:`) = ajustes para telas maiores
- Botões grandes (min 44x44px)
- Navegação mobile-friendly
- Testar SEMPRE em mobile primeiro

### Stack Tecnológico
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: Supabase
- **UI**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand + React Query
- **Forms**: react-hook-form + Zod
- **Charts**: Recharts
- **Deploy**: Vercel (recomendado)

### Comandos Úteis Durante Desenvolvimento

```bash
# Desenvolvimento
npm run dev

# Prisma
npx prisma studio                    # Visualizar/editar dados
npx prisma generate                  # Gerar client
npx prisma db push                   # Sincronizar schema (dev)
npx prisma migrate dev               # Criar migração
npx prisma migrate deploy            # Aplicar em prod

# Testes
npm run test                         # Rodar testes
npm run test:watch                   # Watch mode
npm run test:coverage               # Cobertura

# Build
npm run build                        # Build produção
npm start                            # Rodar build local

# Lint
npm run lint                         # ESLint
npm run lint:fix                     # Fix automático
```

---

## 🆘 Troubleshooting Comum

### Prisma
- **Erro ao gerar client**: `npx prisma generate`
- **Schema dessinronizado**: `npx prisma db push` (dev) ou `npx prisma migrate dev` (versionado)
- **Prisma Client não encontrado**: Deletar `node_modules/.prisma` e rodar `npm install`

### Supabase
- **Erro de CORS**: Verificar configurações do bucket
- **Upload falha**: Verificar `SUPABASE_SERVICE_ROLE_KEY` está correto e é server-side only

### Next.js
- **Hydration error**: Verificar diferenças entre server e client render
- **Module not found**: Verificar paths no `tsconfig.json`
- **Route não funciona**: Verificar nomenclatura de pastas e arquivos

---

## ✅ Checklist Geral de Conclusão

Marque quando cada item estiver 100% completo:

- [ ] **Fase 0**: Fundação completa
- [ ] **Fase 1**: Autenticação funcionando
- [ ] **Fase 2**: Catálogo completo
- [ ] **Fase 3**: Estoque funcional
- [ ] **Fase 4**: Kits implementados
- [ ] **Fase 5**: Financeiro operacional
- [ ] **Fase 6**: Vendas e movimentações
- [ ] **Fase 7**: Relatórios e dashboard
- [ ] **Fase 8**: Refinamentos finalizados
- [ ] **Fase 9**: Testes implementados
- [ ] **Fase 10**: Deploy em produção

**Aplicação 100% completa quando todos os itens acima estiverem marcados!** 🎉

---

## 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Tailwind](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)

---

**Última atualização**: 2025-10-11
**Versão do plano**: 1.0
