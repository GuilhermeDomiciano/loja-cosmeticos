import { movimentacaoEstoqueController } from "@/core/controllers/movimentacaoEstoqueController";

export async function GET(req: Request) { return movimentacaoEstoqueController.listar(req); }
export async function POST(req: Request) { return movimentacaoEstoqueController.criar(req); }

