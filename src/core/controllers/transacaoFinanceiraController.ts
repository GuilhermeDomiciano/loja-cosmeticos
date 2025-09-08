import { NextResponse } from "next/server";
import { transacaoFinanceiraCreateSchema, transacaoFinanceiraUpdateSchema } from "../models/transacaoFinanceiraSchema";
import { TransacaoFinanceiraService, transacaoFinanceiraService } from "../services/transacaoFinanceiraService";

export class TransacaoFinanceiraController {
  constructor(private readonly service: TransacaoFinanceiraService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) return NextResponse.json({ message: "organizacaoId é obrigatório" }, { status: 400 });
    const data = await this.service.listar(organizacaoId);
    return NextResponse.json({ data, message: "Listagem de transações" });
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = transacaoFinanceiraCreateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const created = await this.service.criar(parse.data);
    return NextResponse.json({ data: created, message: "Transação criada" }, { status: 201 });
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = transacaoFinanceiraUpdateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const updated = await this.service.atualizar(id, parse.data);
    if (!updated) return NextResponse.json({ message: "Transação não encontrada" }, { status: 404 });
    return NextResponse.json({ data: updated, message: "Transação atualizada" });
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    const ok = await this.service.deletar(id);
    if (!ok) return NextResponse.json({ message: "Transação não encontrada" }, { status: 404 });
    return NextResponse.json({ data: { id }, message: "Transação deletada" });
  }
}

export const transacaoFinanceiraController = new TransacaoFinanceiraController(transacaoFinanceiraService);

