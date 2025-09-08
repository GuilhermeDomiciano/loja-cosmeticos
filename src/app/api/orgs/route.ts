import { prisma } from '@/lib/prisma';

export async function GET() {
  const orgs = await prisma.organizacao.findMany({
    orderBy: { criadoEm: 'desc' },
  });
  return Response.json(orgs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const nome = String(body?.nome ?? '').trim();
  if (!nome) return new Response('nome é obrigatório', { status: 400 });

  const org = await prisma.organizacao.create({
    data: { nome },
  });

  return Response.json(org, { status: 201 });
}
