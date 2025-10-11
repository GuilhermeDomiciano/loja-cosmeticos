"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  nome: z.string().min(1, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  organizacaoNome: z.string().min(1, "Informe o nome da organização"),
});

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", password: "", organizacaoNome: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Falha no cadastro");

      const orgId = payload?.organizacoes?.[0]?.id ?? null;
      if (orgId) localStorage.setItem("orgId", String(orgId));

      toast.success("Conta criada com sucesso!");
      router.push(params.get("next") || "/dashboard");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 rounded-2xl border p-6 shadow-sm bg-card">
        <h1 className="text-2xl font-semibold">Criar conta</h1>

        <div className="space-y-2">
          <Input placeholder="Seu nome" {...register("nome")} />
          {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="space-y-2">
          <Input type="email" placeholder="email@exemplo.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Input type="password" placeholder="Senha (mín. 6)" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Input placeholder="Nome da organização" {...register("organizacaoNome")} />
          {errors.organizacaoNome && <p className="text-sm text-destructive">{errors.organizacaoNome.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Já tem conta? <a href="/signin" className="underline">Entrar</a>
        </p>
      </form>
    </main>
  );
}
