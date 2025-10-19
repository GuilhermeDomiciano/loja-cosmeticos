import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { createJwt, setAuthCookie } from "@/lib/auth";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = bodySchema.parse(body);

    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { organizacao: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Credenciais inválidas." }, { status: 401 });
    }

    if (user.papel && user.papel.toLowerCase() === "blocked") {
      return NextResponse.json({ message: "Usuário bloqueado" }, { status: 403 });
    }

    const ok = await compare(password, user.senha ?? "");
    if (!ok) {
      return NextResponse.json({ message: "Credenciais inválidas." }, { status: 401 });
    }

    const token = await createJwt({
      sub: String(user.id),
      email: user.email,
      nome: user.nome ?? "",
      organizacaoId: user.organizacaoId ?? undefined,
    });

    setAuthCookie(token);

    const res = NextResponse.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        organizacaoId: user.organizacaoId,
      },
      organizacoes: user.organizacao
        ? [{ id: user.organizacao.id, nome: user.organizacao.nome }]
        : [],
      message: "Login OK",
    });

    return res;
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos", issues: e.issues }, { status: 400 });
    }
    console.error("LOGIN_ERROR", e);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
