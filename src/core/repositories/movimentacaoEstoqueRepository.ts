import { prisma } from "@/lib/prisma";
import type { CanalVenda, MotivoMovimentacao, TipoMovimentacao } from "@prisma/client";

export class MovimentacaoEstoqueRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.movimentacaoEstoque.findMany({ where: { organizacaoId }, orderBy: { criadoEm: "desc" } });
  }
  async buscarPorId(id: string) { return prisma.movimentacaoEstoque.findUnique({ where: { id } }); }
  async criar(data: {
    organizacaoId: string;
    variacaoId: string;
    loteId?: string | null;
    tipo: TipoMovimentacao;
    motivo: MotivoMovimentacao;
    quantidade: string;
    precoUnitario?: string | null;
    total?: string | null;
    canal?: CanalVenda | null;
    observacoes?: string | null;
  }) {
    const createData = {
      ...data,
      loteId: data.loteId ?? undefined,
    };
    return prisma.movimentacaoEstoque.create({ data: createData });
  }
  async atualizar(
    id: string,
    data: {
      loteId?: string | null;
      tipo?: TipoMovimentacao;
      motivo?: MotivoMovimentacao;
      quantidade?: string;
      precoUnitario?: string | null;
      total?: string | null;
      canal?: CanalVenda | null;
      observacoes?: string | null;
    }
  ) {
    const { loteId, ...rest } = data;
    const updateData = {
      ...rest,
      ...(loteId === undefined ? {} : { loteId }),
    };
    return prisma.movimentacaoEstoque.update({ where: { id }, data: updateData });
  }
  async deletar(id: string) { await prisma.movimentacaoEstoque.delete({ where: { id } }); }
}

export const movimentacaoEstoqueRepository = new MovimentacaoEstoqueRepository();
