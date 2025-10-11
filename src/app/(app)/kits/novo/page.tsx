"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Upload, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Variacao {
  id: string;
  nome: string;
  produto: { nome: string };
}

interface KitItem {
  variacaoProdutoId: string;
  quantidade: number;
  variacaoNome?: string;
  produtoNome?: string;
}

export default function NovoKitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    sku: "",
    preco: "",
    imagemUrl: "",
    ativo: true,
  });

  const [itens, setItens] = useState<KitItem[]>([]);
  const [newItem, setNewItem] = useState({
    variacaoProdutoId: "",
    quantidade: "1",
  });

  useEffect(() => {
    fetchVariacoes();
  }, []);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await fetch("/api/storage", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao fazer upload");

      const data = await res.json();
      setFormData((prev) => ({ ...prev, imagemUrl: data.url }));
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddItem = () => {
    if (!newItem.variacaoProdutoId || !newItem.quantidade) {
      toast.error("Selecione uma variação e quantidade");
      return;
    }

    const variacao = variacoes.find((v) => v.id === newItem.variacaoProdutoId);
    if (!variacao) return;

    // Verificar se já existe
    if (itens.some((i) => i.variacaoProdutoId === newItem.variacaoProdutoId)) {
      toast.error("Este item já foi adicionado");
      return;
    }

    setItens([
      ...itens,
      {
        variacaoProdutoId: newItem.variacaoProdutoId,
        quantidade: parseInt(newItem.quantidade),
        variacaoNome: variacao.nome,
        produtoNome: variacao.produto.nome,
      },
    ]);

    setNewItem({ variacaoProdutoId: "", quantidade: "1" });
    setAddItemDialogOpen(false);
    toast.success("Item adicionado ao kit");
  };

  const handleRemoveItem = (variacaoId: string) => {
    setItens(itens.filter((item) => item.variacaoProdutoId !== variacaoId));
    toast.success("Item removido do kit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item ao kit");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/kits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco),
          itens: itens.map((item) => ({
            variacaoProdutoId: item.variacaoProdutoId,
            quantidade: item.quantidade,
          })),
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar kit");

      const data = await res.json();
      toast.success("Kit criado com sucesso!");
      router.push(`/kits/${data.id}`);
    } catch (error) {
      toast.error("Erro ao criar kit");
    } finally {
      setLoading(false);
    }
  };

  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/kits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Kit</h1>
          <p className="text-muted-foreground">
            Crie um combo ou pacote promocional
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais do kit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Kit *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: Kit Skincare Completo"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="Ex: KIT-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preco">Preço de Venda *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) =>
                    setFormData({ ...formData, preco: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem do Kit</Label>
              <div className="flex flex-col gap-4">
                {formData.imagemUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={formData.imagemUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="imagem"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="flex-1"
                  />
                  {formData.imagemUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({ ...formData, imagemUrl: "" })
                      }
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ativo">Kit Ativo</Label>
                <p className="text-sm text-muted-foreground">
                  Kit disponível para venda
                </p>
              </div>
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, ativo: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Itens do Kit */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Itens do Kit</CardTitle>
                <CardDescription>
                  {itens.length === 0
                    ? "Adicione produtos ao kit"
                    : `${itens.length} ${itens.length === 1 ? "item" : "itens"} • ${totalItens} unidades no total`}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddItemDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {itens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum item adicionado ainda</p>
                <p className="text-sm">Clique em &quot;Adicionar Item&quot; para começar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {itens.map((item) => (
                  <div
                    key={item.variacaoProdutoId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.produtoNome}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.variacaoNome} • {item.quantidade}x
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.variacaoProdutoId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Link href="/kits" className="flex-1 sm:flex-none">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
            {loading ? "Criando..." : "Criar Kit"}
          </Button>
        </div>
      </form>

      {/* Dialog Adicionar Item */}
      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Item ao Kit</DialogTitle>
            <DialogDescription>
              Selecione a variação e quantidade
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="variacao">Produto/Variação *</Label>
              <Select
                value={newItem.variacaoProdutoId}
                onValueChange={(value) =>
                  setNewItem({ ...newItem, variacaoProdutoId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma variação" />
                </SelectTrigger>
                <SelectContent>
                  {variacoes.map((variacao) => (
                    <SelectItem key={variacao.id} value={variacao.id}>
                      {variacao.produto.nome} - {variacao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={newItem.quantidade}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantidade: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddItemDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddItem}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
