# 💾 Stores Zustand

Esta pasta contém os stores de estado global da aplicação usando Zustand.

## 🎯 Propósito

Stores gerenciam estado global da aplicação de forma simples e performática. Usamos **Zustand** por ser leve, sem boilerplate e com excelente integração com TypeScript.

## 📦 Stores Disponíveis

### authStore.ts

**Propósito**: Gerenciar estado de autenticação do usuário.

**Estado**:
```tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

**Uso**:
```tsx
import { useAuthStore } from "@/store/authStore";

function Component() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  
  // Ou selecionar apenas o necessário (otimização)
  const user = useAuthStore(state => state.user);
  const isAuth = useAuthStore(state => state.isAuthenticated);
}
```

**Ações**:
- `setUser(user)` - Define usuário autenticado
- `logout()` - Limpa estado de autenticação

---

### organizationStore.ts

**Propósito**: Gerenciar organização atual do usuário (multi-tenancy).

**Estado**:
```tsx
interface OrganizationState {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
}
```

**Características**:
- **Persistido** no localStorage (via `persist` middleware)
- Sobrevive a reloads da página
- Sincroniza entre tabs

**Uso**:
```tsx
import { useOrganizationStore } from "@/store/organizationStore";

function Component() {
  const currentOrg = useOrganizationStore(state => state.currentOrganization);
  const setOrg = useOrganizationStore(state => state.setCurrentOrganization);
  
  // organizacaoId é necessário em todas as requisições
  const orgId = currentOrg?.id;
}
```

---

### uiStore.ts

**Propósito**: Gerenciar estado da interface (sidebar, modals, etc).

**Estado**:
```tsx
interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}
```

**Uso**:
```tsx
import { useUIStore } from "@/store/uiStore";

function Sidebar() {
  const isOpen = useUIStore(state => state.sidebarOpen);
  const toggle = useUIStore(state => state.toggleSidebar);
  
  return (
    <aside className={isOpen ? "open" : "closed"}>
      <button onClick={toggle}>Toggle</button>
    </aside>
  );
}
```

---

## 🎨 Padrões Zustand

### Estrutura Básica

```tsx
import { create } from "zustand";

interface MyState {
  // Estado
  count: number;
  name: string;
  
  // Ações
  increment: () => void;
  setName: (name: string) => void;
  reset: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  // Estado inicial
  count: 0,
  name: "",
  
  // Ações
  increment: () => set((state) => ({ count: state.count + 1 })),
  setName: (name) => set({ name }),
  reset: () => set({ count: 0, name: "" }),
}));
```

### Com Persist Middleware

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      // Store definition
    }),
    {
      name: "my-storage-key", // nome no localStorage
    }
  )
);
```

### Com Immer Middleware (mutações)

```tsx
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useMyStore = create<MyState>()(
  immer((set) => ({
    items: [],
    addItem: (item) => set((state) => {
      // Mutação direta (Immer cuida da imutabilidade)
      state.items.push(item);
    }),
  }))
);
```

---

## 🔧 Uso Avançado

### Seletores (Otimização)

```tsx
// ❌ Re-render em qualquer mudança do store
function Component() {
  const { user, count, items } = useAuthStore();
}

// ✅ Re-render apenas quando 'user' muda
function Component() {
  const user = useAuthStore(state => state.user);
}

// ✅ Re-render apenas quando name OU email muda
function Component() {
  const { name, email } = useAuthStore(
    state => ({ name: state.user?.name, email: state.user?.email })
  );
}
```

### Seletores com Shallow Compare

```tsx
import { shallow } from "zustand/shallow";

function Component() {
  const { name, email } = useAuthStore(
    state => ({ name: state.user?.name, email: state.user?.email }),
    shallow // Compara por propriedades, não referência
  );
}
```

### Ações Assíncronas

```tsx
export const useMyStore = create<MyState>((set, get) => ({
  users: [],
  loading: false,
  
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      set({ users: data, loading: false });
    } catch (error) {
      set({ loading: false });
      // Handle error
    }
  },
}));
```

### Acessar Store Fora de Componentes

```tsx
// Pegar estado atual
const currentUser = useAuthStore.getState().user;

// Subscrever a mudanças
const unsubscribe = useAuthStore.subscribe(
  (state) => console.log("State changed:", state)
);

// Limpar subscription
unsubscribe();
```

---

## 📐 Quando Usar Store vs Props

### ✅ Use Store quando:

- Estado compartilhado por múltiplos componentes distantes
- Estado global da aplicação (auth, theme, i18n)
- Cache de dados
- UI state que persiste entre navegações

### ❌ Use Props quando:

- Estado local de componente
- Comunicação pai → filho direto
- Dados específicos de uma feature/rota
- Props drilling de apenas 1-2 níveis

---

## 🎯 Boas Práticas

### DO ✅

```tsx
// ✅ Interface tipada
interface MyState {
  count: number;
  increment: () => void;
}

// ✅ Ações nomeadas claramente
setUser: (user: User) => set({ user })

// ✅ Seletores para otimização
const user = useAuthStore(state => state.user);

// ✅ Reset functions
reset: () => set(initialState)

// ✅ Um store por domínio (auth, ui, products)
```

### DON'T ❌

```tsx
// ❌ Store gigante com tudo
interface GodStore {
  users: User[];
  products: Product[];
  orders: Order[];
  ui: UI;
  // ... 50 mais propriedades
}

// ❌ Lógica de negócio no store
addProduct: async (product) => {
  // Validações complexas
  // Transformações de dados
  // Requisições HTTP
  // Melhor: mova para services
}

// ❌ Usar store para tudo
const count = useStore(state => state.componentLocalCount);
// Use useState para estado local!

// ❌ Mutações diretas sem set
const store = useMyStore.getState();
store.count++; // ERRADO!
```

---

## 🧪 Testando Stores

```tsx
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "./authStore";

beforeEach(() => {
  // Reset store entre testes
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

test("setUser updates state", () => {
  const { result } = renderHook(() => useAuthStore());
  
  act(() => {
    result.current.setUser({
      id: "1",
      name: "John",
      email: "john@example.com"
    });
  });
  
  expect(result.current.user).not.toBeNull();
  expect(result.current.isAuthenticated).toBe(true);
});

test("logout clears state", () => {
  const { result } = renderHook(() => useAuthStore());
  
  act(() => {
    result.current.setUser({ id: "1", name: "John" });
    result.current.logout();
  });
  
  expect(result.current.user).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
});
```

---

## 🎯 Próximos Stores

- [ ] `cartStore` - Carrinho de compras (se implementar e-commerce)
- [ ] `notificationStore` - Notificações/toasts globais
- [ ] `filterStore` - Filtros persistentes de listagens
- [ ] `themeStore` - Tema claro/escuro (se implementar)

---

## 📚 Referências

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand vs Redux](https://docs.pmnd.rs/zustand/getting-started/comparison)
- [Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)
