import { movimentacaoEstoqueController } from "@/core/controllers/movimentacaoEstoqueController";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return movimentacaoEstoqueController.atualizar(req, { id });
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return movimentacaoEstoqueController.deletar(req, { id });
}
