# AGENTS.md

Instructions for AI coding agents working on this Todo application project.

## Project Overview

This is a multi-tenant todo application built with Next.js, Supabase, and Refine v5. The application uses:
- **Frontend**: Next.js 16 (App Router) with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI Framework**: Refine v5 with React Query v5
- **Components**: shadcn/ui with Tailwind CSS
- **Package Manager**: pnpm

## Repository Overview

**Source code**: `frontend/src/` contains the implementation.
- `app/` - Next.js App Router pages and layouts
- `components/` - React components (shadcn/ui & Refine UI)
- `providers/` - Refine providers (auth, data)
- `types/` - TypeScript type definitions (Supabase-generated and extended)
- `utils/` - Utility functions (Supabase clients, helpers)

**Tests**: Tests can be added in `frontend/src/__tests__/` or `frontend/tests/` (not yet implemented).

**Documentation**: 
- `agent_docs/` - Development documentation
  - `DATABASE.md` - Complete database schema documentation
  - `poc-implementation-plan.md` - POC implementation history
- `README.md` - Main project documentation
- `AGENTS.md` - This file (agent instructions)

**Configuration**:
- `frontend/package.json` - Dependencies and scripts
- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/next.config.mjs` - Next.js configuration
- `supabase/config.toml` - Supabase local configuration

**Utilities**: Developer commands are defined in `frontend/package.json` scripts (use `pnpm run <script>`).

**PR template**: `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md` (create if needed to describe required PR information).

## Setup Commands

All commands must be run from the `frontend/` directory:

```bash
cd frontend
```

- **Install dependencies**: `pnpm install`
- **Start dev server**: `pnpm dev` (runs on http://localhost:3000)
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`
- **Run linter**: `pnpm lint`
- **Generate Supabase types**: `pnpm generate-types`

## Environment Setup

1. **Required Environment Variables** (in `frontend/.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_KEY` - Your Supabase anon key

2. **Supabase Configuration**:
   - Database schema is documented in `agent_docs/DATABASE.md`
   - Tables: `user` (synced from `auth.users`), `todo`
   - Row Level Security (RLS) policies enforce multi-tenant isolation
   - All timestamps use `TIMESTAMPTZ` (timezone-aware)

## Code Style & Conventions

### TypeScript
- **Strict mode**: Enabled
- **Type definitions**: Always use Supabase-generated types from `types/supabase.ts`
- **Type extensions**: Extend types via `types/supabase.extended.ts` when needed
- **Field naming**: Use **snake_case** for database fields (matches Supabase schema)
  - Examples: `user_id`, `due_date`, `created_at`, `updated_at`
  - NOT camelCase like `userId`, `dueDate`, `createdAt`

### Code Language
- **Code & Comments**: English only
- **UI Labels**: Spanish only (all user-facing text)
- **File names**: Use kebab-case (e.g., `todo-item.tsx`)

### Refine v5 API Patterns (CRITICAL)

**Query Hooks Pattern** (useList, useShow):
```typescript
// ✅ CORRECT - Use { result, query } destructuring
const { result, query } = useList<Todo, HttpError>({
  resource: "todo",
  meta: { table: "todo" },
});

const todos = result.data ?? [];
if (query.isLoading) { /* ... */ }
if (query.isError) { /* ... */ }
query.refetch();

// ❌ WRONG - Don't use old pattern
const { data, isLoading } = useList<Todo>({ resource: "todo" });
```

**Show Hook Pattern**:
```typescript
// ✅ CORRECT
const { result: todo, query: { isFetching, isError, refetch } } = useShow<Todo>({
  resource: "todo",
  id,
});

// ❌ WRONG
const { queryResult } = useShow({ resource: "todo", id });
const todo = queryResult?.data?.data;
```

**Mutation Hooks** (useCreate, useUpdate, useDelete):
```typescript
// ✅ CORRECT - Returns mutate function
const { mutate: createTodo } = useCreate();
createTodo({ resource: "todo", values: { ...data, user_id: identity.id } });
```

### Form Handling

**Always provide defaultValues** to prevent controlled/uncontrolled input warnings:
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    title: "",
    description: "",
    priority: undefined,
    due_date: undefined,
  },
});
```

**Input components** should handle undefined values:
```typescript
<Input {...field} value={field.value || ""} />
```

### File Structure

- **Pages**: `frontend/src/app/dashboard/todos/` (not `app/todos/`)
- **Resource name**: Use `"todo"` (singular) in Refine, not `"todos"`
- **Routes**: 
  - List: `/dashboard/todos`
  - Create: `/dashboard/todos/create`
  - Edit: `/dashboard/todos/edit/[id]`
  - Show: `/dashboard/todos/show/[id]`

## Database Schema

**Key Points**:
- **Table names**: Singular (`user`, `todo`)
- **Primary keys**: UUID (v4)
- **Timestamps**: `TIMESTAMPTZ` (timezone-aware)
- **User sync**: `auth.users` automatically syncs to `public.user` via trigger
- **RLS**: All queries must include `user_id` for multi-tenant isolation

**Important Fields**:
- `todo.user_id` - REQUIRED for all todo operations (RLS enforcement)
- `todo.due_date` - Can be null, stored as TIMESTAMPTZ
- `todo.priority` - Enum: `'low' | 'medium' | 'high' | null`
- `todo.completed` - Boolean, defaults to `false`

See `agent_docs/DATABASE.md` for complete schema documentation.

## Type System

### Using Supabase Types

```typescript
// ✅ CORRECT - Import from extended types
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.extended";

