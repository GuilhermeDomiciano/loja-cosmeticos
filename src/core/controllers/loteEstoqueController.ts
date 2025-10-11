import { NextResponse } from "next/server";
import { loteEstoqueCreateSchema, loteEstoqueUpdateSchema } from "../models/loteEstoqueSchema";
import { LoteEstoqueService, loteEstoqueService } from "../services/loteEstoqueService";
import { requireAuth } from "@/lib/auth";

export class LoteEstoqueController {
  constructor(private readonly service: LoteEstoqueService) {}

  async listar(_req: Request) {
    try {
      const user = await requireAuth();
      if (!user.organizacaoId) {
        return NextResponse.json({ message: "Usuário sem organização" }, { status: 400 });
      }
      const data = await this.service.listar(user.organizacaoId);
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : "Erro ao listar lotes" },
        { status: 500 }
      );
    }
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = loteEstoqueCreateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const created = await this.service.criar(parse.data);
    return NextResponse.json({ data: created, message: "Lote criado" }, { status: 201 });
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = loteEstoqueUpdateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const updated = await this.service.atualizar(id, parse.data);
    if (!updated) return NextResponse.json({ message: "Lote não encontrado" }, { status: 404 });
    return NextResponse.json({ data: updated, message: "Lote atualizado" });
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    const ok = await this.service.deletar(id);
    if (!ok) return NextResponse.json({ message: "Lote não encontrado" }, { status: 404 });
    return NextResponse.json({ data: { id }, message: "Lote deletado" });
  }
}

export const loteEstoqueController = new LoteEstoqueController(loteEstoqueService);

