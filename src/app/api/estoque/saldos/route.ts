import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user.organizacaoId) return NextResponse.json({ message: "Usuário sem organização" }, { status: 400 });
    const { variacaoIds } = await req.json();
    if (!Array.isArray(variacaoIds) || variacaoIds.length === 0) {
      return NextResponse.json({ message: "variacaoIds requerido" }, { status: 400 });
    }

    const lotes = await prisma.loteEstoque.groupBy({
      by: ["variacaoId"],
      where: { organizacaoId: user.organizacaoId, variacaoId: { in: variacaoIds } },
      _sum: { quantidade: true },
    });
    const map: Record<string, number> = {};
    for (const l of lotes) {
      map[l.variacaoId] = parseFloat((l._sum.quantidade as unknown as string) ?? "0");
    }
    // garantir entradas faltantes
    for (const id of variacaoIds) if (map[id] === undefined) map[id] = 0;
    return NextResponse.json({ saldos: map });
  } catch (e) {
    return NextResponse.json({ message: "Erro" }, { status: 500 });
  }
}

