import { Prisma } from "@prisma/client";
import {
  OrganizacaoCreateInput,
  OrganizacaoUpdateInput,
} from "../models/organizacaoSchema";
import {
  OrganizacaoRepository,
  organizacaoRepository,
} from "../repositories/organizacaoRepository";

export class OrganizacaoService {
  constructor(private readonly repo: OrganizacaoRepository) {}

  async listar() {
    return this.repo.listarTodos();
  }

  async criar(input: OrganizacaoCreateInput) {
    try {
      return await this.repo.criar({ nome: input.nome });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Organização já existe");
        }
      }
      throw err;
    }
  }

  async atualizar(id: string, input: OrganizacaoUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    try {
      return await this.repo.atualizar(id, { nome: input.nome });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Organização já existe");
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

export const organizacaoService = new OrganizacaoService(organizacaoRepository);

