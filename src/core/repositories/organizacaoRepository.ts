import { prisma } from "@/lib/prisma";

export type OrganizacaoRecord = {
  id: string;
  nome: string;
  criadoEm: Date;
};

export class OrganizacaoRepository {
  async listarTodos(): Promise<OrganizacaoRecord[]> {
    return prisma.organizacao.findMany({ orderBy: { criadoEm: "desc" } });
  }

  async buscarPorId(id: string): Promise<OrganizacaoRecord | null> {
    return prisma.organizacao.findUnique({ where: { id } });
  }

  async criar(data: { nome: string }): Promise<OrganizacaoRecord> {
    return prisma.organizacao.create({ data });
  }

  async atualizar(id: string, data: { nome: string }): Promise<OrganizacaoRecord> {
    return prisma.organizacao.update({ where: { id }, data });
  }

  async deletar(id: string): Promise<void> {
    await prisma.organizacao.delete({ where: { id } });
  }
}

export const organizacaoRepository = new OrganizacaoRepository();

