import { Prisma } from "@prisma/client";
import { ProdutoCreateInput, ProdutoUpdateInput } from "../models/produtoSchema";
import { ProdutoRepository, produtoRepository } from "../repositories/produtoRepository";

export class ProdutoService {
  constructor(private readonly repo: ProdutoRepository) {}

  async listar(organizacaoId: string) {
    return this.repo.listarPorOrganizacao(organizacaoId);
  }

  async criar(input: ProdutoCreateInput) {
    try {
      return await this.repo.criar(input);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Produto já existe (nome/sku) para esta organização");
      }
      throw err;
    }
  }

  async atualizar(id: string, input: ProdutoUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    try {
      return await this.repo.atualizar(id, input);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Produto já existe (nome/sku) para esta organização");
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

export const produtoService = new ProdutoService(produtoRepository);

