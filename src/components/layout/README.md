# 📐 Componentes de Layout

Esta pasta contém os componentes de layout da aplicação, responsáveis pela estrutura e navegação.

## 🎯 Propósito

Componentes de layout definem a estrutura visual da aplicação e fornecem navegação consistente em todas as páginas. **Todos seguem abordagem mobile-first.**

## 📦 Componentes

### Container.tsx
**Propósito**: Wrapper responsivo com padding e largura máxima controlados.

**Quando usar**:
- Envolver conteúdo de páginas
- Criar espaçamento consistente

**Exemplo**:
```tsx
<Container>
  <h1>Título da Página</h1>
  <p>Conteúdo...</p>
</Container>
```

**Mobile-first**:
- Mobile: `p-4` (16px)
- Tablet: `md:p-6` (24px)
- Desktop: `lg:p-8` (32px)

---

### MobileNav.tsx
**Propósito**: Navegação inferior (bottom navigation) para dispositivos móveis.

**Comportamento**:
- Visível: Mobile e Tablet (até `md`)
- Oculto: Desktop (`md:hidden`)
- Fixo na parte inferior da tela
- 5 itens principais de navegação

**Características**:
- Ícones grandes (mín. 44x44px) - touch-friendly
- Feedback visual ao tocar (`active:scale-95`)
- Indicador de rota ativa
- Altura: 64px (16 tailwind units)

**Customização**:
Edite o array `navItems` para modificar os links:
```tsx
const navItems: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: <Home /> },
  // ...
];
```

---

### Sidebar.tsx
**Propósito**: Navegação lateral para desktop.

**Comportamento**:
- Mobile: Dentro de `Sheet` (via Header)
- Desktop: Fixa à esquerda (ver layout da aplicação)

**Estrutura**:
1. **Header**: Logo + Título
2. **Navegação**: ScrollArea com links
3. **Footer**: Configurações + Logout

**Características**:
- Links completos com ícones
- Indicador de rota ativa
- Scroll interno para muitos itens
- Logout integrado

**Customização**:
Edite o array `navItems`:
```tsx
const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <Home /> },
  // ...
];
```

---

### Header.tsx
**Propósito**: Header mobile com menu hambúrguer.

**Comportamento**:
- Visível: Apenas mobile (até `md`)
- Oculto: Desktop (`md:hidden`)
- Sticky no topo

**Características**:
- Menu hambúrguer abre Sidebar em Sheet
- Título da página/seção
- Altura: 64px

---

## 🎨 Padrões de Design

### Mobile-First
**TODOS** os componentes são desenvolvidos mobile-first:
1. Estilos base = Mobile
2. Breakpoints (`md:`, `lg:`) = Ajustes para telas maiores

### Navegação Dual
- **Mobile**: Bottom Navigation (MobileNav)
- **Desktop**: Sidebar fixa

### Áreas de Toque
- Mínimo: 44x44px
- Implementado em todos os botões/links

### Feedback Visual
- Hover states
- Active states (`active:scale-95`)
- Transições suaves

---

## 🏗️ Arquitetura

```
Layout da Aplicação:
┌─────────────────────────────────────┐
│  Header (mobile only)               │
├──────────┬──────────────────────────┤
│ Sidebar  │  Main Content            │
│ (desktop)│  (Container)             │
│          │                          │
│          │                          │
├──────────┴──────────────────────────┤
│  MobileNav (mobile only)            │
└─────────────────────────────────────┘
```

---

## 🔧 Como Usar

### Em uma página do dashboard:
```tsx
import { Container } from "@/components/layout/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";

export default function MinhaPage() {
  return (
    <>
      <Header title="Minha Página" />
      <Container>
        <h1>Conteúdo</h1>
        {/* ... */}
      </Container>
      <MobileNav />
    </>
  );
}
```

### Layout root com Sidebar:
```tsx
// app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixa no desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </aside>
      
      {/* Conteúdo principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

---

## ⚠️ Importante

1. **Sempre teste em mobile primeiro**
2. **Não adicione estilos desktop sem mobile**
3. **Mantenha áreas de toque ≥ 44x44px**
4. **Use classes base para mobile, breakpoints para desktop**

---

## 🎯 Próximas Melhorias

- [ ] Breadcrumbs component
- [ ] PageHeader component (reutilizável)
- [ ] Layout com sidebar colapsável (desktop)
- [ ] Animações de transição entre rotas
