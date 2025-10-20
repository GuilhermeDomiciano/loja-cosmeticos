import { NextResponse } from "next/server";
import { marcaCreateSchema, marcaUpdateSchema } from "../models/marcaSchema";
import { MarcaService, marcaService } from "../services/marcaService";
import { requireAuth } from "@/lib/auth";

export class MarcaController {
  constructor(private readonly service: MarcaService) {}

  async listar(_req: Request) {
    try {
      const user = await requireAuth();
      if (!user.organizacaoId) return NextResponse.json({ message: "Usuário sem organização" }, { status: 400 });
      const data = await this.service.listar(user.organizacaoId);
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ message: error instanceof Error ? error.message : "Erro ao listar marcas" }, { status: 500 });
    }
  }

  async buscarPorId(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    try {
      const marca = await this.service.buscarPorId(id);
      if (!marca) return NextResponse.json({ message: "Marca não encontrada" }, { status: 404 });
      return NextResponse.json(marca);
    } catch (error) {
      return NextResponse.json({ message: error instanceof Error ? error.message : "Erro ao buscar marca" }, { status: 500 });
    }
  }

  async criar(req: Request) {
    try {
      const user = await requireAuth();
      if (!user.organizacaoId) return NextResponse.json({ message: "Usuário sem organização" }, { status: 400 });

      let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
      const withOrg = { ...(body as object), organizacaoId: user.organizacaoId };
      const parse = marcaCreateSchema.safeParse(withOrg);
      if (!parse.success) {
        const first = parse.error.issues[0];
        return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
      }
      const created = await this.service.criar(parse.data);
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao criar marca" }, { status: 500 });
    }
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = marcaUpdateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
    }
    try {
      const updated = await this.service.atualizar(id, parse.data);
      if (!updated) return NextResponse.json({ message: "Marca não encontrada" }, { status: 404 });
      return NextResponse.json({ data: updated, message: "Marca atualizada" });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao atualizar marca" }, { status: 500 });
    }
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    try {
      const ok = await this.service.deletar(id);
      if (!ok) return NextResponse.json({ message: "Marca não encontrada" }, { status: 404 });
      return NextResponse.json({ data: { id }, message: "Marca deletada" });
    } catch {
      return NextResponse.json({ message: "Erro ao deletar marca" }, { status: 500 });
    }
  }
}

export const marcaController = new MarcaController(marcaService);
