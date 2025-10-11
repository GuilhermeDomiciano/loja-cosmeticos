# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A multi-tenant cosmetics e-commerce management system built with Next.js 15 (App Router), TypeScript, Prisma ORM, and PostgreSQL. The application manages product catalogs, inventory (lots and movements), product kits, financial transactions, and file storage via Supabase.

## ⚠️ CRITICAL: MOBILE-FIRST DEVELOPMENT

**ALL user interfaces MUST be developed with a mobile-first approach:**

- **Primary target**: Design and develop for mobile screens (smartphones) FIRST
- **Progressive enhancement**: After ensuring perfect mobile functionality, expand to tablet and desktop
- **Tailwind strategy**: Use base classes for mobile, then add breakpoints (`sm:`, `md:`, `lg:`, `xl:`) for larger screens
- **Touch-friendly**: Buttons and clickable areas minimum 44x44px for easy touch interaction
- **Mobile navigation patterns**: Prioritize hamburger menus, bottom navigation bars, and swipe gestures
- **Performance**: Optimize images and assets for slower mobile connections
- **Testing requirement**: Always test on real mobile devices or emulators before considering work complete

**Correct Tailwind approach example:**
```tsx
{/* Base = mobile, then adjust for desktop */}
<div className="p-4 md:p-8 flex flex-col md:flex-row">
  <button className="w-full md:w-auto py-3 px-6 text-base">
    Action
  </button>
</div>
```

## Essential Commands

### Development
```bash
# Start development server (uses Turbopack)
npm run dev

# Access application at http://localhost:3000
```

### Database
```bash
# Generate Prisma client (required after schema changes)
npx prisma generate

# Push schema changes to database (no migrations)
npx prisma db push

# Create a new migration (versioned approach)
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Build & Production
```bash
# Build for production (runs prisma generate first)
npm run build

# Start production server
npm start
```

### Linting
```bash
# Run ESLint
npm run lint
```

## Architecture

### Layered Architecture Pattern

The codebase follows a strict 3-layer architecture in `src/core/`:

1. **Controllers** (`src/core/controllers/`): HTTP interface layer
   - Parse `Request` objects and validate inputs using Zod schemas
   - Return `NextResponse` with appropriate status codes
   - Delegate all business logic to services
   - Error handling: 400 (invalid input), 404 (not found), 500 (unexpected)

2. **Services** (`src/core/services/`): Business logic layer
   - Contain domain rules and orchestration
   - Handle Prisma error translation (e.g., P2002 → user-friendly messages)
   - Call repositories for data access
   - Return domain objects or throw domain-specific errors

3. **Repositories** (`src/core/repositories/`): Data access layer
   - Direct Prisma ORM interactions only
   - One repository per entity (e.g., `produtoRepository`, `usuarioRepository`)
   - Perform CRUD operations and queries
   - No business logic

### API Routes Pattern

API routes in `src/app/api/` follow Next.js App Router conventions:

- **Collection endpoints** (`route.ts`):
  - `GET /api/<entity>?organizacaoId=<id>` - List resources
  - `POST /api/<entity>` - Create resource

- **Item endpoints** (`[id]/route.ts`):
  - `PUT /api/<entity>/[id]` - Update resource
  - `DELETE /api/<entity>/[id]` - Delete resource

**Pattern example:**
```typescript
// src/app/api/produtos/route.ts
import { produtoController } from "@/core/controllers/produtoController";

