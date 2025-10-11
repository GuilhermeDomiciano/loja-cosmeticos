import { NextResponse } from "next/server";
import { produtoCreateSchema, produtoUpdateSchema } from "../models/produtoSchema";
import { ProdutoService, produtoService } from "../services/produtoService";
import { requireAuth } from "@/lib/auth";

export class ProdutoController {
  constructor(private readonly service: ProdutoService) {}

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
        { message: error instanceof Error ? error.message : "Erro ao listar produtos" },
        { status: 500 }
      );
    }
  }

  async buscarPorId(_req: Request, params: { id: string }) {
    const { id } = params;
    if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    try {
      const produto = await this.service.buscarPorId(id);
      if (!produto) return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
      return NextResponse.json(produto);
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : "Erro ao buscar produto" },
        { status: 500 }
      );
    }
  }

  async criar(req: Request) {
    try {
      const user = await requireAuth();
      if (!user.organizacaoId) {
        return NextResponse.json({ message: "Usuário sem organização" }, { status: 400 });
      }

      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
      }

      const dataWithOrg = { ...body as object, organizacaoId: user.organizacaoId };
      const parse = produtoCreateSchema.safeParse(dataWithOrg);
      if (!parse.success) {
        const first = parse.error.issues[0];
        return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
      }

      const created = await this.service.criar(parse.data);
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao criar produto" }, { status: 500 });
    }
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = produtoUpdateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
    }
    try {
      const updated = await this.service.atualizar(id, parse.data);
      if (!updated) return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
      return NextResponse.json({ data: updated, message: "Produto atualizado" });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao atualizar produto" }, { status: 500 });
    }
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    try {
      const ok = await this.service.deletar(id);
      if (!ok) return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
      return NextResponse.json({ data: { id }, message: "Produto deletado" });
    } catch {
      return NextResponse.json({ message: "Erro ao deletar produto" }, { status: 500 });
    }
  }
}

export const produtoController = new ProdutoController(produtoService);

