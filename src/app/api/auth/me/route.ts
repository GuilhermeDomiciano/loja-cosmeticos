import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado atual
 */
export async function GET() {
  try {
    const jwtUser = await getAuthUser();
    
    if (!jwtUser) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    // Buscar dados completos do usuário no banco
    const user = await prisma.usuario.findUnique({
      where: { id: jwtUser.sub },
      include: {
        organizacao: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        papel: user.papel,
        organizacaoId: user.organizacaoId,
      },
      organizacao: user.organizacao
        ? {
            id: user.organizacao.id,
            nome: user.organizacao.nome,
          }
        : null,
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { message: "Erro ao obter dados do usuário" },
      { status: 500 }
    );
  }
}
