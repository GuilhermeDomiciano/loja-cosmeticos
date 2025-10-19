"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Boxes, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Início",
    icon: <Home className="h-5 w-5" />,
  },
  {
    href: "/produtos",
    label: "Produtos",
    icon: <Package className="h-5 w-5" />,
  },
  {
    href: "/estoque",
    label: "Estoque",
    icon: <Boxes className="h-5 w-5" />,
  },
  {
    href: "/registrar-venda",
    label: "Vender",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    href: "/configuracoes",
    label: "Perfil",
    icon: <User className="h-5 w-5" />,
  },
];

/**
 * Bottom Navigation para mobile (oculta em desktop md+)
 * Padrão mobile-first: sempre visível em telas pequenas
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px]",
                "transition-colors duration-200",
                "active:scale-95", // Feedback visual ao tocar
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "transition-all",
                isActive && "scale-110"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
