export async function apiGet(path: string, params?: Record<string, string | number | boolean>) {
  const url = new URL(path, typeof window === "undefined" ? "http://localhost" : window.location.origin);

  const isOrgRoute = path.startsWith("/api/organizacoes") || path.startsWith("/api/auth");
  const orgId = typeof window !== "undefined" ? localStorage.getItem("orgId") : null;

  const search = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) search.set(k, String(v));
    }
  }
  if (!isOrgRoute && orgId) search.set("organizacaoId", orgId);

  const full = search.toString() ? `${url.pathname}?${search.toString()}` : url.pathname;
  const res = await fetch(full, { credentials: "include" });
  if (!res.ok) throw new Error((await res.json())?.message || "Erro na requisição");
  return res.json();
}

export async function apiJson(path: string, method: "POST" | "PUT" | "DELETE", body?: unknown) {
  const headers = { "Content-Type": "application/json" };
  const url = typeof window === "undefined" ? path : new URL(path, window.location.origin).pathname;

  const orgId = typeof window !== "undefined" ? localStorage.getItem("orgId") : null;
  const isOrgRoute = path.startsWith("/api/organizacoes") || path.startsWith("/api/auth");

  // acopla organizacaoId no body quando necessário
  const payload =
    !isOrgRoute && body && typeof body === "object" && orgId
      ? { ...(body as Record<string, unknown>), organizacaoId: bodyHasOrgId(body) ? (body as Record<string, unknown>).organizacaoId : orgId }
      : body;

  const res = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Erro na requisição");
  return data;
}

function bodyHasOrgId(b: unknown): b is Record<string, unknown> {
  try {
    return typeof b === "object" && b !== null && "organizacaoId" in b;
  } catch {
    return false;
  }
}
