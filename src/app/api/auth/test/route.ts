import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        message: "Não autenticado - token não encontrado ou inválido" 
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.sub,
        email: user.email,
        nome: user.nome,
        organizacaoId: user.organizacaoId,
      },
    });
  } catch (error) {
    console.error("[Auth Test] Error:", error);
    return NextResponse.json({ 
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
