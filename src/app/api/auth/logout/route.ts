import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function GET(req: Request) {
  await clearAuthCookie();
  const url = new URL("/signin", req.url);
  return NextResponse.redirect(url);
}

export async function POST(req: Request) {
  return GET(req);
}

