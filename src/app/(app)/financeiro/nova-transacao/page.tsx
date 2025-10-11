"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

export default function NovaTransacaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    valor: "",
    descricao: "",
    dataVencimento: "",
    metodoPagamento: "",
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipo || !formData.valor || !formData.descricao || !formData.dataVencimento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transacoes-financeiras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valor: parseFloat(formData.valor),
          status: "PENDENTE",
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar transação");

      toast.success("Transação criada com sucesso!");
      router.push("/financeiro");
    } catch (error) {
      toast.error("Erro ao criar transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/financeiro">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nova Transação</h1>
          <p className="text-muted-foreground">
            Registre uma conta a pagar ou receber
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Transação</CardTitle>
            <CardDescription>Preencha os dados da transação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEBER">A Receber</SelectItem>
                    <SelectItem value="PAGAR">A Pagar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData({ ...formData, valor: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Ex: Venda de produtos, Pagamento de fornecedor..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) =>
                    setFormData({ ...formData, dataVencimento: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
                <Select
                  value={formData.metodoPagamento}
                  onValueChange={(value) =>
                    setFormData({ ...formData, metodoPagamento: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                    <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                    <SelectItem value="OUTRO">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                placeholder="Informações adicionais (opcional)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 mt-6">
          <Link href="/financeiro" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
            {loading ? "Criando..." : "Criar Transação"}
          </Button>
        </div>
      </form>
    </div>
  );
}
