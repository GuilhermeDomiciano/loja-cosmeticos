import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";

const rawSecret = process.env.JWT_SECRET ?? "development-secret-change-me-please-set-env";

export function hashSecret(input: string) {
  return input.length >= 32
    ? new TextEncoder().encode(input)
    : createHash("sha256").update(input).digest();
}

const secret = hashSecret(rawSecret);
const COOKIE_NAME = "auth_token";
const MAX_AGE_DAYS = 7;

const cookieConfig = {
  name: COOKIE_NAME,
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * MAX_AGE_DAYS,
};

export interface JwtPayload extends Record<string, unknown> {
  sub: string; // User ID
  email: string;
  nome?: string;
  organizacaoId?: string;
  iat?: number;
  exp?: number;
}

export async function createJwt(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_DAYS}d`)
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({ ...cookieConfig, value: token });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({ ...cookieConfig, value: "", maxAge: 0 });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * Obtém o usuário autenticado a partir do cookie
 */
export async function getAuthUser(): Promise<JwtPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyJwt(token);
}

/**
 * Verifica se o usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return user !== null;
}

/**
 * Requer autenticação - lança erro se não autenticado
 * Use em API routes
 */
export async function requireAuth(): Promise<JwtPayload> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Não autenticado");
  }
  return user;
}

/**
 * Verifica se usuário pertence à organização
 */
export async function requireOrganization(organizacaoId: string): Promise<JwtPayload> {
  const user = await requireAuth();
  if (user.organizacaoId && user.organizacaoId !== organizacaoId) {
    throw new Error("Acesso negado: organização inválida");
  }
  return user;
}
