import { organizacaoController } from "@/core/controllers/organizacaoController";

export async function GET() {
  return organizacaoController.listar();
}

export async function POST(req: Request) {
  return organizacaoController.criar(req);
}

