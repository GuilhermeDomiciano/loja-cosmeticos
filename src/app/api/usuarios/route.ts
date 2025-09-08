import { usuarioController } from "@/core/controllers/usuarioController";

export async function GET(req: Request) {
  return usuarioController.listar(req);
}

export async function POST(req: Request) {
  return usuarioController.criar(req);
}

