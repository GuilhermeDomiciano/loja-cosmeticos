import { NextResponse } from "next/server";
import { z } from "zod";
import {
  categoriaCreateSchema,
  categoriaUpdateSchema,
} from "../models/categoriaSchema";
import { CategoriaService, categoriaService } from "../services/categoriaService";

export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) {
      return NextResponse.json(
        { message: "organizacaoId é obrigatório" },
        { status: 400 }
      );
    }

    try {
      const data = await this.service.listar(organizacaoId);
      return NextResponse.json({ data, message: "Listagem de categorias" });
    } catch (err) {
      return NextResponse.json(
        { message: "Erro ao listar categorias" },
        { status: 500 }
      );
    }
  }

  async criar(req: Request) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
    }

    const parse = categoriaCreateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json(
        { message: first?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    try {
      const created = await this.service.criar(parse.data);
      return NextResponse.json(
        { data: created, message: "Categoria criada" },
        { status: 201 }
      );
    } catch (err) {
      if (err instanceof Error) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      }
      return NextResponse.json(
        { message: "Erro ao criar categoria" },
        { status: 500 }
      );
    }
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
    }

    const parse = categoriaUpdateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json(
        { message: first?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    try {
      const updated = await this.service.atualizar(id, parse.data);
      if (!updated) {
        return NextResponse.json(
          { message: "Categoria não encontrada" },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: updated, message: "Categoria atualizada" });
    } catch (err) {
      if (err instanceof Error) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      }
      return NextResponse.json(
        { message: "Erro ao atualizar categoria" },
        { status: 500 }
      );
    }
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    }

    try {
      const ok = await this.service.deletar(id);
      if (!ok) {
        return NextResponse.json(
          { message: "Categoria não encontrada" },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: { id }, message: "Categoria deletada" });
    } catch {
      return NextResponse.json(
        { message: "Erro ao deletar categoria" },
        { status: 500 }
      );
    }
  }
}

export const categoriaController = new CategoriaController(categoriaService);

