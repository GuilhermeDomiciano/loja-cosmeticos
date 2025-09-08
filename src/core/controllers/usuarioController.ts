import { NextResponse } from "next/server";
import { usuarioCreateSchema, usuarioUpdateSchema } from "../models/usuarioSchema";
import { UsuarioService, usuarioService } from "../services/usuarioService";

export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) return NextResponse.json({ message: "organizacaoId é obrigatório" }, { status: 400 });
    try {
      const data = await this.service.listar(organizacaoId);
      return NextResponse.json({ data, message: "Listagem de usuários" });
    } catch {
      return NextResponse.json({ message: "Erro ao listar usuários" }, { status: 500 });
    }
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = usuarioCreateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
    }
    try {
      const created = await this.service.criar(parse.data);
      return NextResponse.json({ data: created, message: "Usuário criado" }, { status: 201 });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao criar usuário" }, { status: 500 });
    }
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = usuarioUpdateSchema.safeParse(body);
    if (!parse.success) {
      const first = parse.error.issues[0];
      return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 });
    }
    try {
      const updated = await this.service.atualizar(id, parse.data);
      if (!updated) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
      return NextResponse.json({ data: updated, message: "Usuário atualizado" });
    } catch (err) {
      if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 });
      return NextResponse.json({ message: "Erro ao atualizar usuário" }, { status: 500 });
    }
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    try {
      const ok = await this.service.deletar(id);
      if (!ok) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
      return NextResponse.json({ data: { id }, message: "Usuário deletado" });
    } catch {
      return NextResponse.json({ message: "Erro ao deletar usuário" }, { status: 500 });
    }
  }
}

export const usuarioController = new UsuarioController(usuarioService);

