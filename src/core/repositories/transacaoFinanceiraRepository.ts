import { prisma } from "@/lib/prisma";
import type { MetodoPagamento, StatusTransacao, TipoTransacao } from "@prisma/client";

export class TransacaoFinanceiraRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.transacaoFinanceira.findMany({ where: { organizacaoId }, orderBy: { criadoEm: "desc" } });
  }
  async buscarPorId(id: string) { return prisma.transacaoFinanceira.findUnique({ where: { id } }); }
  async criar(data: {
    organizacaoId: string;
    tipo: TipoTransacao;
    status?: StatusTransacao;
    metodo?: MetodoPagamento | null;
    valor: string;
    dataVencimento?: string | null;
    pagoEm?: string | null;
    descricao?: string | null;
    movimentacaoId?: string | null;
  }) {
    const { dataVencimento, pagoEm, movimentacaoId, ...rest } = data;
    const createData: any = {
      ...rest,
      dataVencimento: dataVencimento ? new Date(dataVencimento) : undefined,
      pagoEm: pagoEm ? new Date(pagoEm) : undefined,
      movimentacaoId: movimentacaoId ?? undefined,
    };
    return prisma.transacaoFinanceira.create({ data: createData });
  }
  async atualizar(
    id: string,
    data: {
      tipo?: TipoTransacao;
      status?: StatusTransacao;
      metodo?: MetodoPagamento | null;
      valor?: string;
      dataVencimento?: string | null;
      pagoEm?: string | null;
      descricao?: string | null;
      movimentacaoId?: string | null;
    }
  ) {
    const { dataVencimento, pagoEm, movimentacaoId, ...rest } = data;
    const updateData: any = {
      ...rest,
      dataVencimento:
        dataVencimento === undefined ? undefined : dataVencimento ? new Date(dataVencimento) : null,
      pagoEm: pagoEm === undefined ? undefined : pagoEm ? new Date(pagoEm) : null,
      ...(movimentacaoId === undefined ? {} : { movimentacaoId }),
    };
    return prisma.transacaoFinanceira.update({ where: { id }, data: updateData });
  }
  async deletar(id: string) { await prisma.transacaoFinanceira.delete({ where: { id } }); }
}

export const transacaoFinanceiraRepository = new TransacaoFinanceiraRepository();
