import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";

const ADMIN_COOKIE = "admin_auth";

async function requireAdmin() {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (c !== "ok") throw new Error("unauthorized");
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const organizacaoId = searchParams.get("organizacaoId") || undefined;
    const users = await prisma.usuario.findMany({
      where: { organizacaoId: organizacaoId ?? undefined },
      orderBy: { criadoEm: "desc" },
      include: { organizacao: { select: { id: true, nome: true } } },
    });
    return NextResponse.json(users);
  } catch (e) {
    if (e instanceof Error && e.message === "unauthorized") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ message: "Erro" }, { status: 500 });
  }
}

const createSchema = z.object({
  organizacaoId: z.string().uuid(),
  nome: z.string().min(1),
  email: z.string().email(),
  senha: z.string().min(6),
  papel: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { organizacaoId, nome, email, senha, papel } = createSchema.parse(body);
    const exists = await prisma.usuario.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ message: "E-mail já cadastrado" }, { status: 409 });
    const senhaHash = await hash(senha, 10);
    const user = await prisma.usuario.create({
      data: { organizacaoId, nome, email, senha: senhaHash, papel: papel ?? "user" },
      include: { organizacao: { select: { id: true, nome: true } } },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ message: "Dados inválidos", issues: e.issues }, { status: 400 });
    if (e instanceof Error && e.message === "unauthorized") return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    return NextResponse.json({ message: "Erro" }, { status: 500 });
  }
}

const updateSchema = z.object({
  id: z.string().uuid(),
  bloqueado: z.boolean().optional(),
  nome: z.string().min(1).optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  papel: z.string().optional(),
});

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, bloqueado, nome, email, senha, papel } = updateSchema.parse(body);
    const data: { nome?: string; email?: string; senha?: string; papel?: string } = {};
    if (nome !== undefined) data.nome = nome;
    if (email !== undefined) data.email = email;
    if (senha !== undefined) data.senha = await hash(senha, 10);
    if (papel !== undefined) data.papel = papel;
    if (bloqueado !== undefined) data.papel = bloqueado ? "blocked" : "user";
    const user = await prisma.usuario.update({ where: { id }, data });
    return NextResponse.json({ user });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ message: "Dados inválidos", issues: e.issues }, { status: 400 });
    if (e instanceof Error && e.message === "unauthorized") return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    return NextResponse.json({ message: "Erro" }, { status: 500 });
  }
}

