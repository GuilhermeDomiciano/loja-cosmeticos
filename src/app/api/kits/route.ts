import { kitController } from "@/core/controllers/kitController";

export async function GET(req: Request) { return kitController.listar(req); }
export async function POST(req: Request) { return kitController.criar(req); }

