import { loteEstoqueController } from "@/core/controllers/loteEstoqueController";

export async function GET(req: Request) { return loteEstoqueController.listar(req); }
export async function POST(req: Request) { return loteEstoqueController.criar(req); }

