import { prisma } from "@/lib/prisma";

export class ItemKitRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.itemKit.findMany({ where: { organizacaoId } });
  }
  async buscarPorId(id: string) { return prisma.itemKit.findUnique({ where: { id } }); }
  async criar(data: { organizacaoId: string; kitId: string; variacaoId: string; quantidade: string; }) { return prisma.itemKit.create({ data }); }
  async atualizar(id: string, data: { quantidade: string }) { return prisma.itemKit.update({ where: { id }, data }); }
  async deletar(id: string) { await prisma.itemKit.delete({ where: { id } }); }
}

export const itemKitRepository = new ItemKitRepository();

