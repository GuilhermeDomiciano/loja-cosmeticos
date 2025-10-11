"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Variacao {
  id: string;
  nome: string;
  sku?: string | null;
  preco: number;
  quantidade: number;
  unidade: string;
  ativa: boolean;
  produtoId: string;
  produto?: { nome: string } | null;
}

interface Produto {
  id: string;
  nome: string;
}

const UNIDADES = [
  { value: "UN", label: "Unidade" },
  { value: "ML", label: "Mililitro" },
  { value: "G", label: "Grama" },
  { value: "KG", label: "Quilograma" },
  { value: "L", label: "Litro" },
];

export default function VariacoesPage() {
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterProduto, setFilterProduto] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingVariacao, setEditingVariacao] = useState<Variacao | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    sku: "",
    preco: "",
    quantidade: "",
    unidade: "UN",
    produtoId: "",
  });

  useEffect(() => {
    fetchVariacoes();
    fetchProdutos();
  }, []);

  const fetchVariacoes = async () => {
    try {
      const res = await fetch("/api/variacoes");
      if (!res.ok) throw new Error("Erro ao carregar variações");
      const data = await res.json();
      setVariacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar variações");
    } finally {
      setLoading(false);
    }
  };

  const fetchProdutos = async () => {
    try {
      const res = await fetch("/api/produtos");
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar produtos");
    }
  };

  const handleSave = async () => {
    try {
      const url = editingVariacao
        ? `/api/variacoes/${editingVariacao.id}`
        : "/api/variacoes";
      const method = editingVariacao ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco),
          quantidade: parseInt(formData.quantidade),
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar variação");

      toast.success(
        editingVariacao
          ? "Variação atualizada com sucesso!"
          : "Variação criada com sucesso!"
      );
      setDialogOpen(false);
      setFormData({ nome: "", sku: "", preco: "", quantidade: "", unidade: "UN", produtoId: "" });
      setEditingVariacao(null);
      fetchVariacoes();
    } catch (error) {
      toast.error("Erro ao salvar variação");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/variacoes/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar variação");

      toast.success("Variação deletada com sucesso!");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchVariacoes();
    } catch (error) {
      toast.error("Erro ao deletar variação");
    }
  };

  const openEditDialog = (variacao: Variacao) => {
    setEditingVariacao(variacao);
    setFormData({
      nome: variacao.nome,
      sku: variacao.sku || "",
      preco: variacao.preco.toString(),
      quantidade: variacao.quantidade.toString(),
      unidade: variacao.unidade,
      produtoId: variacao.produtoId,
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingVariacao(null);
    setFormData({ nome: "", sku: "", preco: "", quantidade: "", unidade: "UN", produtoId: "" });
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const filteredVariacoes = variacoes.filter((vari) => {
    const matchSearch = vari.nome.toLowerCase().includes(search.toLowerCase());
    const matchProduto =
      filterProduto === "all" || vari.produtoId === filterProduto;
    return matchSearch && matchProduto;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Variações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as variações de produtos (tamanhos, cores, etc)
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Variação
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Buscar variações..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filterProduto} onValueChange={setFilterProduto}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder="Filtrar por produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos produtos</SelectItem>
            {produtos.map((prod) => (
              <SelectItem key={prod.id} value={prod.id}>
                {prod.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVariacoes.length === 0 ? (
          <Card className="col-span-full p-12 flex flex-col items-center justify-center text-center">
            <Box className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma variação encontrada</p>
          </Card>
        ) : (
          filteredVariacoes.map((variacao) => (
            <Card key={variacao.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{variacao.nome}</h3>
                  {variacao.sku && (
                    <p className="text-xs text-muted-foreground">SKU: {variacao.sku}</p>
                  )}
                </div>
                <Badge variant={variacao.ativa ? "default" : "secondary"}>
                  {variacao.ativa ? "Ativa" : "Inativa"}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preço:</span>
                  <span className="font-medium">
                    R$ {variacao.preco.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estoque:</span>
                  <span className="font-medium">
                    {variacao.quantidade} {variacao.unidade}
                  </span>
                </div>
              </div>

              {variacao.produto && (
                <div className="mb-3">
                  <Badge variant="outline">{variacao.produto.nome}</Badge>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(variacao)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(variacao.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingVariacao ? "Editar Variação" : "Nova Variação"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da variação
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto *</Label>
              <Select
                value={formData.produtoId}
                onValueChange={(value) =>
                  setFormData({ ...formData, produtoId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: 250ml, Azul, Grande"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="Código único"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) =>
                    setFormData({ ...formData, preco: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) =>
                    setFormData({ ...formData, quantidade: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade *</Label>
              <Select
                value={formData.unidade}
                onValueChange={(value) =>
                  setFormData({ ...formData, unidade: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES.map((un) => (
                    <SelectItem key={un.value} value={un.value}>
                      {un.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.nome || !formData.preco || !formData.quantidade || !formData.produtoId}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Deletar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Variação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta variação? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
