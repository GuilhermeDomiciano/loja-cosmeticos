"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Ilustração */}
        <div className="relative">
          <div className="text-9xl font-bold text-primary/10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-24 w-24 text-muted-foreground animate-pulse" />
          </div>
        </div>

        {/* Mensagem */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Página não encontrada</h1>
          <p className="text-muted-foreground">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Ir para o Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Links úteis */}
        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Links úteis:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/produtos">
              <Button variant="link" size="sm">Produtos</Button>
            </Link>
            <Link href="/registrar-venda">
              <Button variant="link" size="sm">Registrar Venda</Button>
            </Link>
            <Link href="/estoque">
              <Button variant="link" size="sm">Estoque</Button>
            </Link>
            <Link href="/relatorios">
              <Button variant="link" size="sm">Relatórios</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
