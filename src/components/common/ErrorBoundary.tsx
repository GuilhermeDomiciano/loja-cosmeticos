"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary para capturar erros de renderização
 * Mobile-first: layout responsivo
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <h1 className="text-xl md:text-2xl font-bold">Algo deu errado</h1>
            
            <p className="text-sm md:text-base text-muted-foreground">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="text-left text-xs bg-muted p-4 rounded-lg overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Recarregar página
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard")}
                className="w-full sm:w-auto"
              >
                Ir para Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
