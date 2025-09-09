import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { createJwt, setAuthCookie } from "@/lib/auth";

const bodySchema = z.object({
  nome: z.string().min(1, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  organizacaoNome: z.string().min(1, "Informe o nome da organização"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, password, organizacaoNome } = bodySchema.parse(body);

    const exists = await prisma.usuario.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: "E-mail já cadastrado." }, { status: 409 });
    }

    const orgExists = await prisma.organizacao.findUnique({
      where: { nome: organizacaoNome },
    });
    if (orgExists) {
      return NextResponse.json({ message: "Nome de organização já está em uso." }, { status: 409 });
    }

    const org = await prisma.organizacao.create({
      data: { nome: organizacaoNome },
    });

    const senhaHash = await hash(password, 10);
    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        papel: "owner",
        organizacaoId: org.id,
      },
      include: { organizacao: true },
    });

    const token = await createJwt({ sub: user.id, email: user.email, nome: user.nome });
    const res = NextResponse.json({
      user: { id: user.id, nome: user.nome, email: user.email, organizacaoId: user.organizacaoId },
      organizacoes: [{ id: org.id, nome: org.nome }],
      message: "Conta criada com sucesso",
    });
    setAuthCookie(token);
    return res;
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json({ message: "Dados inválidos", issues: e.issues }, { status: 400 });
    }
    console.error("SIGNUP_ERROR", e);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
