import { produtoController } from "@/core/controllers/produtoController";

export async function GET(req: Request) {
  return produtoController.listar(req);
}

export async function POST(req: Request) {
  return produtoController.criar(req);
}

