import { categoriaController } from "../../../../core/controllers/categoriaController";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return categoriaController.atualizar(req, { id });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return categoriaController.deletar(req, { id });
}
