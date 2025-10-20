import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const ADMIN_COOKIE = "admin_auth";

async function requireAdmin() {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (c !== "ok") throw new Error("unauthorized");
}

export async function GET() {
  try {
    await requireAdmin();
    const orgs = await prisma.organizacao.findMany({ orderBy: { criadoEm: "desc" } });
    return NextResponse.json(orgs);
  } catch (e) {
    if (e instanceof Error && e.message === "unauthorized") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ message: "Erro" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { nome } = await req.json();
    if (!nome || typeof nome !== "string") return NextResponse.json({ message: "nome é obrigatório" }, { status: 400 });
    const exists = await prisma.organizacao.findUnique({ where: { nome } });
    if (exists) return NextResponse.json({ message: "Organização já existe" }, { status: 409 });
    const org = await prisma.organizacao.create({ data: { nome } });
    return NextResponse.json(org, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "unauthorized") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ message: "Erro" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const { id, nome } = await req.json();
    if (!id || !nome) return NextResponse.json({ message: "id e nome são obrigatórios" }, { status: 400 });
    const org = await prisma.organizacao.update({ where: { id }, data: { nome } });
    return NextResponse.json(org);
  } catch (e) {
    if (e instanceof Error && e.message === "unauthorized") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ message: "Erro" }, { status: 500 });
  }
}
