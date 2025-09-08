import { categoriaController } from "../../../core/controllers/categoriaController";

export async function GET(req: Request) {
  return categoriaController.listar(req);
}

export async function POST(req: Request) {
  return categoriaController.criar(req);
}

