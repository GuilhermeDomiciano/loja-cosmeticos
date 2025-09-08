import { prisma } from "@/lib/prisma";

export class ProdutoRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.produto.findMany({
      where: { organizacaoId },
      orderBy: { criadoEm: "desc" },
    });
  }
  async buscarPorId(id: string) {
    return prisma.produto.findUnique({ where: { id } });
  }
  async criar(data: {
    organizacaoId: string;
    nome: string;
    categoriaId?: string | null;
    descricao?: string | null;
    sku?: string | null;
    ativo?: boolean;
    imagemUrl?: string | null;
  }) {
    return prisma.produto.create({ data });
  }
  async atualizar(
    id: string,
    data: {
      nome?: string;
      categoriaId?: string | null;
      descricao?: string | null;
      sku?: string | null;
      ativo?: boolean;
      imagemUrl?: string | null;
    }
  ) {
    return prisma.produto.update({ where: { id }, data });
  }
  async deletar(id: string) {
    await prisma.produto.delete({ where: { id } });
  }
}

export const produtoRepository = new ProdutoRepository();

