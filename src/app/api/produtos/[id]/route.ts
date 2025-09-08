import { produtoController } from "@/core/controllers/produtoController";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return produtoController.atualizar(req, { id });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return produtoController.deletar(req, { id });
}
