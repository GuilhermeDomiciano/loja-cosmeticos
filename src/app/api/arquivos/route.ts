import { arquivoController } from "@/core/controllers/arquivoController";

export async function GET(req: Request) { return arquivoController.listar(req); }
export async function POST(req: Request) { return arquivoController.criar(req); }

