import { prisma } from "@/lib/prisma";

export class UsuarioRepository {
  async listarPorOrganizacao(organizacaoId: string) {
    return prisma.usuario.findMany({
      where: { organizacaoId },
      orderBy: { criadoEm: "desc" },
    });
  }
  async buscarPorId(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  }
  async criar(data: {
    organizacaoId: string;
    email: string;
    nome: string;
    senha: string;
    papel?: string;
  }) {
    return prisma.usuario.create({ data });
  }
  async atualizar(
    id: string,
    data: { email?: string; nome?: string; senha?: string; papel?: string }
  ) {
    return prisma.usuario.update({ where: { id }, data });
  }
  async deletar(id: string) {
    await prisma.usuario.delete({ where: { id } });
  }
}

export const usuarioRepository = new UsuarioRepository();

