import { TransacaoFinanceiraCreateInput, TransacaoFinanceiraUpdateInput } from "../models/transacaoFinanceiraSchema";
import { TransacaoFinanceiraRepository, transacaoFinanceiraRepository } from "../repositories/transacaoFinanceiraRepository";

export class TransacaoFinanceiraService {
  constructor(private readonly repo: TransacaoFinanceiraRepository) {}
  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async criar(input: TransacaoFinanceiraCreateInput) { return this.repo.criar(input); }
  async atualizar(id: string, input: TransacaoFinanceiraUpdateInput) { const existing = await this.repo.buscarPorId(id); if (!existing) return null; return this.repo.atualizar(id, input); }
  async deletar(id: string) { const existing = await this.repo.buscarPorId(id); if (!existing) return false; await this.repo.deletar(id); return true; }
}

export const transacaoFinanceiraService = new TransacaoFinanceiraService(transacaoFinanceiraRepository);

