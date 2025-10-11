"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

interface Kit {
  id: string;
  nome: string;
  sku?: string | null;
  preco: number;
  imagemUrl?: string | null;
  ativo: boolean;
  itens: Array<{
    id: string;
    quantidade: number;
    variacaoProduto: {
      id: string;
      nome: string;
      preco: number;
      produto: { nome: string };
    };
  }>;
}

export default function KitDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchKit();
    }
  }, [params.id]);

  const fetchKit = async () => {
    try {
      const res = await fetch(`/api/kits/${params.id}`);
      if (!res.ok) throw new Error("Erro ao carregar kit");
      const data = await res.json();
      setKit(data);
    } catch (error) {
      toast.error("Erro ao carregar kit");
      router.push("/kits");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/kits/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar kit");

      toast.success("Kit deletado com sucesso!");
      router.push("/kits");
    } catch (error) {
      toast.error("Erro ao deletar kit");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!kit) {
    return null;
  }

  // Calcular custo total baseado nos itens
  const custoTotal = kit.itens.reduce((acc, item) => {
    return acc + (item.variacaoProduto.preco * item.quantidade);
  }, 0);

  const margem = kit.preco - custoTotal;
  const margemPercentual = custoTotal > 0 ? ((margem / custoTotal) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/kits">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{kit.nome}</h1>
            {kit.sku && (
              <p className="text-muted-foreground">SKU: {kit.sku}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/kits/${kit.id}/editar`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            Deletar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Imagem e Informações Básicas */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-4">
              {kit.imagemUrl ? (
                <Image
                  src={kit.imagemUrl}
                  alt={kit.nome}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={kit.ativo ? "default" : "secondary"}>
                  {kit.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Preço de Venda
                </span>
                <span className="text-2xl font-bold text-primary">
                  R$ {kit.preco.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total de Itens
                </span>
                <span className="font-medium">{kit.itens.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análise Financeira */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análise Financeira
            </CardTitle>
            <CardDescription>
              Custo e margem de lucro do kit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Custo Total dos Itens
                </span>
                <span className="font-medium">
                  R$ {custoTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Preço de Venda
                </span>
                <span className="font-medium">
                  R$ {kit.preco.toFixed(2)}
                </span>
              </div>

              <div className="h-px bg-border my-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Margem de Lucro</span>
                <div className="text-right">
                  <span className={`text-lg font-bold ${margem >= 0 ? "text-green-600" : "text-red-600"}`}>
                    R$ {margem.toFixed(2)}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {margemPercentual.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {margem < 0 && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                ⚠️ Atenção: Este kit está sendo vendido com prejuízo!
              </div>
            )}

            {margem === 0 && (
              <div className="bg-yellow-500/10 text-yellow-600 text-sm p-3 rounded-lg">
                ℹ️ Este kit está sendo vendido no preço de custo (sem margem).
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Itens do Kit */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Kit</CardTitle>
          <CardDescription>
            {kit.itens.length} {kit.itens.length === 1 ? "item incluído" : "itens incluídos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {kit.itens.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.variacaoProduto.produto.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.variacaoProduto.nome}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.quantidade}x</p>
                  <p className="text-xs text-muted-foreground">
                    R$ {item.variacaoProduto.preco.toFixed(2)} cada
                  </p>
                  <p className="text-sm font-semibold">
                    R$ {(item.variacaoProduto.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog Deletar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Kit</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o kit "{kit.nome}"? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deletando..." : "Deletar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
