# 🚀 GUIA DE SETUP INICIAL - Loja de Cosméticos

Este guia vai te ajudar a configurar o ambiente de desenvolvimento do zero.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ **Node.js** >= 18 ([Download](https://nodejs.org))
- ✅ **npm** (vem com Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **PostgreSQL** (ou usar serviço cloud gratuito)

## 🔧 Passo 1: Instalar Dependências

```bash
npm install
```

Este comando já foi executado e funcionou! ✅

## 🗄️ Passo 2: Configurar Banco de Dados

Você tem **3 opções** (escolha uma):

### Opção A: PostgreSQL Local (Recomendado para desenvolvimento)

1. **Instalar PostgreSQL**:
   - Windows: [Download PostgreSQL](https://www.postgresql.org/download/windows/)
   - Durante instalação, defina senha do usuário `postgres`

2. **Criar banco de dados**:
   ```bash
   # Conectar ao PostgreSQL
   psql -U postgres
   
   # Criar banco
   CREATE DATABASE loja_cosmeticos;
   
   # Sair
   \q
   ```

3. **Configurar `.env.local`**:
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/loja_cosmeticos"
   ```

### Opção B: Supabase (Gratuito, mais fácil)

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (gratuito)
3. Crie um novo projeto
4. Vá em **Project Settings** → **Database**
5. Copie a **Connection String** (modo "Session")
6. Cole no `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```

### Opção C: Neon (Gratuito, serverless)

1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta (gratuito)
3. Crie um novo projeto
4. Copie a **Connection String**
5. Cole no `.env.local`:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
   ```

## 📦 Passo 3: Configurar Supabase Storage

**Para upload de imagens de produtos, você precisa do Supabase:**

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Crie um projeto (pode ser o mesmo da Opção B acima)
3. Vá em **Project Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role (secret)** → `SUPABASE_SERVICE_ROLE_KEY`

5. Configure no `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxx.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

6. **Criar bucket de storage**:
   - No Supabase, vá em **Storage**
   - Clique em **New bucket**
   - Nome: `product-images`
   - Public: ✅ (marcar como público)
   - Criar

## 🔐 Passo 4: Configurar JWT Secret

Gere uma chave segura para JWT:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole no `.env.local`:
```env
JWT_SECRET="sua-chave-aleatória-gerada-aqui"
```

## 🎨 Passo 5: Sincronizar Schema do Prisma

Agora vamos criar as tabelas no banco de dados:

```bash
# Gerar client do Prisma (já executado ✅)
npx prisma generate

# Sincronizar schema com banco de dados
npx prisma db push
```

**Ou se preferir usar migrações versionadas:**
```bash
npx prisma migrate dev --name initial
```

## ✅ Passo 6: Verificar Configuração

Execute este comando para verificar se tudo está OK:

```bash
npx prisma studio
```

Isso deve abrir uma interface no navegador (`http://localhost:5555`) onde você pode ver as tabelas criadas. Se abriu, está tudo certo! ✅

## 🚀 Passo 7: Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📝 Checklist de Configuração

Marque o que já está configurado:

- [x] Node.js instalado
- [x] Dependências instaladas (`npm install`)
- [x] Prisma Client gerado
- [ ] Banco de dados PostgreSQL configurado
- [ ] `DATABASE_URL` no `.env.local`
- [ ] Supabase configurado (URL + Service Role Key)
- [ ] `JWT_SECRET` gerado e configurado
- [ ] Schema sincronizado (`prisma db push` ou `migrate`)
- [ ] Bucket `product-images` criado no Supabase
- [ ] Servidor rodando (`npm run dev`)

## 🆘 Problemas Comuns

### Erro: "Can't reach database server"
- ✅ Verifique se o PostgreSQL está rodando
- ✅ Confirme que a `DATABASE_URL` está correta
- ✅ Se usar serviço cloud, verifique conexão com internet

### Erro: "P1001: Can't reach database"
- ✅ Firewall pode estar bloqueando
- ✅ Verifique porta (padrão: 5432)
- ✅ Tente adicionar `?sslmode=require` no final da URL

### Erro no Prisma Client
```bash
# Limpar e regenerar
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

### Erro "SUPABASE_SERVICE_ROLE_KEY is required"
- ✅ Configure as variáveis do Supabase no `.env.local`
- ✅ Reinicie o servidor (`npm run dev`)

## 📚 Próximos Passos

Após configurar o ambiente:

1. ✅ Leia o `IMPLEMENTACAO.md` para ver o plano completo
2. ✅ Leia o `AGENTS.md` para entender o contexto do projeto
3. ✅ Leia o `WARP.md` para padrões de desenvolvimento
4. ✅ Comece pela **Fase 0** do plano de implementação

## 🎯 Resumo das URLs

Depois de tudo configurado:

- **Aplicação**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (comando: `npx prisma studio`)
- **Supabase Dashboard**: https://app.supabase.com

---

## 📧 Suporte

Se tiver problemas:
1. Verifique o `SETUP.md` completo
2. Consulte a seção "Troubleshooting" no `IMPLEMENTACAO.md`
3. Revise os logs de erro no terminal

**Boa sorte com o desenvolvimento! 🚀**
