import { prisma } from "@/lib/prisma";


export type CategoriaRecord = {
  id: string;
  organizacaoId: string;
  nome: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

export class CategoriaRepository {
  async listarPorOrganizacao(organizacaoId: string): Promise<CategoriaRecord[]> {
    return prisma.categoria.findMany({
      where: { organizacaoId },
      orderBy: { nome: "asc" },
    });
  }

  async buscarPorId(id: string): Promise<CategoriaRecord | null> {
    return prisma.categoria.findUnique({ where: { id } });
  }

  async criar(data: { organizacaoId: string; nome: string }): Promise<CategoriaRecord> {
    return prisma.categoria.create({ data });
  }

  async atualizar(id: string, data: { nome: string }): Promise<CategoriaRecord> {
    return prisma.categoria.update({ where: { id }, data });
  }

  async deletar(id: string): Promise<void> {
    await prisma.categoria.delete({ where: { id } });
  }
}

export const categoriaRepository = new CategoriaRepository();

