// app/(app)/layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r p-4">
        <nav className="space-y-2 text-sm">
          <a href="/(app)" className="block hover:underline">Dashboard</a>
          <a href="/(app)/categorias" className="block hover:underline">Categorias</a>
          <a href="/(app)/produtos" className="block hover:underline">Produtos</a>
          <a href="/(app)/variacoes" className="block hover:underline">Variações</a>
          <a href="/(app)/lotes" className="block hover:underline">Lotes</a>
          <a href="/(app)/movimentacoes" className="block hover:underline">Movimentações</a>
          <a href="/(app)/kits" className="block hover:underline">Kits</a>
          <a href="/(app)/itens-kit" className="block hover:underline">Itens do Kit</a>
          <a href="/(app)/transacoes" className="block hover:underline">Transações</a>
          <a href="/(app)/usuarios" className="block hover:underline">Usuários</a>
          <a href="/(app)/organizacoes" className="block hover:underline">Organizações</a>
        </nav>
      </aside>
      <main className="p-4">{children}</main>
    </div>
  );
}