export async function GET(req: Request) {
  return produtoController.listar(req);
}
```

**Note:** In Next.js 15, route params are now async:
```typescript
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  // ...
}
```

### Multi-Tenancy

All entities are scoped to `organizacaoId` (organization ID):
- Every entity has `organizacaoId` field
- All queries must filter by `organizacaoId`
- This enables complete data isolation between organizations
- Middleware (`middleware.ts`) protects routes with JWT cookie authentication

### Data Models

Key entities (see `prisma/schema.prisma`):

- **Organizacao**: Tenant root - all entities relate to one organization
- **Usuario**: Users with email/password (bcrypt) and role
- **Categoria** → **Produto** → **VariacaoProduto**: Catalog hierarchy
  - Products have variations (SKU, unit, price, cost, barcode)
  - Units: `UN`, `ML`, `G`, `KG`, `L`
- **LoteEstoque**: Inventory lots per product variation
- **MovimentacaoEstoque**: Stock movements (entrada/saida) with:
  - Motivo: `COMPRA`, `VENDA`, `AJUSTE`, `DEVOLUCAO`, `TRANSFERENCIA`, `PERDA`
  - Canal: `BALCAO`, `WHATSAPP`, `INSTAGRAM`, `MARKETPLACE`, `OUTRO`
- **Kit** + **ItemKit**: Sellable bundles composed of product variations
- **TransacaoFinanceira**: Payables/receivables linked to stock movements
- **Arquivo**: File metadata for Supabase storage

### State Management & Data Fetching

- **@tanstack/react-query**: Server state and caching
- **zustand**: Client-side state management
- **react-hook-form**: Form handling with Zod validation via `@hookform/resolvers`

### File Storage

- **Supabase** client in `src/lib/supabase.ts`
- **CRITICAL**: Only import `supabase.ts` in server-side code (API routes, Server Components)
- Uses `SUPABASE_SERVICE_ROLE_KEY` - never expose to client

## Environment Variables

Required variables in `.env.local` (not version controlled):

```bash
# Prisma database connection
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"  # SERVER ONLY - never expose to client
```

## Path Aliases

TypeScript is configured with path alias `@/*` → `./src/*`:

```typescript
import { produtoController } from "@/core/controllers/produtoController";
import { prisma } from "@/lib/prisma";
```

## Validation & Types

- All input validation uses **Zod** schemas in `src/core/models/*Schema.ts`
- Schemas export both TypeScript types and Zod validators:
  ```typescript
  export const produtoCreateSchema = z.object({ ... });
  export type ProdutoCreateInput = z.infer<typeof produtoCreateSchema>;
  ```

## UI & Styling

- **Tailwind CSS v4** with custom configuration
  - **CRITICAL**: Always develop with mobile-first approach
  - Base classes target mobile screens, use breakpoints for larger screens
  - Follow pattern: `class="mobile-style md:desktop-style"`
- Component library setup via `components.json` (likely shadcn/ui)
- Icons: `lucide-react`
- Utilities: `clsx`, `tailwind-merge` for conditional classes
- Date handling: `date-fns`

## Mobile-First Design Patterns

### Layout Patterns

**Stack to Row:**
```tsx
// Mobile: stacked vertically, Desktop: horizontal
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Full Width to Auto:**
```tsx
// Mobile: full width buttons, Desktop: auto width
<button className="w-full md:w-auto">Submit</button>
```

**Responsive Spacing:**
```tsx
// Mobile: smaller padding, Desktop: larger padding
<div className="p-4 md:p-6 lg:p-8">
  <div className="space-y-4 md:space-y-6">Content</div>
</div>
```

### Typography Patterns

```tsx
// Mobile: smaller text, Desktop: larger text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
<p className="text-sm md:text-base">
```

### Navigation Patterns

**Mobile Menu:**
- Use hamburger menu for primary navigation on mobile
- Consider bottom navigation bar for main actions (common in mobile apps)
- Ensure touch targets are at least 44x44px

**Example bottom navigation:**
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
  <div className="flex justify-around py-2">
    <button className="p-3">Home</button>
    <button className="p-3">Products</button>
    <button className="p-3">Cart</button>
  </div>
</nav>
```

### Form Patterns

```tsx
// Mobile: stacked form fields, Desktop: grid layout
<form className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
  <input className="w-full" />
  <input className="w-full" />
</form>
```

### Grid Patterns

```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3-4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

## Development Workflow

### Adding a New Entity

1. **Define schema** in `prisma/schema.prisma`
2. Run `npx prisma db push` or create migration
3. Create **Zod schemas** in `src/core/models/<entity>Schema.ts`
4. Create **Repository** in `src/core/repositories/<entity>Repository.ts`
5. Create **Service** in `src/core/services/<entity>Service.ts`
6. Create **Controller** in `src/core/controllers/<entity>Controller.ts`
7. Create **API routes** in `src/app/api/<entity>/route.ts` and `[id]/route.ts`

### Common Patterns

**Error handling in Services:**
```typescript
try {
  return await this.repo.criar(input);
} catch (err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    throw new Error("User-friendly duplicate error message");
  }
  throw err;
}
```

**Controller validation:**
```typescript
const parse = createSchema.safeParse(body);
if (!parse.success) {
  const first = parse.error.issues[0];
  return NextResponse.json({ message: first?.message ?? "Invalid data" }, { status: 400 });
}
```

## Additional Context

For more detailed context about the system's business rules, flows, and Portuguese domain terminology, refer to `AGENTS.md` which contains comprehensive documentation in Portuguese.
