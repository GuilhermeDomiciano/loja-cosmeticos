"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Package, Eye } from "lucide-react";
import Link from "next/link";
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

interface Produto {
  id: string;
  nome: string;
  descricao?: string | null;
  sku?: string | null;
  imagemUrl?: string | null;
  ativo: boolean;
  categoriaId?: string | null;
  categoria?: { nome: string } | null;
}

interface Categoria {
  id: string;
  nome: string;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    sku: "",
    categoriaId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await fetch("/api/produtos");
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias");
      if (!res.ok) throw new Error("Erro ao carregar categorias");
      const data = await res.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar categorias");
    }
  };

  const handleSave = async () => {
    try {
      let imagemUrl = editingProduto?.imagemUrl;

      // Upload de imagem se houver
      if (imageFile) {
        setUploading(true);
        const formDataImg = new FormData();
        formDataImg.append("file", imageFile);

        const uploadRes = await fetch("/api/storage", {
          method: "POST",
          body: formDataImg,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imagemUrl = uploadData.url;
        }
        setUploading(false);
      }

      const url = editingProduto
        ? `/api/produtos/${editingProduto.id}`
        : "/api/produtos";
      const method = editingProduto ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoriaId: formData.categoriaId || null,
          imagemUrl,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar produto");

      toast.success(
        editingProduto
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
      );
      setDialogOpen(false);
      setFormData({ nome: "", descricao: "", sku: "", categoriaId: "" });
      setImageFile(null);
      setEditingProduto(null);
      fetchProdutos();
    } catch (error) {
      toast.error("Erro ao salvar produto");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/produtos/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar produto");

      toast.success("Produto deletado com sucesso!");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchProdutos();
    } catch (error) {
      toast.error("Erro ao deletar produto");
    }
  };

  const openEditDialog = (produto: Produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || "",
      sku: produto.sku || "",
      categoriaId: produto.categoriaId || "",
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduto(null);
    setFormData({ nome: "", descricao: "", sku: "", categoriaId: "" });
    setImageFile(null);
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const filteredProdutos = produtos.filter((prod) => {
    const matchSearch = prod.nome.toLowerCase().includes(search.toLowerCase());
    const matchCategoria =
      filterCategoria === "all" || prod.categoriaId === filterCategoria;
    return matchSearch && matchCategoria;
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
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filterCategoria} onValueChange={setFilterCategoria}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProdutos.length === 0 ? (
          <Card className="col-span-full p-12 flex flex-col items-center justify-center text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </Card>
        ) : (
          filteredProdutos.map((produto) => (
            <Card key={produto.id} className="p-4 hover:shadow-lg transition-shadow">
              {produto.imagemUrl && (
                <div className="mb-3 aspect-video bg-muted rounded-md overflow-hidden">
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{produto.nome}</h3>
                  {produto.sku && (
                    <p className="text-xs text-muted-foreground">SKU: {produto.sku}</p>
                  )}
                </div>
                <Badge variant={produto.ativo ? "default" : "secondary"}>
                  {produto.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              {produto.descricao && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {produto.descricao}
                </p>
              )}

              {produto.categoria && (
                <div className="mb-3">
                  <Badge variant="outline">{produto.categoria.nome}</Badge>
                </div>
              )}

              <div className="flex gap-2">
                <Link href={`/produtos/${produto.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(produto)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(produto.id)}
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
              {editingProduto ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do produto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem do Produto</Label>
              <Input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);
                }}
              />
              {imageFile && (
                <p className="text-xs text-muted-foreground">
                  Arquivo selecionado: {imageFile.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: Creme Hidratante"
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
                placeholder="Código do produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoriaId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoriaId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descrição do produto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.nome || uploading}>
              {uploading ? "Enviando imagem..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Deletar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este produto? Esta ação não pode ser
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
