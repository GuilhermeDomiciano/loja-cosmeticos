"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Estritamente para o vendedor dar baixa em vendas (PDV interno)

type Variacao = {
  id: string;
  nome: string;
  preco: number;
  produto?: { id: string; nome: string } | null;
};

type ItemCarrinho = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
};

export default function RegistrarVendaPage() {
  const [loading, setLoading] = useState(true);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [search, setSearch] = useState("");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [finalizarOpen, setFinalizarOpen] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [canalVenda, setCanalVenda] = useState("BALCAO");
  const [vendedorId, setVendedorId] = useState<string>("");
  const [vendedores, setVendedores] = useState<Array<{ id: string; nome: string }>>([]);
  const [saldos, setSaldos] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const [meRes, varRes, vendRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/variacoes"),
          fetch("/api/usuarios"),
        ]);
        if (meRes.ok) {
          const me = await meRes.json();
          if (me?.user?.sub) setVendedorId(me.user.sub);
        }
        const data = await varRes.json();
        const list = Array.isArray(data) ? data : [];
        setVariacoes(list);
        // carregar vendedores (papel vendedor ou sem papel)
        if (vendRes.ok) {
          const payload = await vendRes.json();
          const arr = Array.isArray(payload) ? payload : payload?.data || [];
          const mapped = arr.map((u: any) => ({ id: u.id, nome: u.nome })) as Array<{ id: string; nome: string }>;
          setVendedores(mapped);
        }
        // saldos
        if (list.length > 0) {
          const salRes = await fetch("/api/estoque/saldos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variacaoIds: list.map((v: any) => v.id) }) });
          const payload = await salRes.json();
          if (salRes.ok) setSaldos(payload.saldos || {});
        }
      } catch {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const adicionar = (v: Variacao) => {
    const idx = carrinho.findIndex((i) => i.id === v.id);
    if (idx >= 0) {
      const next = [...carrinho];
      next[idx] = { ...next[idx], quantidade: next[idx].quantidade + 1 };
      setCarrinho(next);
    } else {
      setCarrinho([
        ...carrinho,
        { id: v.id, nome: `${v.produto?.nome ?? "Produto"} - ${v.nome}`, preco: v.preco, quantidade: 1 },
      ]);
    }
  };

  const remover = (id: string) => {
    const idx = carrinho.findIndex((i) => i.id === id);
    if (idx >= 0) {
      const next = [...carrinho];
      const q = next[idx].quantidade - 1;
      if (q <= 0) next.splice(idx, 1); else next[idx] = { ...next[idx], quantidade: q };
      setCarrinho(next);
    }
  };

  const excluir = (id: string) => setCarrinho(carrinho.filter((i) => i.id !== id));
  const limpar = () => setCarrinho([]);

  const total = useMemo(() => carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0), [carrinho]);

  const finalizar = async () => {
    if (!metodoPagamento) return toast.error("Selecione o método de pagamento");
    if (carrinho.length === 0) return toast.error("Carrinho vazio");

    try {
      if (!vendedorId) {
        toast.error("Selecione o vendedor");
        return;
      }
      // valida saldo antes
      const ids = carrinho.map((i) => i.id);
      const saldosRes = await fetch("/api/estoque/saldos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variacaoIds: ids }) });
      const saldosPayload = await saldosRes.json();
      if (!saldosRes.ok) throw new Error(saldosPayload?.message || "Falha ao validar estoque");
      const saldos: Record<string, number> = saldosPayload.saldos || {};
      const insuficientes = carrinho.filter((i) => (saldos[i.id] ?? 0) < i.quantidade);
      if (insuficientes.length > 0) {
        return toast.error(`Estoque insuficiente para: ${insuficientes.map((i) => i.nome).join(", ")}`);
      }
      // Registrar saídas de estoque por variação
      const movs = carrinho.map((i) => ({
        tipo: "SAIDA",
        motivo: "VENDA",
        quantidade: i.quantidade,
        precoUnitario: i.preco,
        variacaoProdutoId: i.id,
        canalVenda,
        vendedorId: vendedorId || undefined,
      }));
      await Promise.all(
        movs.map((m) =>
          fetch("/api/movimentacoes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(m) })
        )
      );

      // Criar transação financeira da venda (a receber)
      await fetch("/api/transacoes-financeiras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "RECEBER",
          valor: total,
          descricao: `Venda balcão - ${carrinho.length} itens`,
          metodoPagamento,
        }),
      });

      toast.success("Venda registrada");
      limpar();
      setFinalizarOpen(false);
      setMetodoPagamento("");
      setVendedorId("");
    } catch {
      toast.error("Erro ao registrar venda");
    }
  };

  const itensSearch = search.toLowerCase();
  const variacoesFiltradas = variacoes.filter(
    (v) => v.nome.toLowerCase().includes(itensSearch) || (v.produto?.nome?.toLowerCase() || "").includes(itensSearch)
  );

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Registrar Venda</h1>
        <p className="text-muted-foreground">PDV interno para dar baixa em estoque</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto..." className="pl-9 h-12" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:max-h-[600px] lg:overflow-y-auto">
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : (
              variacoesFiltradas.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{v.produto?.nome ?? "Produto"}</p>
                    <p className="text-sm text-muted-foreground truncate">{v.nome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estoque: {saldos[v.id] ?? 0}</p>
                    <p className="font-bold">R$ {v.preco.toFixed(2)}</p>
                    <Button size="sm" className="mt-1" onClick={() => adicionar(v)} disabled={(saldos[v.id] ?? 0) <= 0}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Carrinho</CardTitle>
            {carrinho.length > 0 && (
              <Badge variant="secondary" className="text-base py-1 px-2">
                <ShoppingCart className="h-4 w-4 mr-1" />
                {carrinho.reduce((acc, i) => acc + i.quantidade, 0)} itens
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {carrinho.length === 0 ? (
              <p className="text-muted-foreground">Nenhum item</p>
            ) : (
              <>
                {carrinho.map((i, idx) => (
                  <div key={i.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{i.nome}</p>
                      <p className="text-sm text-muted-foreground">R$ {i.preco.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => remover(i.id)} className="h-9 w-9">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{i.quantidade}</span>
                      <Button variant="outline" size="icon" onClick={() => adicionar({ id: i.id, nome: i.nome, preco: i.preco, produto: null })} className="h-9 w-9">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => excluir(i.id)} className="h-9 w-9 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">R$ {total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="w-1/3" onClick={limpar}>Limpar</Button>
                  <Button className="flex-1" onClick={() => setFinalizarOpen(true)} disabled={carrinho.length === 0}>Finalizar</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={finalizarOpen} onOpenChange={setFinalizarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar venda</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Método de pagamento</Label>
              <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="DEBITO">Débito</SelectItem>
                  <SelectItem value="CREDITO">Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Canal</Label>
              <Select value={canalVenda} onValueChange={setCanalVenda}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BALCAO">Balcão</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                  <SelectItem value="MARKETPLACE">Marketplace</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Vendedor</Label>
              <Select value={vendedorId} onValueChange={setVendedorId}>
                <SelectTrigger><SelectValue placeholder="Selecione o vendedor" /></SelectTrigger>
                <SelectContent>
                  {vendedores.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFinalizarOpen(false)}>Cancelar</Button>
            <Button onClick={finalizar}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
