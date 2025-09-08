import { transacaoFinanceiraController } from "@/core/controllers/transacaoFinanceiraController";

export async function GET(req: Request) { return transacaoFinanceiraController.listar(req); }
export async function POST(req: Request) { return transacaoFinanceiraController.criar(req); }

