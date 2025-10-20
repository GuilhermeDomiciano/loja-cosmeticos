import { marcaController } from "@/core/controllers/marcaController";

export async function GET(req: Request) { return marcaController.listar(req); }
export async function POST(req: Request) { return marcaController.criar(req); }

