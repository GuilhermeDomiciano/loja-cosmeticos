import { NextResponse } from "next/server";
import { itemKitCreateSchema, itemKitUpdateSchema } from "../models/itemKitSchema";
import { ItemKitService, itemKitService } from "../services/itemKitService";

export class ItemKitController {
  constructor(private readonly service: ItemKitService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) return NextResponse.json({ message: "organizacaoId é obrigatório" }, { status: 400 });
    const data = await this.service.listar(organizacaoId);
    return NextResponse.json({ data, message: "Listagem de itens de kit" });
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = itemKitCreateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const created = await this.service.criar(parse.data);
    return NextResponse.json({ data: created, message: "Item de kit criado" }, { status: 201 });
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = itemKitUpdateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const updated = await this.service.atualizar(id, parse.data);
    if (!updated) return NextResponse.json({ message: "Item de kit não encontrado" }, { status: 404 });
    return NextResponse.json({ data: updated, message: "Item de kit atualizado" });
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    const ok = await this.service.deletar(id);
    if (!ok) return NextResponse.json({ message: "Item de kit não encontrado" }, { status: 404 });
    return NextResponse.json({ data: { id }, message: "Item de kit deletado" });
  }
}

export const itemKitController = new ItemKitController(itemKitService);

