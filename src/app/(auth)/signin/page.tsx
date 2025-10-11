"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type FormData = z.infer<typeof schema>;

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { setUser, setOrganization } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Falha no login");

      // Atualizar stores com dados do usuário
      if (payload.user) {
        setUser({
          id: payload.user.id,
          nome: payload.user.nome,
          email: payload.user.email,
          organizacaoId: payload.user.organizacaoId,
        });
      }
      
      if (payload.organizacoes?.[0]) {
        setOrganization(payload.organizacoes[0]);
      }

      toast.success("Login realizado com sucesso!");
      router.push(params.get("next") || "/dashboard");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-2xl border p-6 shadow-sm bg-card"
      >
        <h1 className="text-2xl font-semibold">Entrar</h1>

        <div className="space-y-2">
          <Input type="email" placeholder="email@exemplo.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Input type="password" placeholder="Sua senha" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Não tem conta? <a href="/signup" className="underline">Criar conta</a>
        </p>
      </form>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <main className="min-h-dvh grid place-items-center p-4">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border p-6 shadow-sm bg-card">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </div>
      </main>
    }>
      <SignInForm />
    </Suspense>
  );
}
