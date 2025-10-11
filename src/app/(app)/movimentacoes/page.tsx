"use client";

import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

interface Movimentacao {
  id: string;
  tipo: "ENTRADA" | "SAIDA";
  motivo: string;
  quantidade: number;
  precoUnitario?: number | null;
  canalVenda?: string | null;
  criadoEm: string;
  variacaoProduto: {
    nome: string;
    produto: { nome: string };
  };
}

export default function MovimentacoesPage() {
  const [loading, setLoading] = useState(true);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroMotivo, setFiltroMotivo] = useState("TODOS");

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  const fetchMovimentacoes = async () => {
    try {
      const res = await fetch("/api/movimentacoes");
      if (!res.ok) throw new Error("Erro ao carregar movimentações");
      const data = await res.json();
      setMovimentacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar movimentações");
    } finally {
      setLoading(false);
    }
  };

  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    if (filtroTipo !== "TODOS" && mov.tipo !== filtroTipo) return false;
    if (filtroMotivo !== "TODOS" && mov.motivo !== filtroMotivo) return false;
    return true;
  });

  const totalEntradas = movimentacoesFiltradas
    .filter((m) => m.tipo === "ENTRADA")
    .reduce((acc, m) => acc + m.quantidade, 0);

  const totalSaidas = movimentacoesFiltradas
    .filter((m) => m.tipo === "SAIDA")
    .reduce((acc, m) => acc + m.quantidade, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Movimentações</h1>
          <p className="text-muted-foreground mt-1">
            Histórico de entradas e saídas de estoque
          </p>
        </div>
        <Link href="/movimentacoes/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Movimentação
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Entradas</p>
                <p className="text-3xl font-bold text-green-600">{totalEntradas}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Saídas</p>
                <p className="text-3xl font-bold text-red-600">{totalSaidas}</p>
              </div>
              <TrendingDown className="h-12 w-12 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
            
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="ENTRADA">Entradas</SelectItem>
                <SelectItem value="SAIDA">Saídas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroMotivo} onValueChange={setFiltroMotivo}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os motivos</SelectItem>
                <SelectItem value="VENDA">Venda</SelectItem>
                <SelectItem value="COMPRA">Compra</SelectItem>
                <SelectItem value="AJUSTE">Ajuste</SelectItem>
                <SelectItem value="DEVOLUCAO">Devolução</SelectItem>
                <SelectItem value="OUTRO">Outro</SelectItem>
              </SelectContent>
            </Select>

            {(filtroTipo !== "TODOS" || filtroMotivo !== "TODOS") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFiltroTipo("TODOS");
                  setFiltroMotivo("TODOS");
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {movimentacoesFiltradas.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma movimentação encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {filtroTipo !== "TODOS" || filtroMotivo !== "TODOS"
              ? "Tente ajustar os filtros"
              : "Comece registrando uma movimentação"}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {movimentacoesFiltradas.map((mov) => (
            <Card key={mov.id} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={mov.tipo === "ENTRADA" ? "default" : "secondary"}>
                        {mov.tipo === "ENTRADA" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {mov.tipo}
                      </Badge>
                      <Badge variant="outline">{mov.motivo}</Badge>
                      {mov.canalVenda && (
                        <Badge variant="outline" className="text-xs">
                          {mov.canalVenda}
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{mov.variacaoProduto.produto.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {mov.variacaoProduto.nome}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className={`text-xl font-bold ${
                        mov.tipo === "ENTRADA" ? "text-green-600" : "text-red-600"
                      }`}>
                        {mov.tipo === "ENTRADA" ? "+" : "-"}{mov.quantidade}
                      </p>
                    </div>

                    {mov.precoUnitario && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Valor Unit.</p>
                        <p className="font-semibold">
                          R$ {mov.precoUnitario.toFixed(2)}
                        </p>
                      </div>
                    )}

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="text-sm font-medium">
                        {new Date(mov.criadoEm).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(mov.criadoEm).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

