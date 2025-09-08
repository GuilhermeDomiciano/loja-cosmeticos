import { transacaoFinanceiraController } from "@/core/controllers/transacaoFinanceiraController";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return transacaoFinanceiraController.atualizar(req, { id });
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return transacaoFinanceiraController.deletar(req, { id });
}
