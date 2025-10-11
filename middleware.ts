import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("auth_token")?.value;
  
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Verificar se token é válido
  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Token inválido, redirecionar para login
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categorias/:path*",
    "/produtos/:path*",
    "/variacoes/:path*",
    "/lotes/:path*",
    "/movimentacoes/:path*",
    "/kits/:path*",
    "/itens-kit/:path*",
    "/transacoes/:path*",
    "/usuarios/:path*",
    "/organizacoes/:path*",
  ],
};
