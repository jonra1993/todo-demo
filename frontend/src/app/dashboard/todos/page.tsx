"use client";

import { useDelete } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Plus, Edit, Trash2, Eye, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Todo } from "@/types/todo";

export default function TodosPage() {
  const columns = useMemo<ColumnDef<Todo>[]>(
    () => [
      {
        id: "completed",
        accessorKey: "completed",
        header: "Estado",
        cell: ({ getValue }) => {
          const completed = getValue() as boolean;
          return completed ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          );
        },
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Título",
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Prioridad",
        cell: ({ getValue }) => {
          const priority = getValue() as string;
          if (!priority) return "-";
          const variants: Record<string, string> = {
            high: "destructive",
            medium: "default",
            low: "secondary",
          };
          const labels: Record<string, string> = {
            high: "Alta",
            medium: "Media",
            low: "Baja",
          };
          return (
            <Badge variant={variants[priority] as any}>
              {labels[priority]}
            </Badge>
          );
        },
      },
      {
        id: "due_date",
        accessorKey: "due_date",
        header: "Fecha Límite",
        cell: ({ getValue }) => {
          const date = getValue() as string | undefined | null;
          if (!date) return "-";
          return new Date(date).toLocaleDateString("es-ES");
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const todo = row.original;
          return (
            <div className="flex gap-2">
              <Link href={`/dashboard/todos/show/${todo.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/dashboard/todos/edit/${todo.id}`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <DeleteButton todoId={todo.id} />
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useTable({
    columns,
    refineCoreProps: {
      resource: "todo",
    },
  });

  const {
    reactTable: { getHeaderGroups, getRowModel },
    refineCore: { tableQuery },
  } = table;

  const todos = tableQuery.data?.data ?? [];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tareas</CardTitle>
            <Link href="/dashboard/todos/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Crear Tarea
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay tareas. Crea tu primera tarea.
            </div>
          ) : (
            <Table>
              <TableHeader>
                {getHeaderGroups().map((headerGroup: any) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: any) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {getRowModel().rows.map((row: any) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteButton({ todoId }: Readonly<{ todoId: string }>) {
  const { mutate: deleteTodo } = useDelete();

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      deleteTodo({
        resource: "todo",
        id: todoId,
      });
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
