import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { hashSecret } from "@/lib/auth";

const secret = hashSecret(process.env.JWT_SECRET ?? "development-secret-change-me-please-set-env");

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
  } catch (error) {
    // Token inválido, redirecionar para login
    console.error('[Middleware] Token verification failed:', error);
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
