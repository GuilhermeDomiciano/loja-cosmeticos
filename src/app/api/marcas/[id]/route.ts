import { marcaController } from "@/core/controllers/marcaController";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return marcaController.buscarPorId(req, params);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return marcaController.atualizar(req, params);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return marcaController.deletar(req, params);
}
