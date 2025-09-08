import { Prisma } from "@prisma/client";
import {
  UsuarioCreateInput,
  UsuarioUpdateInput,
} from "../models/usuarioSchema";
import { UsuarioRepository, usuarioRepository } from "../repositories/usuarioRepository";

export class UsuarioService {
  constructor(private readonly repo: UsuarioRepository) {}

  async listar(organizacaoId: string) {
    return this.repo.listarPorOrganizacao(organizacaoId);
  }

  async criar(input: UsuarioCreateInput) {
    try {
      return await this.repo.criar(input);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Usuário já existe");
      }
      throw err;
    }
  }

  async atualizar(id: string, input: UsuarioUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    try {
      return await this.repo.atualizar(id, input);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new Error("Usuário já existe");
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

export const usuarioService = new UsuarioService(usuarioRepository);

