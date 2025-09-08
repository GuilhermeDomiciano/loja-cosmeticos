import { loteEstoqueController } from "@/core/controllers/loteEstoqueController";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return loteEstoqueController.atualizar(req, { id });
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return loteEstoqueController.deletar(req, { id });
}
