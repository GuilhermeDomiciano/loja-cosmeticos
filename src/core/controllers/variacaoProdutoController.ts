import { NextResponse } from "next/server";
import {
  variacaoProdutoCreateSchema,
  variacaoProdutoUpdateSchema,
} from "../models/variacaoProdutoSchema";
import {
  VariacaoProdutoService,
  variacaoProdutoService,
} from "../services/variacaoProdutoService";

export class VariacaoProdutoController {
  constructor(private readonly service: VariacaoProdutoService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) return NextResponse.json({ message: "organizacaoId é obrigatório" }, { status: 400 });
    try {
      const data = await this.service.listar(organizacaoId);
      return NextResponse.json({ data, message: "Listagem de variações" });
    } catch {
      return NextResponse.json({ message: "Erro ao listar variações" }, { status: 500 });
    }
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = variacaoProdutoCreateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
    }
    try {
      const created = await this.service.criar(parse.data);
      return NextResponse.json({ data: created, message: "Variação criada" }, { status: 201 });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao criar variação" }, { status: 500 });
    }
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = variacaoProdutoUpdateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
    }
    try {
      const updated = await this.service.atualizar(id, parse.data);
      if (!updated) return NextResponse.json({ message: "Variação não encontrada" }, { status: 404 });
      return NextResponse.json({ data: updated, message: "Variação atualizada" });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao atualizar variação" }, { status: 500 });
    }
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    try {
      const ok = await this.service.deletar(id);
      if (!ok) return NextResponse.json({ message: "Variação não encontrada" }, { status: 404 });
      return NextResponse.json({ data: { id }, message: "Variação deletada" });
    } catch {
      return NextResponse.json({ message: "Erro ao deletar variação" }, { status: 500 });
    }
  }
}

export const variacaoProdutoController = new VariacaoProdutoController(variacaoProdutoService);

