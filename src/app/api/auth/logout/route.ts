import { NextResponse } from "next/server";
import { getClearAuthCookieConfig } from "@/lib/auth";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/signin", req.url));
  const clear = getClearAuthCookieConfig();
  res.cookies.set(clear.name, clear.value, clear.options);
  return res;
}

export async function POST(req: Request) {
  return GET(req);
}

