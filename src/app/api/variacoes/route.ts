import { variacaoProdutoController } from "@/core/controllers/variacaoProdutoController";

export async function GET(req: Request) {
  return variacaoProdutoController.listar(req);
}

export async function POST(req: Request) {
  return variacaoProdutoController.criar(req);
}

