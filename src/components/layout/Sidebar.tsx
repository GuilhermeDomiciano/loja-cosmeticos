"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Boxes,
  FolderKanban,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
  { href: "/produtos", label: "Produtos", icon: <Package className="h-5 w-5" /> },
  { href: "/estoque", label: "Estoque", icon: <Boxes className="h-5 w-5" /> },
  { href: "/kits", label: "Kits", icon: <FolderKanban className="h-5 w-5" /> },
  { href: "/venda-rapida", label: "Venda Rápida", icon: <ShoppingCart className="h-5 w-5" /> },
  { href: "/movimentacoes", label: "Movimentações", icon: <BarChart3 className="h-5 w-5" /> },
  { href: "/financeiro", label: "Financeiro", icon: <DollarSign className="h-5 w-5" /> },
  { href: "/relatorios", label: "Relatórios", icon: <BarChart3 className="h-5 w-5" /> },
];

/**
 * Sidebar para navegação desktop
 * Mobile: dentro do Sheet (Header.tsx)
 * Desktop: fixa à esquerda
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Logo/Título */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Loja Cosméticos</h2>
        <p className="text-sm text-muted-foreground">Gestão completa</p>
      </div>

      {/* Navegação */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2",
                  "transition-all duration-200",
                  "hover:bg-accent",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer com configurações e logout */}
      <div className="p-3 border-t space-y-1">
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </Link>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            // TODO: implementar logout
            window.location.href = "/signin";
          }}
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
}
