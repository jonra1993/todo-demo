"use client";

import { useShow, useDelete } from "@refinedev/core";
import { useRouter, useParams } from "next/navigation";
import { Edit, Trash2, ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Todo } from "@/types/todo";

export default function ShowTodoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const {
    result: todo,
    query: { isFetching, isError, refetch },
  } = useShow<Todo>({
    resource: "todo",
    id,
  });

  const { mutate: deleteTodo } = useDelete();

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      deleteTodo(
        {
          resource: "todo",
          id,
        },
        {
          onSuccess: () => {
            router.push("/dashboard/todos");
          },
        }
      );
    }
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Cargando...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8">
            <div className="text-center space-y-2">
              <div className="text-destructive font-medium">
                Error al cargar la tarea
              </div>
              <div className="text-sm text-muted-foreground">
                No se pudo cargar la tarea. Por favor, intenta de nuevo.
              </div>
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                >
                  Reintentar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/todos")}
                >
                  Volver a la lista
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8">
            <div className="text-center space-y-2">
              <div className="text-muted-foreground">
                Tarea no encontrada
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/todos")}
                className="mt-4"
              >
                Volver a la lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const priorityLabels: Record<string, string> = {
    high: "Alta",
    medium: "Media",
    low: "Baja",
  };

  const priorityVariants: Record<string, string> = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/todos">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {todo.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  {todo.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  Detalles de la tarea
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/todos/edit/${id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Estado
            </h3>
            <Badge variant={todo.completed ? "default" : "secondary"}>
              {todo.completed ? "Completada" : "Pendiente"}
            </Badge>
          </div>

          {todo.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Descripción
              </h3>
              <p className="text-sm">{todo.description}</p>
            </div>
          )}

          {todo.priority && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Prioridad
              </h3>
              <Badge
                variant={priorityVariants[todo.priority] as any}
              >
                {priorityLabels[todo.priority]}
              </Badge>
            </div>
          )}

          {todo.due_date && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Fecha Límite
              </h3>
              <p className="text-sm">
                {format(new Date(todo.due_date), "PPP", { locale: es })}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Fecha de Creación
            </h3>
            <p className="text-sm">
              {format(new Date(todo.created_at), "PPP", { locale: es })}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Última Actualización
            </h3>
            <p className="text-sm">
              {format(new Date(todo.updated_at), "PPP", { locale: es })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
