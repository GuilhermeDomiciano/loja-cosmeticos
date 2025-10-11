import { Container } from "@/components/layout/Container";
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
  // TODO: Buscar dados reais da API
  const metrics = {
    produtosTotal: 0,
    vendasMes: 0,
    faturamentoMes: 0,
    estoqueBaixo: 0,
  };

  return (
    <Container>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Métricas principais - Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Produtos Total */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Produtos</p>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">{metrics.produtosTotal}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Total cadastrado
          </p>
        </Card>

        {/* Vendas do mês */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Vendas</p>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">{metrics.vendasMes}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Este mês
          </p>
        </Card>

        {/* Faturamento */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Faturamento</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            R$ {metrics.faturamentoMes.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Este mês
          </p>
        </Card>

        {/* Estoque baixo */}
        <Card className="p-4 md:p-6 border-yellow-500/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Alertas</p>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-yellow-500">
            {metrics.estoqueBaixo}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Estoque baixo
          </p>
        </Card>
      </div>

      {/* Seção de ações rápidas */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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
    </Container>
  );
}
