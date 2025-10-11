# 🪝 Hooks Customizados

Esta pasta contém hooks React customizados reutilizáveis.

## 🎯 Propósito

Hooks encapsulam lógica reutilizável e stateful que pode ser compartilhada entre componentes. Eles seguem as regras dos Hooks do React.

## 📦 Hooks Disponíveis

### useAuth.ts

**Propósito**: Acesso centralizado ao estado de autenticação.

**Retorna**:
```tsx
{
  user: User | null;
  isAuthenticated: boolean;
  organizationId: string | undefined;
  organization: Organization | null;
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  logout: () => void;
}
```

**Uso**:
```tsx
function MeuComponente() {
  const { user, isAuthenticated, organizationId } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Olá, {user?.nome}</div>;
}
```

**Integração**:
- Conecta `authStore` + `organizationStore`
- Fornece interface unificada
- Será expandido na Fase 1 com lógica de verificação

---

### useMediaQuery.ts

**Propósito**: Detectar breakpoints e tamanhos de tela.

**Hook base**:
```tsx
const isLarge = useMediaQuery("(min-width: 1024px)");
```

**Helpers pré-configurados**:
```tsx
const isSmall = useIsSmall();    // >= 640px
const isMedium = useIsMedium();  // >= 768px
const isLarge = useIsLarge();    // >= 1024px
const isXLarge = useIsXLarge();  // >= 1280px
const isMobile = useIsMobile();  // < 768px
```

**Exemplo**:
```tsx
function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

**⚠️ SSR**: Retorna `false` durante SSR para evitar hydration mismatch.

---

### useLocalStorage.ts

**Propósito**: Persistir estado no localStorage com sincronização automática.

**Assinatura**:
```tsx
const [value, setValue] = useLocalStorage<T>(key: string, initialValue: T);
```

**Exemplo**:
```tsx
function PreferenceComponent() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Tema: {theme}
    </button>
  );
}
```

**Características**:
- Tipagem TypeScript genérica
- Serialização/deserialização automática (JSON)
- Error handling integrado
- Sincroniza entre tabs/windows

---

### useDebounce.ts

**Propósito**: Debounce de valores para otimizar buscas e requisições.

**Assinatura**:
```tsx
const debouncedValue = useDebounce<T>(value: T, delay?: number);
```

**Exemplo**:
```tsx
function SearchComponent() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  useEffect(() => {
    if (debouncedSearch) {
      // Fazer busca apenas após 500ms de inatividade
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);
  
  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

**Delay padrão**: 500ms

---

## 🎨 Padrões e Convenções

### Naming

- Prefixo `use`: `useAuth`, `useDebounce`
- camelCase: `useMediaQuery`, não `use-media-query`
- Descritivo: Nome deve indicar o que faz

### Estrutura

```tsx
"use client"; // Sempre necessário para hooks

import { useState, useEffect } from "react";

export function useMyHook(param: string) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return state; // ou { value1, value2, action }
}
```

### Retornos

**Valor único**:
```tsx
const value = useMyHook();
```

**Tuple (como useState)**:
```tsx
const [value, setValue] = useMyHook();
```

**Objeto (múltiplos valores)**:
```tsx
const { value, loading, error, refetch } = useMyHook();
```

---

## 🔧 Boas Práticas

### DO ✅

```tsx
// ✅ Hooks no top-level
function Component() {
  const value = useHook();
  // ...
}

// ✅ Dependências corretas
useEffect(() => {
  doSomething(value);
}, [value]); // value nas dependências

// ✅ Tipagem TypeScript
export function useHook<T>(initial: T): T {
  // ...
}

// ✅ Custom hooks para lógica reutilizável
function useFormValidation() {
  // lógica complexa de validação
}
```

### DON'T ❌

```tsx
// ❌ Hooks dentro de condições
if (condition) {
  const value = useHook(); // ERRADO!
}

// ❌ Hooks dentro de loops
for (let i = 0; i < 10; i++) {
  useHook(); // ERRADO!
}

// ❌ Dependências faltando
useEffect(() => {
  doSomething(value);
}, []); // value deveria estar aqui!

// ❌ Lógica muito específica
function useOrdersFromDatabase() {
  // Muito específico, não reutilizável
}
```

---

## 📐 Quando Criar um Hook

### ✅ Criar hook quando:

- Lógica stateful é usada em múltiplos componentes
- Combina múltiplos hooks React
- Encapsula lógica complexa
- Precisa de cleanup (useEffect)
- Gerencia subscriptions/listeners

### ❌ Não criar hook quando:

- Função pura simples (use utils)
- Usado apenas uma vez
- Não usa nenhum hook React
- Apenas transforma dados (use função normal)

---

## 🎯 Próximos Hooks

- [ ] `useOnClickOutside` - Detectar cliques fora de elemento
- [ ] `useIntersectionObserver` - Lazy loading/infinite scroll
- [ ] `usePrevious` - Acessar valor anterior de state
- [ ] `useToggle` - Toggle booleano com função
- [ ] `useAsync` - Gerenciar estados async (loading, error, data)
- [ ] `useForm` - Alternativa ao react-hook-form para casos simples
- [ ] `useKeyPress` - Detectar teclas pressionadas
- [ ] `useWindowSize` - Tamanho da janela reativo

---

## 🧪 Testando Hooks

```tsx
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

test("debounces value", async () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 100),
    { initialProps: { value: "initial" } }
  );
  
  expect(result.current).toBe("initial");
  
  rerender({ value: "updated" });
  expect(result.current).toBe("initial"); // Ainda não mudou
  
  await act(() => new Promise(resolve => setTimeout(resolve, 150)));
  expect(result.current).toBe("updated"); // Mudou após delay
});
```

---

## 📚 Referências

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
- [useHooks.com](https://usehooks.com/) - Coleção de hooks
