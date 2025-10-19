import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_auth";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.set({ name: ADMIN_COOKIE, value: "", path: "/", maxAge: 0 });
  return NextResponse.json({ message: "ok" });
}

