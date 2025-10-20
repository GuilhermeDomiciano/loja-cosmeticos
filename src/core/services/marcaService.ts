import { Prisma } from "@prisma/client";
import { MarcaCreateInput, MarcaUpdateInput } from "../models/marcaSchema";
import { MarcaRepository, marcaRepository } from "../repositories/marcaRepository";

export class MarcaService {
  constructor(private readonly repo: MarcaRepository) {}

  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async buscarPorId(id: string) { return this.repo.buscarPorId(id); }

  async criar(input: MarcaCreateInput) {
    try { return await this.repo.criar(input); }
    catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Marca já existe para esta organização");
      }
      throw err;
    }
  }

  async atualizar(id: string, input: MarcaUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    try { return await this.repo.atualizar(id, input); }
    catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Marca já existe para esta organização");
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

export const marcaService = new MarcaService(marcaRepository);

