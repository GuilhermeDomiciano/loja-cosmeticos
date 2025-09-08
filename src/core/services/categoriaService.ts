import { Prisma } from "@prisma/client";
import {
  CategoriaCreateInput,
  CategoriaUpdateInput,
} from "../models/categoriaSchema";
import { CategoriaRepository, categoriaRepository } from "../repositories/categoriaRepository";

export class CategoriaService {
  constructor(private readonly repo: CategoriaRepository) {}

  async listar(organizacaoId: string) {
    return this.repo.listarPorOrganizacao(organizacaoId);
  }

  async criar(input: CategoriaCreateInput) {
    try {
      const created = await this.repo.criar({
        organizacaoId: input.organizacaoId,
        nome: input.nome,
      });
      return created;
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Categoria já existe para esta organização");
        }
      }
      throw err;
    }
  }

  async atualizar(id: string, input: CategoriaUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;

    try {
      const updated = await this.repo.atualizar(id, { nome: input.nome });
      return updated;
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Categoria já existe para esta organização");
        }
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

export const categoriaService = new CategoriaService(categoriaRepository);

