"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  itens?: Array<{
    id: string;
    quantidade: number;
    variacaoProduto: {
      nome: string;
      produto: { nome: string };
    };
  }>;
}

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      const res = await fetch("/api/kits");
      if (!res.ok) throw new Error("Erro ao carregar kits");
      const data = await res.json();
      setKits(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar kits");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/kits/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar kit");

      toast.success("Kit deletado com sucesso!");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchKits();
    } catch (error) {
      toast.error("Erro ao deletar kit");
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const filteredKits = kits.filter((kit) =>
    kit.nome.toLowerCase().includes(search.toLowerCase()) ||
    kit.sku?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kits de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie combos e pacotes promocionais
          </p>
        </div>
        <Link href="/kits/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Kit
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredKits.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum kit encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {search
              ? "Tente ajustar sua busca"
              : "Comece criando seu primeiro kit de produtos"}
          </p>
          {!search && (
            <Link href="/kits/novo">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Kit
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredKits.map((kit) => (
            <Card key={kit.id} className="overflow-hidden flex flex-col">
              <Link href={`/kits/${kit.id}`}>
                <div className="aspect-square relative bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  {kit.imagemUrl ? (
                    <Image
                      src={kit.imagemUrl}
                      alt={kit.nome}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  {!kit.ativo && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">Inativo</Badge>
                    </div>
                  )}
                </div>
              </Link>

              <CardContent className="p-4 flex-1">
                <Link href={`/kits/${kit.id}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors cursor-pointer">
                    {kit.nome}
                  </h3>
                </Link>
                {kit.sku && (
                  <p className="text-xs text-muted-foreground mb-2">
                    SKU: {kit.sku}
                  </p>
                )}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">
                    R$ {kit.preco.toFixed(2)}
                  </span>
                </div>
                {kit.itens && kit.itens.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {kit.itens.length} {kit.itens.length === 1 ? "item" : "itens"}
                  </p>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
                <Link href={`/kits/${kit.id}/editar`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(kit.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Deletar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Kit</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este kit? Esta ação não pode ser
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

