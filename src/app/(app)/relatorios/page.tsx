"use client";

import { BarChart3, Package, TrendingUp, DollarSign, ShoppingCart, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const relatorios = [
  {
    id: "vendas",
    titulo: "Relatório de Vendas",
    descricao: "Análise de vendas por período, canais e produtos",
    icone: ShoppingCart,
    cor: "text-green-600",
    href: "/relatorios/vendas",
  },
  {
    id: "estoque",
    titulo: "Relatório de Estoque",
    descricao: "Valor em estoque, produtos críticos e análises",
    icone: Package,
    cor: "text-blue-600",
    href: "/relatorios/estoque",
  },
  {
    id: "financeiro",
    titulo: "Relatório Financeiro",
    descricao: "Receitas, despesas e lucro líquido",
    icone: DollarSign,
    cor: "text-purple-600",
    href: "/relatorios/financeiro",
  },
  {
    id: "produtos",
    titulo: "Top Produtos",
    descricao: "Produtos mais vendidos e rentabilidade",
    icone: TrendingUp,
    cor: "text-orange-600",
    href: "/relatorios/produtos",
  },
];

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Análises e insights do seu negócio
        </p>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {relatorios.map((relatorio) => {
          const Icone = relatorio.icone;
          return (
            <Link key={relatorio.id} href={relatorio.href}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{relatorio.titulo}</CardTitle>
                    <Icone className={`h-8 w-8 ${relatorio.cor}`} />
                  </div>
                  <CardDescription className="text-sm">
                    {relatorio.descricao}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Seção de Exportações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Exportações e Impressões
          </CardTitle>
          <CardDescription>
            Gere relatórios para download ou impressão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Acesse qualquer relatório acima para visualizar dados detalhados e opções de exportação.
          </p>
          <div className="flex gap-2 flex-wrap">
            <div className="px-3 py-1 bg-muted rounded-md text-sm">📊 Gráficos Interativos</div>
            <div className="px-3 py-1 bg-muted rounded-md text-sm">📄 Exportar CSV</div>
            <div className="px-3 py-1 bg-muted rounded-md text-sm">📅 Filtros por Período</div>
            <div className="px-3 py-1 bg-muted rounded-md text-sm">📱 Mobile Friendly</div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">💡 Dica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use os filtros de período em cada relatório para obter insights específicos.
            Os dados são atualizados em tempo real conforme você registra vendas e movimentações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
