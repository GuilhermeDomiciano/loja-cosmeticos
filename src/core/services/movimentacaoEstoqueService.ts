import { MovimentacaoEstoqueCreateInput, MovimentacaoEstoqueUpdateInput } from "../models/movimentacaoEstoqueSchema";
import { MovimentacaoEstoqueRepository, movimentacaoEstoqueRepository } from "../repositories/movimentacaoEstoqueRepository";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export class MovimentacaoEstoqueService {
  constructor(private readonly repo: MovimentacaoEstoqueRepository) {}

  async listar(organizacaoId: string) { return this.repo.listarPorOrganizacao(organizacaoId); }
  async criar(input: MovimentacaoEstoqueCreateInput) {
    const user = await requireAuth();
    const organizacaoId = user.organizacaoId;
    if (!organizacaoId) throw new Error("Usuário sem organização");

    const ids = input as { variacaoId?: string; variacaoProdutoId?: string };
    const variacaoId = ids.variacaoId ?? ids.variacaoProdutoId;
    if (!variacaoId) throw new Error("variacaoId é obrigatório");

    if (input.tipo === "SAIDA") {
      let restante = parseFloat((input.quantidade as unknown as string) ?? "0");
      if (!(restante > 0)) throw new Error("Quantidade inválida");

      const lotes = await prisma.loteEstoque.findMany({
        where: { organizacaoId, variacaoId, quantidade: { gt: "0" } },
        orderBy: [
          { venceEm: "asc" },
          { criadoEm: "asc" },
        ],
      });
      const totalDisponivel = lotes.reduce((acc, l) => acc + parseFloat(l.quantidade as unknown as string), 0);
      if (totalDisponivel + 1e-9 < restante) {
        throw new Error("Estoque insuficiente");
      }

      type CreatedMov = Awaited<ReturnType<MovimentacaoEstoqueRepository["criar"]>>;
      const created: CreatedMov[] = [];
      for (const lote of lotes) {
        if (restante <= 0) break;
        const disponivel = parseFloat(lote.quantidade as unknown as string);
        if (disponivel <= 0) continue;
        const usar = Math.min(disponivel, restante);
        // baixa no lote
        await prisma.loteEstoque.update({ where: { id: lote.id }, data: { quantidade: (disponivel - usar).toString() } });
        // cria movimentação vinculada ao lote (parcial)
        const mov = await this.repo.criar({
          organizacaoId,
          variacaoId,
          loteId: lote.id,
          vendedorId: input.vendedorId ?? null,
          tipo: input.tipo,
          motivo: input.motivo,
          quantidade: usar.toString(),
          precoUnitario: input.precoUnitario ?? null,
          total: input.total ?? null,
          canal: input.canal ?? null,
          observacoes: input.observacoes ?? null,
        });
        created.push(mov);
        restante -= usar;
      }
      return created;
    }

    // ENTRADA: se houver loteId, incrementa; caso contrário, cria novo lote
    if (input.tipo === "ENTRADA") {
      const qtd = parseFloat((input.quantidade as unknown as string) ?? "0");
      if (!(qtd > 0)) throw new Error("Quantidade inválida");
      let loteId = input.loteId as string | undefined;
      if (loteId) {
        const lote = await prisma.loteEstoque.findUnique({ where: { id: loteId } });
        if (!lote) throw new Error("Lote não encontrado");
        await prisma.loteEstoque.update({ where: { id: loteId }, data: { quantidade: (parseFloat(lote.quantidade as unknown as string) + qtd).toString() } });
      } else {
        const novo = await prisma.loteEstoque.create({ data: { organizacaoId, variacaoId, quantidade: qtd.toString() } });
        loteId = novo.id;
      }
      return this.repo.criar({
        organizacaoId,
        variacaoId,
        loteId,
        vendedorId: input.vendedorId ?? null,
        tipo: input.tipo,
        motivo: input.motivo,
        quantidade: input.quantidade as unknown as string,
        precoUnitario: input.precoUnitario ?? null,
        total: input.total ?? null,
        canal: input.canal ?? null,
        observacoes: input.observacoes ?? null,
      });
    }

    // fallback (cria uma única movimentação)
    return this.repo.criar({
      organizacaoId,
      variacaoId: variacaoId!,
      loteId: input.loteId ?? null,
      vendedorId: input.vendedorId ?? null,
      tipo: input.tipo,
      motivo: input.motivo,
      quantidade: input.quantidade,
      precoUnitario: input.precoUnitario ?? null,
      total: input.total ?? null,
      canal: input.canal ?? null,
      observacoes: input.observacoes ?? null,
    });
  }
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
