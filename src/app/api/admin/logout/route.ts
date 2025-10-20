import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_auth";

export async function POST() {
  const res = NextResponse.json({ message: "ok" });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

