"use client";

import { useState, useEffect } from "react";
import { Plus, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

interface TransacaoFinanceira {
  id: string;
  tipo: "RECEBER" | "PAGAR";
  valor: number;
  descricao: string;
  dataVencimento: string;
  status: "PENDENTE" | "CONCLUIDO" | "ATRASADO";
  metodoPagamento?: string | null;
}

interface DashboardData {
  totalAReceber: number;
  totalAPagar: number;
  saldo: number;
  vencimentosProximos: TransacaoFinanceira[];
  transacoesAtrasadas: TransacaoFinanceira[];
}

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalAReceber: 0,
    totalAPagar: 0,
    saldo: 0,
    vencimentosProximos: [],
    transacoesAtrasadas: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/transacoes-financeiras");
      if (!res.ok) throw new Error("Erro ao carregar dados");
      
      const transacoes: TransacaoFinanceira[] = await res.json();

      // Calcular métricas
      const totalAReceber = transacoes
        .filter(t => t.tipo === "RECEBER" && t.status === "PENDENTE")
        .reduce((acc, t) => acc + t.valor, 0);

      const totalAPagar = transacoes
        .filter(t => t.tipo === "PAGAR" && t.status === "PENDENTE")
        .reduce((acc, t) => acc + t.valor, 0);

      const saldo = totalAReceber - totalAPagar;

      // Vencimentos próximos (próximos 7 dias)
      const hoje = new Date();
      const seteDias = new Date();
      seteDias.setDate(hoje.getDate() + 7);

      const vencimentosProximos = transacoes
        .filter(t => {
          if (t.status !== "PENDENTE") return false;
          const vencimento = new Date(t.dataVencimento);
          return vencimento >= hoje && vencimento <= seteDias;
        })
        .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
        .slice(0, 5);

      // Transações atrasadas
      const transacoesAtrasadas = transacoes
        .filter(t => {
          if (t.status !== "PENDENTE") return false;
          const vencimento = new Date(t.dataVencimento);
          return vencimento < hoje;
        })
        .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime());

      setData({
        totalAReceber,
        totalAPagar,
        saldo,
        vencimentosProximos,
        transacoesAtrasadas,
      });
    } catch (error) {
      toast.error("Erro ao carregar dados financeiros");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Controle de contas a pagar e receber
          </p>
        </div>
        <Link href="/financeiro/nova-transacao">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </Link>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {data.totalAReceber.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Contas pendentes
            </p>
            <Link href="/financeiro/a-receber">
              <Button variant="link" size="sm" className="px-0 mt-2">
                Ver detalhes →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {data.totalAPagar.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Contas pendentes
            </p>
            <Link href="/financeiro/a-pagar">
              <Button variant="link" size="sm" className="px-0 mt-2">
                Ver detalhes →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Projetado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
              R$ {data.saldo.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Receber - Pagar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vencimentos Próximos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Vencimentos Próximos
            </CardTitle>
            <CardDescription>
              Próximos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.vencimentosProximos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum vencimento nos próximos 7 dias
              </p>
            ) : (
              <div className="space-y-3">
                {data.vencimentosProximos.map((transacao) => {
                  const vencimento = new Date(transacao.dataVencimento);
                  const diasRestantes = Math.ceil(
                    (vencimento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={transacao.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{transacao.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          Vence em {diasRestantes} {diasRestantes === 1 ? "dia" : "dias"} • {" "}
                          {vencimento.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={transacao.tipo === "RECEBER" ? "default" : "secondary"}>
                          {transacao.tipo}
                        </Badge>
                        <p className={`text-sm font-semibold mt-1 ${
                          transacao.tipo === "RECEBER" ? "text-green-600" : "text-red-600"
                        }`}>
                          R$ {transacao.valor.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transações Atrasadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Atrasadas
            </CardTitle>
            <CardDescription>
              {data.transacoesAtrasadas.length} {data.transacoesAtrasadas.length === 1 ? "transação" : "transações"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.transacoesAtrasadas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma transação atrasada! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {data.transacoesAtrasadas.slice(0, 5).map((transacao) => {
                  const vencimento = new Date(transacao.dataVencimento);
                  const diasAtrasado = Math.ceil(
                    (new Date().getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={transacao.id}
                      className="flex items-center justify-between p-3 border border-destructive/50 rounded-lg bg-destructive/5"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{transacao.descricao}</p>
                        <p className="text-xs text-destructive">
                          Atrasada há {diasAtrasado} {diasAtrasado === 1 ? "dia" : "dias"} • {" "}
                          {vencimento.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">
                          {transacao.tipo}
                        </Badge>
                        <p className="text-sm font-semibold mt-1 text-destructive">
                          R$ {transacao.valor.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {data.transacoesAtrasadas.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    E mais {data.transacoesAtrasadas.length - 5} atrasadas...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Link href="/financeiro/a-receber">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                Contas a Receber
              </Button>
            </Link>
            <Link href="/financeiro/a-pagar">
              <Button variant="outline" className="w-full justify-start">
                <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                Contas a Pagar
              </Button>
            </Link>
            <Link href="/financeiro/nova-transacao">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
