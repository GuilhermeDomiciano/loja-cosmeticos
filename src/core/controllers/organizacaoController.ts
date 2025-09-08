import { NextResponse } from "next/server";
import {
  organizacaoCreateSchema,
  organizacaoUpdateSchema,
} from "../models/organizacaoSchema";
import {
  OrganizacaoService,
  organizacaoService,
} from "../services/organizacaoService";

export class OrganizacaoController {
  constructor(private readonly service: OrganizacaoService) {}

  async listar() {
    try {
      const data = await this.service.listar();
      return NextResponse.json({ data, message: "Listagem de organizações" });
    } catch {
      return NextResponse.json(
        { message: "Erro ao listar organizações" },
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
    const parse = organizacaoCreateSchema.safeParse(body);
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
        { data: created, message: "Organização criada" },
        { status: 201 }
      );
    } catch (err) {
      if (err instanceof Error) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      }
      return NextResponse.json(
        { message: "Erro ao criar organização" },
        { status: 500 }
      );
    }
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params;
    if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });

    let body: unknown;
    try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }

    const parse = organizacaoUpdateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json(
        { message: first?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    try {
      const updated = await this.service.atualizar(id, parse.data);
      if (!updated) return NextResponse.json({ message: "Organização não encontrada" }, { status: 404 });
      return NextResponse.json({ data: updated, message: "Organização atualizada" });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao atualizar organização" }, { status: 500 });
    }
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params;
    if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    try {
      const ok = await this.service.deletar(id);
      if (!ok) return NextResponse.json({ message: "Organização não encontrada" }, { status: 404 });
      return NextResponse.json({ data: { id }, message: "Organização deletada" });
    } catch {
      return NextResponse.json({ message: "Erro ao deletar organização" }, { status: 500 });
    }
  }
}

export const organizacaoController = new OrganizacaoController(organizacaoService);

