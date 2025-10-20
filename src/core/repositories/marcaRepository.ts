import { prisma } from "@/lib/prisma";

export class MarcaRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.marca.findMany({ where: { organizacaoId }, orderBy: { criadoEm: "desc" } });
  }
  async buscarPorId(id: string) { return prisma.marca.findUnique({ where: { id } }); }
  async criar(data: { organizacaoId: string; nome: string }) { return prisma.marca.create({ data }); }
  async atualizar(id: string, data: { nome?: string }) { return prisma.marca.update({ where: { id }, data }); }
  async deletar(id: string) { await prisma.marca.delete({ where: { id } }); }
}

export const marcaRepository = new MarcaRepository();

