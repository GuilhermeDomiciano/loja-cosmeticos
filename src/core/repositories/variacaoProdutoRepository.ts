import { prisma } from "@/lib/prisma";

export class VariacaoProdutoRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.variacaoProduto.findMany({
      where: { organizacaoId },
      orderBy: { criadoEm: "desc" },
    });
  }
  async buscarPorId(id: string) {
    return prisma.variacaoProduto.findUnique({ where: { id } });
  }
  async criar(data: {
    organizacaoId: string;
    produtoId: string;
    nome?: string | null;
    sku?: string | null;
    unidade?: string; // enum string
    codigoBarras?: string | null;
    preco: string; // Decimal as string
    custo?: string | null;
    estoqueMinimo?: string | null;
  }) {
    return prisma.variacaoProduto.create({
      data: {
        ...data,
        unidade: (data.unidade as any) ?? undefined,
      },
    });
  }
  async atualizar(
    id: string,
    data: {
      nome?: string | null;
      sku?: string | null;
      unidade?: string; // enum string
      codigoBarras?: string | null;
      preco?: string;
      custo?: string | null;
      estoqueMinimo?: string | null;
    }
  ) {
    return prisma.variacaoProduto.update({
      where: { id },
      data: {
        ...data,
        unidade: (data.unidade as any) ?? undefined,
      },
    });
  }
  async deletar(id: string) {
    await prisma.variacaoProduto.delete({ where: { id } });
  }
}

export const variacaoProdutoRepository = new VariacaoProdutoRepository();

