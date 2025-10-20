import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_auth";
const ADMIN_PASS = "flamengo985";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password !== ADMIN_PASS) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const res = NextResponse.json({ message: "ok" });
    res.cookies.set(ADMIN_COOKIE, "ok", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1h
    });
    return res;
  } catch {
    return NextResponse.json({ message: "Erro" }, { status: 400 });
  }
}

