import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
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
