"use client";

import { useList, HttpError } from "@refinedev/core";
import { CheckCircle2, Circle, AlertCircle, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/types/todo";

export default function DashboardPage() {
  const { result, query } = useList<Todo, HttpError>({
    resource: "todo"
  });

  const todos = useMemo(() => result.data ?? [], [result.data]);

  const stats = useMemo(() => {
    const totalCount = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = totalCount - completed;
    const highPriority = todos.filter(
      (t) => t.priority === "high" && !t.completed
    ).length;
    const now = new Date();
    const overdue = todos.filter(
      (t) =>
        !t.completed &&
        t.due_date &&
        new Date(t.due_date) < now
    ).length;

    return {
      total: totalCount,
      completed,
      pending,
      highPriority,
      overdue,
    };
  }, [todos]);

  if (query.isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-6">
        <div className="text-center space-y-2">
          <div className="text-destructive font-medium">
            Error al cargar las tareas
          </div>
          <div className="text-sm text-muted-foreground">
            No se pudieron cargar las tareas. Por favor, intenta de nuevo.
          </div>
          <Button variant="outline" onClick={() => query.refetch()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <Link href="/dashboard/todos/create">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Crear Tarea
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Tareas
            </CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Todas las tareas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.completed / stats.total) * 100)}% completado`
                : "0% completado"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Tareas por completar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prioridad Alta</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <Calendar className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Pasaron la fecha límite
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repositorio de Tareas</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoRepository todos={todos} />
        </CardContent>
      </Card>
    </div>
  );
}

function TodoRepository({ todos }: Readonly<{ todos: Todo[] }>) {
  const completed = todos.filter((t) => t.completed);
  const pending = todos.filter((t) => !t.completed);
  const now = new Date();
  const overdue = todos.filter(
    (t) => !t.completed && t.due_date && new Date(t.due_date) < now
  );

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-destructive">
            Vencidas ({overdue.length})
          </h3>
          <div className="space-y-2">
            {overdue.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Pendientes ({pending.length})</h3>
          <div className="space-y-2">
            {pending
              .filter((t) => !overdue.some((o) => o.id === t.id))
              .map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">
            Completadas ({completed.length})
          </h3>
          <div className="space-y-2">
            {completed.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No hay tareas. Crea tu primera tarea para comenzar.
        </div>
      )}
    </div>
  );
}

function TodoItem({ todo }: Readonly<{ todo: Todo }>) {
  return (
    <Link href={`/dashboard/todos/show/${todo.id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {todo.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{todo.title}</h4>
                {todo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {todo.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {todo.priority && (
                <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                  {(() => {
                    if (todo.priority === "high") return "Alta";
                    if (todo.priority === "medium") return "Media";
                    return "Baja";
                  })()}
                </span>
              )}
              {todo.due_date && (
                <span className="text-xs text-muted-foreground">
                  {new Date(todo.due_date).toLocaleDateString("es-ES")}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
