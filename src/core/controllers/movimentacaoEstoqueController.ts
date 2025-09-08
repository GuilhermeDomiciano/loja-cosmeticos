import { NextResponse } from "next/server";
import { movimentacaoEstoqueCreateSchema, movimentacaoEstoqueUpdateSchema } from "../models/movimentacaoEstoqueSchema";
import { MovimentacaoEstoqueService, movimentacaoEstoqueService } from "../services/movimentacaoEstoqueService";

export class MovimentacaoEstoqueController {
  constructor(private readonly service: MovimentacaoEstoqueService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) return NextResponse.json({ message: "organizacaoId é obrigatório" }, { status: 400 });
    try { const data = await this.service.listar(organizacaoId); return NextResponse.json({ data, message: "Listagem de movimentações" }); }
    catch { return NextResponse.json({ message: "Erro ao listar movimentações" }, { status: 500 }); }
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = movimentacaoEstoqueCreateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const created = await this.service.criar(parse.data);
    return NextResponse.json({ data: created, message: "Movimentação criada" }, { status: 201 });
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = movimentacaoEstoqueUpdateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const updated = await this.service.atualizar(id, parse.data);
    if (!updated) return NextResponse.json({ message: "Movimentação não encontrada" }, { status: 404 });
    return NextResponse.json({ data: updated, message: "Movimentação atualizada" });
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    const ok = await this.service.deletar(id);
    if (!ok) return NextResponse.json({ message: "Movimentação não encontrada" }, { status: 404 });
    return NextResponse.json({ data: { id }, message: "Movimentação deletada" });
  }
}

export const movimentacaoEstoqueController = new MovimentacaoEstoqueController(movimentacaoEstoqueService);

