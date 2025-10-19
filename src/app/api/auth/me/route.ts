import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  return NextResponse.json({ user });
}

