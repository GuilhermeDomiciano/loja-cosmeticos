import { Prisma } from "@prisma/client";
import { KitCreateInput, KitUpdateInput } from "../models/kitSchema";
import { KitRepository, kitRepository } from "../repositories/kitRepository";

export class KitService {
  constructor(private readonly repo: KitRepository) {}

  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async criar(input: KitCreateInput) {
    try { return await this.repo.criar(input); }
    catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Kit já existe (nome/sku) para esta organização");
      }
      throw err;
    }
  }
  async atualizar(id: string, input: KitUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    try { return await this.repo.atualizar(id, input); }
    catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Kit já existe (nome/sku) para esta organização");
      }
      throw err;
    }
  }
  async deletar(id: string) { const existing = await this.repo.buscarPorId(id); if (!existing) return false; await this.repo.deletar(id); return true; }
}

export const kitService = new KitService(kitRepository);

