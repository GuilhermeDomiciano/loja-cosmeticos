"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface HeaderProps {
  title?: string;
}

/**
 * Header mobile-first com menu hambúrguer
 * - Mobile: mostra hambúrguer + título
 * - Desktop (md+): oculto (usa Sidebar fixa)
 */
export function Header({ title = "Loja de Cosméticos" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background md:hidden">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Menu Hambúrguer (só mobile) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Título */}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}