export interface Todo extends Tables<"todo"> {}
export interface CreateTodoInput extends TablesInsert<"todo"> {}
export interface UpdateTodoInput extends TablesUpdate<"todo"> {}
```

### Field Name Mapping

When working with forms or components, remember:
- **Database**: `user_id`, `due_date`, `created_at`, `updated_at` (snake_case)
- **TypeScript**: Same as database (snake_case)
- **Form fields**: Use snake_case to match database

## Authentication

- **Provider**: Supabase Auth
- **Client**: `supabaseBrowserClient` from `@utils/supabase/client`
- **Server**: `createSupabaseServerClient` from `@utils/supabase/server`
- **User ID**: Always get from `useGetIdentity()` hook when creating todos
- **RLS**: Automatically enforced by Supabase based on `auth.uid()`

## Common Patterns

### Creating a Todo

```typescript
const { data: identity } = useGetIdentity();
const { mutate: createTodo } = useCreate();

createTodo({
  resource: "todo",
  values: {
    ...formData,
    user_id: identity.id, // REQUIRED for RLS
    due_date: formData.due_date?.toISOString() || null,
  },
});
```

### Fetching Todos

```typescript
const { result, query } = useList<Todo, HttpError>({
  resource: "todo",
  meta: { table: "todo" },
});

const todos = result.data ?? [];
```

### Error Handling

```typescript
if (query.isError) {
  return <ErrorComponent onRetry={() => query.refetch()} />;
}
```

## Testing & Quality

### Before Committing

1. **Run linter**: `pnpm lint` (from `frontend/` directory)
2. **Check TypeScript**: Ensure no type errors
3. **Verify RLS**: Ensure `user_id` is included in all mutations
4. **Test forms**: Ensure `defaultValues` are set to prevent warnings
5. **Check field names**: Verify snake_case matches database schema

### Common Issues to Avoid

1. **Controlled/Uncontrolled Input**: Always provide `defaultValues` in `useForm`
2. **Missing user_id**: Always include `user_id` when creating/updating todos
3. **Wrong field names**: Use `due_date` not `dueDate`, `created_at` not `createdAt`
4. **Old API patterns**: Use `{ result, query }` not `{ data, isLoading }`
5. **Wrong resource name**: Use `"todo"` (singular) not `"todos"`

## UI Guidelines

### Color Palette

- **Primary**: `#b1f8f2` (Light mint green)
- **Secondary**: `#bcd39c` (Soft sage green)
- **Accent**: `#fffc99` (Light yellow)
- **Background**: `#eafdcf` (Pale green)
- **Text/Dark**: `#8e8358` (Olive green)

### Spanish Labels

All user-facing text must be in Spanish:
- "Crear Tarea" (Create Task)
- "Editar Tarea" (Edit Task)
- "Tareas" (Tasks)
- "Panel de Control" (Dashboard)
- "Cerrar Sesión" (Logout)

## Documentation

- **Database Schema**: `agent_docs/DATABASE.md`
- **POC Plan**: `agent_docs/poc-implementation-plan.md`
- **Main README**: `README.md`

## Important Notes

1. **Multi-tenant**: Every todo operation must be scoped to the authenticated user
2. **RLS Policies**: Database enforces user isolation - don't bypass
3. **Type Safety**: Always use Supabase-generated types, never create custom types that duplicate database schema
4. **Refine v5**: This project uses the latest Refine v5 API with React Query v5 - follow the patterns exactly
5. **Form State**: Always initialize forms with `defaultValues` to prevent React warnings

## Quick Reference

**Resource Configuration** (in `_refine_context.tsx`):
```typescript
{
  name: "todo", // singular
  list: "/dashboard/todos",
  create: "/dashboard/todos/create",
  edit: "/dashboard/todos/edit/:id",
  show: "/dashboard/todos/show/:id",
}
```

**Hook Imports**:
```typescript
import { useList, useShow, useCreate, useUpdate, useDelete, HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useTable } from "@refinedev/react-table";
```

**Type Imports**:
```typescript
import type { Todo } from "@/types/todo";
import type { User } from "@/types/user";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.extended";
```
