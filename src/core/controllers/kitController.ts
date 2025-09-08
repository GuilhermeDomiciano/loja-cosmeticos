import { NextResponse } from "next/server";
import { kitCreateSchema, kitUpdateSchema } from "../models/kitSchema";
import { KitService, kitService } from "../services/kitService";

export class KitController {
  constructor(private readonly service: KitService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) return NextResponse.json({ message: "organizacaoId é obrigatório" }, { status: 400 });
    try { const data = await this.service.listar(organizacaoId); return NextResponse.json({ data, message: "Listagem de kits" }); }
    catch { return NextResponse.json({ message: "Erro ao listar kits" }, { status: 500 }); }
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = kitCreateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    try { const created = await this.service.criar(parse.data); return NextResponse.json({ data: created, message: "Kit criado" }, { status: 201 }); }
    catch (err) { if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 }); return NextResponse.json({ message: "Erro ao criar kit" }, { status: 500 }); }
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = kitUpdateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    try { const updated = await this.service.atualizar(id, parse.data); if (!updated) return NextResponse.json({ message: "Kit não encontrado" }, { status: 404 }); return NextResponse.json({ data: updated, message: "Kit atualizado" }); }
    catch (err) { if (err instanceof Error) return NextResponse.json({ message: err.message }, { status: 400 }); return NextResponse.json({ message: "Erro ao atualizar kit" }, { status: 500 }); }
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    const ok = await this.service.deletar(id);
    if (!ok) return NextResponse.json({ message: "Kit não encontrado" }, { status: 404 });
    return NextResponse.json({ data: { id }, message: "Kit deletado" });
  }
}

export const kitController = new KitController(kitService);

