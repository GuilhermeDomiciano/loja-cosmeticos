import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

/**
 * Layout principal do dashboard
 * - Mobile: Header (top) + Content + MobileNav (bottom)
 * - Desktop: Sidebar (left) + Content
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - apenas desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50 md:border-r">
        <Sidebar />
      </aside>

      {/* Área principal */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* Header mobile com hambúrguer */}
        <Header />

        {/* Conteúdo principal */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>

        {/* Bottom Navigation - apenas mobile */}
        <MobileNav />
      </div>
    </div>
  );
}
