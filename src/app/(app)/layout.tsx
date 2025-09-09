export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r p-4">
        <nav className="space-y-2 text-sm">
          <a href="/dashboard" className="block hover:underline">Dashboard</a>
          <a href="/categorias" className="block hover:underline">Categorias</a>
          <a href="/produtos" className="block hover:underline">Produtos</a>
          <a href="/variacoes" className="block hover:underline">Variações</a>
          <a href="/lotes" className="block hover:underline">Lotes</a>
          <a href="/movimentacoes" className="block hover:underline">Movimentações</a>
          <a href="/kits" className="block hover:underline">Kits</a>
          <a href="/itens-kit" className="block hover:underline">Itens do Kit</a>
          <a href="/transacoes" className="block hover:underline">Transações</a>
          <a href="/usuarios" className="block hover:underline">Usuários</a>
          <a href="/organizacoes" className="block hover:underline">Organizações</a>
          <a href="/api/auth/logout" className="block text-red-600 hover:underline">Sair</a>
        </nav>
      </aside>
      <main className="p-4">{children}</main>
    </div>
  );
}

