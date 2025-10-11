"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Variacao {
  id: string;
  nome: string;
  preco: number;
  produto: { nome: string };
}

interface Kit {
  id: string;
  nome: string;
  preco: number;
  itens: Array<{
    quantidade: number;
    variacaoProduto: { id: string };
  }>;
}

interface ItemCarrinho {
  tipo: "VARIACAO" | "KIT";
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  itemsDoKit?: Array<{ variacaoId: string; quantidade: number }>;
}

export default function VendaRapidaPage() {
  const [loading, setLoading] = useState(true);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [search, setSearch] = useState("");
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [canalVenda, setCanalVenda] = useState("LOJA_FISICA");

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const [variacoesRes, kitsRes] = await Promise.all([
        fetch("/api/variacoes"),
        fetch("/api/kits"),
      ]);

      const variacoesData = await variacoesRes.json();
      const kitsData = await kitsRes.json();

      setVariacoes(Array.isArray(variacoesData) ? variacoesData : []);
      setKits(Array.isArray(kitsData) ? kitsData.filter((k: Kit) => k.ativo) : []);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const adicionarVariacao = (variacao: Variacao) => {
    const itemExistente = carrinho.find(
      (item) => item.tipo === "VARIACAO" && item.id === variacao.id
    );

    if (itemExistente) {
      setCarrinho(
        carrinho.map((item) =>
          item.tipo === "VARIACAO" && item.id === variacao.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([
        ...carrinho,
        {
          tipo: "VARIACAO",
          id: variacao.id,
          nome: `${variacao.produto.nome} - ${variacao.nome}`,
          preco: variacao.preco,
          quantidade: 1,
        },
      ]);
    }
    toast.success("Adicionado ao carrinho");
  };

  const adicionarKit = (kit: Kit) => {
    const itemExistente = carrinho.find(
      (item) => item.tipo === "KIT" && item.id === kit.id
    );

    if (itemExistente) {
      setCarrinho(
        carrinho.map((item) =>
          item.tipo === "KIT" && item.id === kit.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([
        ...carrinho,
        {
          tipo: "KIT",
          id: kit.id,
          nome: kit.nome,
          preco: kit.preco,
          quantidade: 1,
          itemsDoKit: kit.itens.map((i) => ({
            variacaoId: i.variacaoProduto.id,
            quantidade: i.quantidade,
          })),
        },
      ]);
    }
    toast.success("Kit adicionado ao carrinho");
  };

  const alterarQuantidade = (index: number, delta: number) => {
    setCarrinho(
      carrinho
        .map((item, i) => {
          if (i === index) {
            const novaQuantidade = item.quantidade + delta;
            return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : null;
          }
          return item;
        })
        .filter((item) => item !== null) as ItemCarrinho[]
    );
  };

  const removerItem = (index: number) => {
    setCarrinho(carrinho.filter((_, i) => i !== index));
    toast.success("Item removido");
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    toast.success("Carrinho limpo");
  };

  const handleFinalizarVenda = async () => {
    if (!metodoPagamento) {
      toast.error("Selecione o método de pagamento");
      return;
    }

    setFinalizando(true);
    try {
      // Criar movimentações para cada item
      const movimentacoes = carrinho.flatMap((item) => {
        if (item.tipo === "VARIACAO") {
          return [
            {
              tipo: "SAIDA",
              motivo: "VENDA",
              quantidade: item.quantidade,
              precoUnitario: item.preco,
              variacaoProdutoId: item.id,
              canalVenda,
            },
          ];
        } else {
          // Kit: criar movimentação para cada item do kit
          return (item.itemsDoKit || []).map((kitItem) => ({
            tipo: "SAIDA",
            motivo: "VENDA",
            quantidade: kitItem.quantidade * item.quantidade,
            precoUnitario: item.preco / (item.itemsDoKit?.length || 1), // Dividir preço proporcionalmente
            variacaoProdutoId: kitItem.variacaoId,
            canalVenda,
          }));
        }
      });

      // Criar movimentações
      const movPromises = movimentacoes.map((mov) =>
        fetch("/api/movimentacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mov),
        })
      );

      await Promise.all(movPromises);

      // Criar transação financeira
      const valorTotal = carrinho.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0
      );

      await fetch("/api/transacoes-financeiras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "RECEBER",
          valor: valorTotal,
          descricao: `Venda - ${carrinho.length} ${carrinho.length === 1 ? "item" : "itens"}`,
          dataVencimento: new Date().toISOString().split("T")[0],
          metodoPagamento,
          status: "CONCLUIDO",
        }),
      });

      toast.success("Venda finalizada com sucesso!");
      setCarrinho([]);
      setFinalizarDialogOpen(false);
      setMetodoPagamento("");
    } catch (error) {
      toast.error("Erro ao finalizar venda");
    } finally {
      setFinalizando(false);
    }
  };

  const valorTotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  const itensSearch = search.toLowerCase();
  const variacoesFiltradas = variacoes.filter(
    (v) =>
      v.nome.toLowerCase().includes(itensSearch) ||
      v.produto.nome.toLowerCase().includes(itensSearch)
  );
  const kitsFiltrados = kits.filter((k) =>
    k.nome.toLowerCase().includes(itensSearch)
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Venda Rápida</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            PDV otimizado para vendas no balcão
          </p>
        </div>
        {carrinho.length > 0 && (
          <Badge variant="secondary" className="text-lg py-2 px-4">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {carrinho.reduce((acc, item) => acc + item.quantidade, 0)} itens
          </Badge>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produto ou kit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-base h-12"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Lista de Produtos */}
        <Card className="lg:max-h-[600px] lg:overflow-y-auto">
          <CardHeader>
            <CardTitle>Produtos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {variacoesFiltradas.length === 0 && kitsFiltrados.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum produto encontrado
              </p>
            ) : (
              <>
                {variacoesFiltradas.map((variacao) => (
                  <div
                    key={variacao.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => adicionarVariacao(variacao)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{variacao.produto.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {variacao.nome}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        R$ {variacao.preco.toFixed(2)}
                      </p>
                      <Button size="sm" className="mt-1">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {kitsFiltrados.map((kit) => (
                  <div
                    key={kit.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors bg-primary/5"
                    onClick={() => adicionarKit(kit)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{kit.nome}</p>
                      <Badge variant="secondary" className="mt-1">
                        Kit
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        R$ {kit.preco.toFixed(2)}
                      </p>
                      <Button size="sm" className="mt-1">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Carrinho */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Carrinho</CardTitle>
              {carrinho.length > 0 && (
                <Button variant="ghost" size="sm" onClick={limparCarrinho}>
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {carrinho.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Carrinho vazio</p>
                <p className="text-sm">Adicione produtos para começar</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {carrinho.map((item, index) => (
                    <div
                      key={`${item.tipo}-${item.id}-${index}`}
                      className="flex items-center gap-2 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.nome}</p>
                        {item.tipo === "KIT" && (
                          <Badge variant="secondary" className="mt-1">
                            Kit
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          R$ {item.preco.toFixed(2)} cada
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => alterarQuantidade(index, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {item.quantidade}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => alterarQuantidade(index, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => removerItem(index)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-2xl text-primary">
                      R$ {valorTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setFinalizarDialogOpen(true)}
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    Finalizar Venda
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Finalizar Venda */}
      <Dialog open={finalizarDialogOpen} onOpenChange={setFinalizarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
            <DialogDescription>
              Total: R$ {valorTotal.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Método de Pagamento *</Label>
              <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                  <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Canal de Venda</Label>
              <Select value={canalVenda} onValueChange={setCanalVenda}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOJA_FISICA">Loja Física</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                  <SelectItem value="SITE">Site</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinalizarDialogOpen(false)}
              disabled={finalizando}
            >
              Cancelar
            </Button>
            <Button onClick={handleFinalizarVenda} disabled={finalizando}>
              {finalizando ? "Finalizando..." : "Confirmar Venda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
