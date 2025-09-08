import { prisma } from "@/lib/prisma";

export class ArquivoRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.arquivo.findMany({ where: { organizacaoId }, orderBy: { criadoEm: "desc" } });
  }
  async buscarPorId(id: string) { return prisma.arquivo.findUnique({ where: { id } }); }
  async criar(data: { organizacaoId: string; caminho: string; url?: string | null; entidade: string; entidadeId: string; }) { return prisma.arquivo.create({ data }); }
  async atualizar(id: string, data: { caminho?: string; url?: string | null; }) { return prisma.arquivo.update({ where: { id }, data }); }
  async deletar(id: string) { await prisma.arquivo.delete({ where: { id } }); }
}

export const arquivoRepository = new ArquivoRepository();

