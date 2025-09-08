import { variacaoProdutoController } from "@/core/controllers/variacaoProdutoController";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return variacaoProdutoController.atualizar(req, { id });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return variacaoProdutoController.deletar(req, { id });
}
