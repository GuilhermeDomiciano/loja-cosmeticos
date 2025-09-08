import { prisma } from "@/lib/prisma";

export class LoteEstoqueRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.loteEstoque.findMany({
      where: { organizacaoId },
      orderBy: { criadoEm: "desc" },
    });
  }
  async buscarPorId(id: string) { return prisma.loteEstoque.findUnique({ where: { id } }); }
  async criar(data: { organizacaoId: string; variacaoId: string; codigo?: string | null; quantidade: string; venceEm?: string | null; }) {
    return prisma.loteEstoque.create({
      data: {
        ...data,
        venceEm: data.venceEm ? new Date(data.venceEm) : undefined,
      },
    });
  }
  async atualizar(id: string, data: { codigo?: string | null; quantidade?: string; venceEm?: string | null; }) {
    return prisma.loteEstoque.update({
      where: { id },
      data: {
        ...data,
        venceEm: data.venceEm === undefined ? undefined : (data.venceEm ? new Date(data.venceEm) : null),
      },
    });
  }
  async deletar(id: string) { await prisma.loteEstoque.delete({ where: { id } }); }
}

export const loteEstoqueRepository = new LoteEstoqueRepository();

