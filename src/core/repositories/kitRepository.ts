import { prisma } from "@/lib/prisma";

export class KitRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.kit.findMany({ where: { organizacaoId }, orderBy: { criadoEm: "desc" } });
  }
  async buscarPorId(id: string) { return prisma.kit.findUnique({ where: { id } }); }
  async criar(data: { organizacaoId: string; nome: string; sku?: string | null; preco: string; ativo?: boolean; imagemUrl?: string | null; }) {
    return prisma.kit.create({ data });
  }
  async atualizar(id: string, data: { nome?: string; sku?: string | null; preco?: string; ativo?: boolean; imagemUrl?: string | null; }) {
    return prisma.kit.update({ where: { id }, data });
  }
  async deletar(id: string) { await prisma.kit.delete({ where: { id } }); }
}

export const kitRepository = new KitRepository();

