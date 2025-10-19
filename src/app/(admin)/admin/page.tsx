"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Organizacao = { id: string; nome: string };
type Usuario = { id: string; nome: string; email: string; papel?: string | null; organizacao?: Organizacao | null; organizacaoId: string };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orgs, setOrgs] = useState<Organizacao[]>([]);
  const [editingOrgId, setEditingOrgId] = useState<string>("");
  const [editingOrgNome, setEditingOrgNome] = useState<string>("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({ organizacaoId: "", nome: "", email: "", senha: "", papel: "user" });
  const [newOrg, setNewOrg] = useState("");

  const login = async () => {
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (!res.ok) throw new Error("Senha incorreta");
      setAuthed(true);
      toast.success("Acesso concedido");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao autenticar");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setUsers([]);
    setOrgs([]);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const [oRes, uRes] = await Promise.all([
        fetch("/api/admin/organizacoes"),
        fetch("/api/admin/usuarios"),
      ]);
      if (oRes.status === 401 || uRes.status === 401) { setAuthed(false); return; }
      setOrgs(await oRes.json());
      setUsers(await uRes.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { if (authed) refresh(); }, [authed]);

  const createUser = async () => {
    try {
      if (!newUser.organizacaoId || !newUser.nome || !newUser.email || !newUser.senha) {
        toast.error("Preencha todos os campos"); return;
      }
      const res = await fetch("/api/admin/usuarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
      if (!res.ok) throw new Error((await res.json()).message || "Erro ao criar usuário");
      toast.success("Usuário criado");
      setNewUser({ organizacaoId: "", nome: "", email: "", senha: "", papel: "user" });
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    }
  };

  const toggleBlock = async (u: Usuario) => {
    const bloqueado = (u.papel || "").toLowerCase() === "blocked" ? false : true;
    const res = await fetch("/api/admin/usuarios", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id, bloqueado }) });
    if (!res.ok) { toast.error("Falha ao atualizar"); return; }
    await refresh();
  };

  if (!authed) {
    return (
      <div className="min-h-dvh grid place-items-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Acesso Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full" onClick={login}>Entrar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Geral</h1>
        <Button variant="outline" onClick={logout}>Sair</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Organizações */}
        <Card>
          <CardHeader>
            <CardTitle>Organizações ({orgs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Input placeholder="Nome da organização" value={newOrg} onChange={(e) => setNewOrg(e.target.value)} />
              <Button onClick={async () => {
                try {
                  if (!newOrg) { toast.error("Informe o nome"); return; }
                  const res = await fetch("/api/admin/organizacoes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: newOrg }) });
                  if (!res.ok) throw new Error((await res.json()).message || "Erro ao criar organização");
                  setNewOrg("");
                  toast.success("Organização criada");
                  await refresh();
                } catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
              }}>Criar</Button>
            </div>
            {loading && <p className="text-muted-foreground">Carregando...</p>}
            {!loading && orgs.map((o) => (
              <div key={o.id} className="p-3 border rounded-lg flex items-center justify-between gap-3">
                {editingOrgId === o.id ? (
                  <>
                    <Input value={editingOrgNome} onChange={(e) => setEditingOrgNome(e.target.value)} className="flex-1" />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => { setEditingOrgId(""); setEditingOrgNome(""); }}>Cancelar</Button>
                      <Button onClick={async () => {
                        try {
                          if (!editingOrgNome) { toast.error("Informe o nome"); return; }
                          const res = await fetch("/api/admin/organizacoes", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: o.id, nome: editingOrgNome })});
                          if (!res.ok) throw new Error((await res.json()).message || "Erro ao renomear");
                          toast.success("Renomeada");
                          setEditingOrgId(""); setEditingOrgNome("");
                          await refresh();
                        } catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
                      }}>Salvar</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="truncate flex-1">
                      <p className="font-medium truncate">{o.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">{o.id}</p>
                    </div>
                    <Button variant="outline" onClick={() => { setEditingOrgId(o.id); setEditingOrgNome(o.nome); }}>Renomear</Button>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Select value={newUser.organizacaoId} onValueChange={(v) => setNewUser({ ...newUser, organizacaoId: v })}>
                <SelectTrigger><SelectValue placeholder="Organização" /></SelectTrigger>
                <SelectContent>
                  {orgs.map((o) => (<SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input placeholder="Nome" value={newUser.nome} onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })} />
              <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              <Input placeholder="Senha" type="password" value={newUser.senha} onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={createUser}>Criar Usuário</Button>
              <Button variant="outline" onClick={refresh}>Atualizar</Button>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {users.map((u) => (
                <div key={u.id} className="p-3 border rounded-lg flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{u.nome} <span className="text-xs text-muted-foreground">({u.papel || "user"})</span></p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.organizacao?.nome ?? u.organizacaoId}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" onClick={() => toggleBlock(u)}>
                      {((u.papel || "").toLowerCase() === "blocked") ? "Desbloquear" : "Bloquear"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
