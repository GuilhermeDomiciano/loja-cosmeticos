import { NextResponse } from "next/server";
import { arquivoCreateSchema, arquivoUpdateSchema } from "../models/arquivoSchema";
import { ArquivoService, arquivoService } from "../services/arquivoService";

export class ArquivoController {
  constructor(private readonly service: ArquivoService) {}

  async listar(req: Request) {
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId");
    if (!organizacaoId) return NextResponse.json({ message: "organizacaoId é obrigatório" }, { status: 400 });
    const data = await this.service.listar(organizacaoId);
    return NextResponse.json({ data, message: "Listagem de arquivos" });
  }

  async criar(req: Request) {
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = arquivoCreateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const created = await this.service.criar(parse.data);
    return NextResponse.json({ data: created, message: "Arquivo criado" }, { status: 201 });
  }

  async atualizar(req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
    const parse = arquivoUpdateSchema.safeParse(body);
    if (!parse.success) { const first = parse.error.issues[0]; return NextResponse.json({ message: first?.message ?? "Dados inválidos" }, { status: 400 }); }
    const updated = await this.service.atualizar(id, parse.data);
    if (!updated) return NextResponse.json({ message: "Arquivo não encontrado" }, { status: 404 });
    return NextResponse.json({ data: updated, message: "Arquivo atualizado" });
  }

  async deletar(_req: Request, params: { id: string }) {
    const { id } = params; if (!id) return NextResponse.json({ message: "id é obrigatório" }, { status: 400 });
    const ok = await this.service.deletar(id);
    if (!ok) return NextResponse.json({ message: "Arquivo não encontrado" }, { status: 404 });
    return NextResponse.json({ data: { id }, message: "Arquivo deletado" });
  }
}

export const arquivoController = new ArquivoController(arquivoService);

