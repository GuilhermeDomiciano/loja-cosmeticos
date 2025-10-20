import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function GET(req: Request) {
  await clearAuthCookie();
  return NextResponse.redirect(new URL("/signin", req.url));
}

export async function POST(req: Request) {
  return GET(req);
}

