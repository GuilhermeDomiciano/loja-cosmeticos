import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticação - Loja de Cosméticos",
  description: "Faça login ou crie sua conta",
};

/**
 * Layout para páginas de autenticação (login/signup)
 * Mobile-first: design limpo e centralizado
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Loja de Cosméticos
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Sistema de Gestão Completo
          </p>
        </div>

        {/* Conteúdo (signin/signup forms) */}
        {children}
      </div>
    </div>
  );
}
