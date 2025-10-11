"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Plus, Package, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

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

interface Variacao {
  id: string;
  nome: string;
  sku?: string | null;
  preco: number;
  quantidade: number;
  unidade: string;
  ativa: boolean;
}

export default function ProdutoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduto();
    fetchVariacoes();
  }, [params.id]);

  const fetchProduto = async () => {
    try {
      const res = await fetch(`/api/produtos/${params.id}`);
      if (!res.ok) throw new Error("Erro ao carregar produto");
      const data = await res.json();
      setProduto(data);
    } catch (error) {
      toast.error("Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  };

  const fetchVariacoes = async () => {
    try {
      const res = await fetch("/api/variacoes");
      if (!res.ok) throw new Error("Erro ao carregar variações");
      const data = await res.json();
      // Filtrar variações deste produto
      const variacoesDoProduto = Array.isArray(data)
        ? data.filter((v: Variacao & { produtoId: string }) => v.produtoId === params.id)
        : [];
      setVariacoes(variacoesDoProduto);
    } catch (error) {
      console.error("Erro ao carregar variações");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Produto não encontrado</p>
        <Button onClick={() => router.push("/produtos")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Produtos
        </Button>
      </div>
    );
  }

  const estoqueTotal = variacoes.reduce((acc, v) => acc + v.quantidade, 0);
  const precoMedio =
    variacoes.length > 0
      ? variacoes.reduce((acc, v) => acc + v.preco, 0) / variacoes.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/produtos")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{produto.nome}</h1>
          <p className="text-muted-foreground mt-1">Detalhes do produto</p>
        </div>
        <Button onClick={() => router.push(`/produtos/${produto.id}/editar`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Imagem do Produto */}
        {produto.imagemUrl ? (
          <Card className="p-0 overflow-hidden md:col-span-1">
            <div className="aspect-square bg-muted">
              <img
                src={produto.imagemUrl}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        ) : (
          <Card className="p-12 flex items-center justify-center md:col-span-1">
            <div className="text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sem imagem</p>
            </div>
          </Card>
        )}

        {/* Informações */}
        <Card className="p-6 md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={produto.ativo ? "default" : "secondary"}>
                {produto.ativo ? "Ativo" : "Inativo"}
              </Badge>
              {produto.categoria && (
                <Badge variant="outline">{produto.categoria.nome}</Badge>
              )}
            </div>

            {produto.sku && (
              <div>
                <p className="text-sm text-muted-foreground">SKU</p>
                <p className="font-medium">{produto.sku}</p>
              </div>
            )}

            {produto.descricao && (
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="text-sm">{produto.descricao}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Variações</p>
                <p className="text-2xl font-bold">{variacoes.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estoque Total</p>
                <p className="text-2xl font-bold">{estoqueTotal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preço Médio</p>
                <p className="text-2xl font-bold">
                  R$ {precoMedio.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Variações */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Variações</h2>
            <p className="text-muted-foreground">
              Diferentes tamanhos, cores ou versões deste produto
            </p>
          </div>
          <Link href="/variacoes">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Variação
            </Button>
          </Link>
        </div>

        {variacoes.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <Box className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhuma variação cadastrada para este produto
            </p>
            <Link href="/variacoes">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Variação
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {variacoes.map((variacao) => (
              <Card key={variacao.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{variacao.nome}</h3>
                    {variacao.sku && (
                      <p className="text-xs text-muted-foreground">
                        SKU: {variacao.sku}
                      </p>
                    )}
                  </div>
                  <Badge variant={variacao.ativa ? "default" : "secondary"}>
                    {variacao.ativa ? "Ativa" : "Inativa"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="font-medium">
                      R$ {variacao.preco.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estoque:</span>
                    <span
                      className={`font-medium ${
                        variacao.quantidade < 10
                          ? "text-red-600"
                          : variacao.quantidade < 50
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {variacao.quantidade} {variacao.unidade}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
