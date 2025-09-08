import { MovimentacaoEstoqueCreateInput, MovimentacaoEstoqueUpdateInput } from "../models/movimentacaoEstoqueSchema";
import { MovimentacaoEstoqueRepository, movimentacaoEstoqueRepository } from "../repositories/movimentacaoEstoqueRepository";

export class MovimentacaoEstoqueService {
  constructor(private readonly repo: MovimentacaoEstoqueRepository) {}

  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async criar(input: MovimentacaoEstoqueCreateInput) { return this.repo.criar(input); }
  async atualizar(id: string, input: MovimentacaoEstoqueUpdateInput) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return null;
    return this.repo.atualizar(id, input);
  }
  async deletar(id: string) {
    const existing = await this.repo.buscarPorId(id);
    if (!existing) return false;
    await this.repo.deletar(id);
    return true;
  }
}

export const movimentacaoEstoqueService = new MovimentacaoEstoqueService(movimentacaoEstoqueRepository);

