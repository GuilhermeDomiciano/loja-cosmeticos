import { itemKitController } from "@/core/controllers/itemKitController";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return itemKitController.atualizar(req, { id });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return itemKitController.deletar(req, { id });
}
