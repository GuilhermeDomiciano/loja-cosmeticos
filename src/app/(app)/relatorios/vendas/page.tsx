"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

interface Movimentacao {
  id: string;
  tipo: string;
  motivo: string;
  quantidade: number;
  canalVenda?: string;
  precoUnitario?: number;
  variacaoProduto?: {
    produto?: {
      nome?: string;
    };
  };
}

interface Transacao {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  metodoPagamento?: string;
}

interface DadosVendas {
  totalVendas: number;
  quantidadeVendas: number;
  ticketMedio: number;
  vendasPorCanal: Record<string, number>;
  vendasPorMetodo: Record<string, number>;
  produtosMaisVendidos: Array<{
    produto: string;
    quantidade: number;
    valor: number;
  }>;
}

export default function RelatorioVendasPage() {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<DadosVendas>({
    totalVendas: 0,
    quantidadeVendas: 0,
    ticketMedio: 0,
    vendasPorCanal: {},
    vendasPorMetodo: {},
    produtosMaisVendidos: [],
  });

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      // Buscar movimentações de venda
      const movRes = await fetch("/api/movimentacoes");
      const movimentacoes = await movRes.json();

      const vendas = (movimentacoes as Movimentacao[]).filter(
        (m) => m.tipo === "SAIDA" && m.motivo === "VENDA"
      );

      // Buscar transações financeiras de vendas
      const transRes = await fetch("/api/transacoes-financeiras");
      const transacoes = await transRes.json();

      const vendasFinanceiras = (transacoes as Transacao[]).filter(
        (t) => t.tipo === "RECEBER" && t.descricao.includes("Venda")
      );

      // Calcular métricas
      const totalVendas = vendasFinanceiras.reduce(
        (acc: number, t) => acc + t.valor,
        0
      );
      const quantidadeVendas = vendasFinanceiras.length;
      const ticketMedio = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0;

      // Vendas por canal
      const vendasPorCanal: Record<string, number> = {};
      vendas.forEach((v) => {
        const canal = v.canalVenda || "Não especificado";
        vendasPorCanal[canal] = (vendasPorCanal[canal] || 0) + 1;
      });

      // Vendas por método de pagamento
      const vendasPorMetodo: Record<string, number> = {};
      vendasFinanceiras.forEach((t) => {
        const metodo = t.metodoPagamento || "Não especificado";
        vendasPorMetodo[metodo] = (vendasPorMetodo[metodo] || 0) + 1;
      });

      // Produtos mais vendidos
      const produtosMap: Record<
        string,
        { quantidade: number; valor: number }
      > = {};
      vendas.forEach((v) => {
        const nome = v.variacaoProduto?.produto?.nome || "Produto";
        if (!produtosMap[nome]) {
          produtosMap[nome] = { quantidade: 0, valor: 0 };
        }
        produtosMap[nome].quantidade += v.quantidade;
        produtosMap[nome].valor += (v.precoUnitario || 0) * v.quantidade;
      });

      const produtosMaisVendidos = Object.entries(produtosMap)
        .map(([produto, data]) => ({
          produto,
          quantidade: data.quantidade,
          valor: data.valor,
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10);

      setDados({
        totalVendas,
        quantidadeVendas,
        ticketMedio,
        vendasPorCanal,
        vendasPorMetodo,
        produtosMaisVendidos,
      });
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/relatorios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Relatório de Vendas</h1>
          <p className="text-muted-foreground">
            Análise completa do desempenho de vendas
          </p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {dados.totalVendas.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Receita total de vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quantidade de Vendas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.quantidadeVendas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {dados.ticketMedio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor médio por venda
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vendas por Canal */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Canal</CardTitle>
            <CardDescription>
              Distribuição de vendas por canal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(dados.vendasPorCanal).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma venda registrada
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(dados.vendasPorCanal)
                  .sort((a, b) => b[1] - a[1])
                  .map(([canal, quantidade]) => {
                    const percentual =
                      (quantidade / dados.quantidadeVendas) * 100;
                    return (
                      <div key={canal} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{canal}</span>
                          <span className="text-muted-foreground">
                            {quantidade} vendas ({percentual.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Métodos de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>
              Preferências de pagamento dos clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(dados.vendasPorMetodo).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma venda registrada
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(dados.vendasPorMetodo)
                  .sort((a, b) => b[1] - a[1])
                  .map(([metodo, quantidade]) => {
                    const percentual =
                      (quantidade / dados.quantidadeVendas) * 100;
                    return (
                      <div
                        key={metodo}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="font-medium">{metodo}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {quantidade} vendas
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {percentual.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
          <CardDescription>
            Produtos com maior faturamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dados.produtosMaisVendidos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma venda registrada
            </p>
          ) : (
            <div className="space-y-2">
              {dados.produtosMaisVendidos.map((item, index) => (
                <div
                  key={item.produto}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.produto}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantidade} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      R$ {item.valor.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
