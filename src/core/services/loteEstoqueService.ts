import { LoteEstoqueCreateInput, LoteEstoqueUpdateInput } from "../models/loteEstoqueSchema";
import { LoteEstoqueRepository, loteEstoqueRepository } from "../repositories/loteEstoqueRepository";

export class LoteEstoqueService {
  constructor(private readonly repo: LoteEstoqueRepository) {}

  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async criar(input: LoteEstoqueCreateInput) { return this.repo.criar(input); }
  async atualizar(id: string, input: LoteEstoqueUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    return this.repo.atualizar(id, input);
  }
  async deletar(id: string) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return false;
    await this.repo.deletar(id); return true;
  }
}

export const loteEstoqueService = new LoteEstoqueService(loteEstoqueRepository);

