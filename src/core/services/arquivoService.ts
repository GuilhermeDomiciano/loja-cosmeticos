import { ArquivoCreateInput, ArquivoUpdateInput } from "../models/arquivoSchema";
import { ArquivoRepository, arquivoRepository } from "../repositories/arquivoRepository";

export class ArquivoService {
  constructor(private readonly repo: ArquivoRepository) {}
  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async criar(input: ArquivoCreateInput) { return this.repo.criar(input); }
  async atualizar(id: string, input: ArquivoUpdateInput) { const existing = await this.repo.buscarPorId(id); if (!existing) return null; return this.repo.atualizar(id, input); }
  async deletar(id: string) { const existing = await this.repo.buscarPorId(id); if (!existing) return false; await this.repo.deletar(id); return true; }
}

export const arquivoService = new ArquivoService(arquivoRepository);

