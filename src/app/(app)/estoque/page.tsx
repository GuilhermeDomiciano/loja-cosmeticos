"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface EstoqueItem {
  id: string;
  variacaoProdutoId: string;
  quantidade: number;
  variacaoProduto: {
    nome: string;
    produto: {
      nome: string;
    };
  };
}

interface Lote {
  id: string;
  quantidade: number;
  dataValidade?: string | null;
  variacaoProduto: {
    nome: string;
    produto: {
      nome: string;
    };
  };
}

interface DashboardData {
  totalProdutos: number;
  totalEstoque: number;
  produtosBaixoEstoque: number;
  lotesVencendo: number;
  estoqueItems: EstoqueItem[];
  lotesProximosVencimento: Lote[];
}

export default function EstoquePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalProdutos: 0,
    totalEstoque: 0,
    produtosBaixoEstoque: 0,
    lotesVencendo: 0,
    estoqueItems: [],
    lotesProximosVencimento: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [estoqueRes, lotesRes] = await Promise.all([
        fetch("/api/estoque"),
        fetch("/api/lotes"),
      ]);

      if (!estoqueRes.ok || !lotesRes.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const estoqueData = await estoqueRes.json();
      const lotesData = await lotesRes.json();

      const estoqueItems = Array.isArray(estoqueData) ? estoqueData : [];
      const lotes = Array.isArray(lotesData) ? lotesData : [];

      // Calcular métricas
      const totalProdutos = estoqueItems.length;
      const totalEstoque = estoqueItems.reduce((acc, item) => acc + item.quantidade, 0);
      const produtosBaixoEstoque = estoqueItems.filter(item => item.quantidade <= 10).length;

      // Filtrar lotes que vencem nos próximos 30 dias
      const hoje = new Date();
      const lotesVencendo = lotes.filter((lote) => {
        if (!lote.dataValidade) return false;
        const validade = new Date(lote.dataValidade);
        const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes > 0 && diasRestantes <= 30;
      });

      setData({
        totalProdutos,
        totalEstoque,
        produtosBaixoEstoque,
        lotesVencendo: lotesVencendo.length,
        estoqueItems: estoqueItems.slice(0, 5), // Top 5
        lotesProximosVencimento: lotesVencendo.slice(0, 5),
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Visão Geral do Estoque</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe métricas e alertas importantes
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProdutos}</div>
            <p className="text-xs text-muted-foreground">
              Variações em estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Estoque</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEstoque}</div>
            <p className="text-xs text-muted-foreground">
              Unidades disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baixo Estoque</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {data.produtosBaixoEstoque}
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos com ≤ 10 unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lotes Vencendo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {data.lotesVencendo}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Produtos com baixo estoque */}
        <Card>
          <CardHeader>
            <CardTitle>Baixo Estoque</CardTitle>
            <CardDescription>
              Produtos que precisam de reposição
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.estoqueItems.filter(item => item.quantidade <= 10).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Todos os produtos com estoque adequado
              </p>
            ) : (
              <>
                {data.estoqueItems
                  .filter(item => item.quantidade <= 10)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.variacaoProduto.produto.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.variacaoProduto.nome}
                        </p>
                      </div>
                      <Badge variant={item.quantidade === 0 ? "destructive" : "secondary"}>
                        {item.quantidade} un.
                      </Badge>
                    </div>
                  ))}
                <Link href="/estoque-itens">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver todos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Lotes próximos do vencimento */}
        <Card>
          <CardHeader>
            <CardTitle>Lotes Vencendo</CardTitle>
            <CardDescription>
              Próximos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.lotesProximosVencimento.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum lote vencendo em breve
              </p>
            ) : (
              <>
                {data.lotesProximosVencimento.map((lote) => {
                  const validade = lote.dataValidade ? new Date(lote.dataValidade) : null;
                  const diasRestantes = validade
                    ? Math.ceil((validade.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : 0;

                  return (
                    <div
                      key={lote.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {lote.variacaoProduto.produto.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lote.variacaoProduto.nome}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="mb-1">
                          {diasRestantes} dias
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {lote.quantidade} un.
                        </p>
                      </div>
                    </div>
                  );
                })}
                <Link href="/lotes">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver todos os lotes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Link href="/estoque-itens">
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Gerenciar Estoque
              </Button>
            </Link>
            <Link href="/lotes">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Gerenciar Lotes
              </Button>
            </Link>
            <Link href="/variacoes">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Gerenciar Variações
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
