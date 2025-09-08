import { itemKitController } from "@/core/controllers/itemKitController";

export async function GET(req: Request) { return itemKitController.listar(req); }
export async function POST(req: Request) { return itemKitController.criar(req); }

