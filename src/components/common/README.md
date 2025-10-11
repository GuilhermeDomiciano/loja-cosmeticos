# 🔧 Componentes Comuns

Esta pasta contém componentes reutilizáveis usados em toda a aplicação.

## 🎯 Propósito

Componentes comuns são blocos de construção genéricos que podem ser usados em qualquer lugar da aplicação. Eles não contêm lógica de negócio específica.

## 📦 Componentes

### LoadingSpinner.tsx

**Propósito**: Indicador de carregamento com animação.

**Variantes**:
```tsx
// Spinner simples
<LoadingSpinner />

// Com texto
<LoadingSpinner text="Carregando..." />

// Tamanhos diferentes
<LoadingSpinner size="sm" />  // Pequeno
<LoadingSpinner size="md" />  // Médio (padrão)
<LoadingSpinner size="lg" />  // Grande
```

**LoadingPage**:
Versão full-screen para carregamento de páginas:
```tsx
<LoadingPage text="Carregando dados..." />
```

**Quando usar**:
- Durante fetching de dados
- Processamento assíncrono
- Transições de estado

---

### EmptyState.tsx

**Propósito**: Exibir estado vazio de forma elegante e informativa.

**Props**:
- `icon`: Ícone do lucide-react (opcional)
- `title`: Título principal (obrigatório)
- `description`: Descrição adicional (opcional)
- `action`: Botão de ação (opcional)

**Exemplo**:
```tsx
import { Package } from "lucide-react";

<EmptyState
  icon={Package}
  title="Nenhum produto cadastrado"
  description="Comece adicionando seu primeiro produto ao catálogo."
  action={{
    label: "Adicionar Produto",
    onClick: () => router.push("/produtos/novo")
  }}
/>
```

**Mobile-first**:
- Padding e tamanhos de fonte ajustam automaticamente
- Botão: full-width no mobile, auto no desktop

**Quando usar**:
- Listas vazias
- Resultados de busca sem resultados
- Features não configuradas ainda

---

### ErrorBoundary.tsx

**Propósito**: Capturar erros de renderização React e exibir fallback elegante.

**Uso**:
```tsx
// Envolver componentes que podem falhar
<ErrorBoundary>
  <ComponenteQuePodeFalhar />
</ErrorBoundary>

// Com fallback customizado
<ErrorBoundary fallback={<MeuErrorCustomizado />}>
  <ComponenteQuePodeFalhar />
</ErrorBoundary>
```

**Comportamento**:
- Captura erros apenas em **produção** (render errors)
- Em **desenvolvimento**: mostra stack trace
- Oferece botões para:
  - Recarregar página
  - Voltar ao Dashboard

**Quando usar**:
- Envolver rotas inteiras
- Componentes complexos que fazem transformações de dados
- Integrações externas

---

## 🎨 Padrões de Design

### Mobile-First

Todos os componentes seguem princípios mobile-first:

```tsx
// ✅ CORRETO
className="p-4 md:p-6 text-sm md:text-base"

// ❌ ERRADO
className="md:p-4 p-6 md:text-sm text-base"
```

### Composição

Componentes são simples e compostos:
```tsx
// ✅ BOM - Componentes pequenos e focados
<EmptyState icon={Icon} title="..." />

// ❌ EVITAR - Componentes muito complexos
<SuperEmptyStateComTudoDentro />
```

### Props Opcionais

Maximize flexibilidade com props opcionais:
```tsx
// Mínimo necessário
<EmptyState title="Vazio" />

// Completo
<EmptyState
  icon={Icon}
  title="Vazio"
  description="..."
  action={{ label: "...", onClick: () => {} }}
/>
```

---

## 🔧 Convenções

### Naming

- **PascalCase** para componentes: `LoadingSpinner`
- **camelCase** para props: `onClick`, `isLoading`
- Prefixo `on` para handlers: `onClick`, `onSubmit`

### Exports

```tsx
// Componente principal
export function LoadingSpinner() { }

// Variantes
export function LoadingPage() { }
```

### TypeScript

Sempre tipar props:
```tsx
interface ComponentProps {
  title: string;
  description?: string; // opcional
  onClick?: () => void; // opcional
}

export function Component({ title, description }: ComponentProps) {
  // ...
}
```

---

## 📐 Estrutura de Arquivo

```tsx
"use client"; // Se usar hooks

import { /* deps */ } from "...";
import { cn } from "@/lib/utils";

// Interfaces/Types
interface Props {
  // ...
}

// Componente principal
export function MeuComponente({ prop1, prop2 }: Props) {
  return (
    <div className="mobile-first md:desktop">
      {/* ... */}
    </div>
  );
}

// Variantes/helpers (se necessário)
export function MeuComponenteVariant() {
  // ...
}
```

---

## ⚠️ Importante

### DO ✅

- Componentes pequenos e focados
- Mobile-first sempre
- Props tipadas com TypeScript
- Composição sobre configuração
- Acessibilidade (aria-labels quando necessário)

### DON'T ❌

- Lógica de negócio em componentes comuns
- Dependências de rotas/features específicas
- Estilos desktop-first
- Props excessivas
- Side effects sem controle

---

## 🧪 Testes (TODO)

```tsx
// Exemplo de teste para LoadingSpinner
import { render } from "@testing-library/react";
import { LoadingSpinner } from "./LoadingSpinner";

test("renders with text", () => {
  const { getByText } = render(
    <LoadingSpinner text="Loading..." />
  );
  expect(getByText("Loading...")).toBeInTheDocument();
});
```

---

## 🎯 Próximos Componentes

- [ ] `ConfirmDialog` - Diálogo de confirmação reutilizável
- [ ] `InfoTooltip` - Tooltip informativo
- [ ] `StatusBadge` - Badge de status (sucesso, erro, warning)
- [ ] `DataTable` - Tabela reutilizável com paginação
- [ ] `SearchInput` - Input de busca com debounce
- [ ] `ImageUpload` - Upload de imagem com preview
