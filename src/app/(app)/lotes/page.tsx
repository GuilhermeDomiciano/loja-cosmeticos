"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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

interface Lote {
  id: string;
  codigo?: string | null;
  quantidade: number;
  dataValidade?: string | null;
  variacaoProdutoId: string;
  variacaoProduto?: {
    nome: string;
    produto?: { nome: string } | null;
  } | null;
}

interface Variacao {
  id: string;
  nome: string;
  produto?: { nome: string } | null;
}

export default function LotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    codigo: "",
    quantidade: "",
    dataValidade: "",
    variacaoProdutoId: "",
  });

  useEffect(() => {
    fetchLotes();
    fetchVariacoes();
  }, []);

  const fetchLotes = async () => {
    try {
      const res = await fetch("/api/lotes");
      if (!res.ok) throw new Error("Erro ao carregar lotes");
      const data = await res.json();
      setLotes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar lotes");
    } finally {
      setLoading(false);
    }
  };

  const fetchVariacoes = async () => {
    try {
      const res = await fetch("/api/variacoes");
      if (!res.ok) throw new Error("Erro ao carregar variações");
      const data = await res.json();
      setVariacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar variações");
    }
  };

  const handleSave = async () => {
    try {
      const url = editingLote ? `/api/lotes/${editingLote.id}` : "/api/lotes";
      const method = editingLote ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantidade: parseInt(formData.quantidade),
          dataValidade: formData.dataValidade || null,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar lote");

      toast.success(
        editingLote
          ? "Lote atualizado com sucesso!"
          : "Lote criado com sucesso!"
      );
      setDialogOpen(false);
      setFormData({ codigo: "", quantidade: "", dataValidade: "", variacaoProdutoId: "" });
      setEditingLote(null);
      fetchLotes();
    } catch (error) {
      toast.error("Erro ao salvar lote");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/lotes/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar lote");

      toast.success("Lote deletado com sucesso!");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchLotes();
    } catch (error) {
      toast.error("Erro ao deletar lote");
    }
  };

  const openEditDialog = (lote: Lote) => {
    setEditingLote(lote);
    setFormData({
      codigo: lote.codigo || "",
      quantidade: lote.quantidade.toString(),
      dataValidade: lote.dataValidade ? lote.dataValidade.split("T")[0] : "",
      variacaoProdutoId: lote.variacaoProdutoId,
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingLote(null);
    setFormData({ codigo: "", quantidade: "", dataValidade: "", variacaoProdutoId: "" });
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const getStatusValidade = (dataValidade?: string | null) => {
    if (!dataValidade) return { label: "Sem validade", color: "default", icon: Clock };
    
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return { label: "Vencido", color: "destructive", icon: AlertTriangle };
    } else if (diasRestantes <= 30) {
      return { label: "Vence em breve", color: "yellow", icon: AlertTriangle };
    } else {
      return { label: "Válido", color: "green", icon: CheckCircle };
    }
  };

  const filteredLotes = lotes.filter((lote) =>
    (lote.codigo?.toLowerCase().includes(search.toLowerCase())) ||
    (lote.variacaoProduto?.nome.toLowerCase().includes(search.toLowerCase())) ||
    (lote.variacaoProduto?.produto?.nome.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h1 className="text-3xl font-bold">Lotes de Estoque</h1>
          <p className="text-muted-foreground mt-1">
            Controle de validade e rastreabilidade
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lote
        </Button>
      </div>

      <Input
        placeholder="Buscar por código, produto ou variação..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLotes.length === 0 ? (
          <Card className="col-span-full p-12 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">Nenhum lote encontrado</p>
          </Card>
        ) : (
          filteredLotes.map((lote) => {
            const status = getStatusValidade(lote.dataValidade);
            const StatusIcon = status.icon;

            return (
              <Card key={lote.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {lote.variacaoProduto?.produto?.nome || "Produto"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lote.variacaoProduto?.nome || "Variação"}
                      </p>
                      {lote.codigo && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Lote: {lote.codigo}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        status.color === "green"
                          ? "default"
                          : status.color === "yellow"
                          ? "secondary"
                          : "destructive"
                      }
                      className="flex items-center gap-1"
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span className="font-medium">{lote.quantidade}</span>
                    </div>
                    {lote.dataValidade && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validade:</span>
                        <span className="font-medium">
                          {new Date(lote.dataValidade).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(lote)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(lote.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLote ? "Editar Lote" : "Novo Lote"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do lote
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="variacao">Variação *</Label>
              <Select
                value={formData.variacaoProdutoId}
                onValueChange={(value) =>
                  setFormData({ ...formData, variacaoProdutoId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma variação" />
                </SelectTrigger>
                <SelectContent>
                  {variacoes.map((variacao) => (
                    <SelectItem key={variacao.id} value={variacao.id}>
                      {variacao.produto?.nome} - {variacao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código do Lote</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
                placeholder="Ex: L2024-001"
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
            <div className="space-y-2">
              <Label htmlFor="dataValidade">Data de Validade</Label>
              <Input
                id="dataValidade"
                type="date"
                value={formData.dataValidade}
                onChange={(e) =>
                  setFormData({ ...formData, dataValidade: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.quantidade || !formData.variacaoProdutoId}
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
            <DialogTitle>Deletar Lote</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este lote? Esta ação não pode ser
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
