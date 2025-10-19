import { Prisma } from "@prisma/client";
import {
  VariacaoProdutoCreateInput,
  VariacaoProdutoUpdateInput,
} from "../models/variacaoProdutoSchema";
import {
  VariacaoProdutoRepository,
  variacaoProdutoRepository,
} from "../repositories/variacaoProdutoRepository";
import { requireAuth } from "@/lib/auth";

export class VariacaoProdutoService {
  constructor(private readonly repo: VariacaoProdutoRepository) {}

  async listar(organizacaoId: string) {
    return this.repo.listarPorOrganizacao(organizacaoId);
  }

  async criar(input: VariacaoProdutoCreateInput) {
    try {
      let organizacaoId = (input as any).organizacaoId as string | undefined;
      if (!organizacaoId) {
        const user = await requireAuth();
        if (!user.organizacaoId) throw new Error("Usuário sem organização");
        organizacaoId = user.organizacaoId;
      }
      return await this.repo.criar({
        ...input,
        organizacaoId,
        unidade: input.unidade,
      });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Variação já existe (sku) para esta organização");
      }
      throw err;
    }
  }

  async atualizar(id: string, input: VariacaoProdutoUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    try {
      return await this.repo.atualizar(id, { ...input });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Variação já existe (sku) para esta organização");
      }
      throw err;
    }
  }

  async deletar(id: string) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return false;
    await this.repo.deletar(id);
    return true;
  }
}

export const variacaoProdutoService = new VariacaoProdutoService(variacaoProdutoRepository);
