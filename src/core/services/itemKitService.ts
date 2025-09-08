import { ItemKitCreateInput, ItemKitUpdateInput } from "../models/itemKitSchema";
import { ItemKitRepository, itemKitRepository } from "../repositories/itemKitRepository";

export class ItemKitService {
  constructor(private readonly repo: ItemKitRepository) {}
  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async criar(input: ItemKitCreateInput) { return this.repo.criar(input); }
  async atualizar(id: string, input: ItemKitUpdateInput) { const existing = await this.repo.buscarPorId(id); if (!existing) return null; return this.repo.atualizar(id, input); }
  async deletar(id: string) { const existing = await this.repo.buscarPorId(id); if (!existing) return false; await this.repo.deletar(id); return true; }
}

export const itemKitService = new ItemKitService(itemKitRepository);

