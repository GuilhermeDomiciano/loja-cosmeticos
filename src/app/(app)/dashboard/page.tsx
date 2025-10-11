"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  Users
} from "lucide-react";

/**
 * Dashboard Home - Visão geral do sistema
 * Mobile-first: cards empilhados → grid responsivo
 */
export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    produtosTotal: 0,
    variacoesTotal: 0,
    categoriasTotal: 0,
    estoqueBaixo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [produtosRes, variacoesRes, categoriasRes] = await Promise.all([
        fetch("/api/produtos"),
        fetch("/api/variacoes"),
        fetch("/api/categorias"),
      ]);

      const produtos = await produtosRes.json();
      const variacoes = await variacoesRes.json();
      const categorias = await categoriasRes.json();

      const produtosArray = Array.isArray(produtos) ? produtos : [];
      const variacoesArray = Array.isArray(variacoes) ? variacoes : [];
      const categoriasArray = Array.isArray(categorias) ? categorias : [];

      // Contar variações com estoque baixo (menos de 10)
      const estoqueBaixo = variacoesArray.filter(
        (v: { quantidade: number }) => v.quantidade < 10
      ).length;

      setMetrics({
        produtosTotal: produtosArray.length,
        variacoesTotal: variacoesArray.length,
        categoriasTotal: categoriasArray.length,
        estoqueBaixo,
      });
    } catch (error) {
      console.error("Erro ao carregar métricas", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Produtos Total */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Produtos</p>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{metrics.produtosTotal}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Total cadastrado
          </p>
        </Card>

        {/* Variações */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Variações</p>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{metrics.variacoesTotal}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Total cadastradas
          </p>
        </Card>

        {/* Categorias */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Categorias</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">
            {metrics.categoriasTotal}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total cadastradas
          </p>
        </Card>

        {/* Estoque baixo */}
        <Card className="p-6 border-yellow-500/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Alertas</p>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-500">
            {metrics.estoqueBaixo}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Estoque baixo
          </p>
        </Card>
      </div>

      {/* Seção de ações rápidas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Novo Produto</p>
                <p className="text-xs text-muted-foreground">
                  Cadastrar produto
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Nova Venda</p>
                <p className="text-xs text-muted-foreground">
                  Registrar venda
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Relatórios</p>
                <p className="text-xs text-muted-foreground">
                  Ver análises
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bem-vindo / Primeiros passos */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              Bem-vindo ao Sistema!
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece cadastrando seus produtos, registrando estoque e fazendo suas primeiras vendas.
              O sistema foi desenvolvido mobile-first para você gerenciar seu negócio de qualquer lugar!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

