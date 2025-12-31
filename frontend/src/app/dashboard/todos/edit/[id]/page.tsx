"use client";

import React, { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useUpdate, useShow } from "@refinedev/core";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const todoSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional().nullable(),
  due_date: z.date().optional().nullable(),
  completed: z.boolean().optional(),
});

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { mutate: updateTodo } = useUpdate();
  const {
    result: todo,
    query: { isFetching, isError },
  } = useShow<Todo>({
    resource: "todo",
    id
  });

  const form = useForm({
    resolver: zodResolver(todoSchema),
    refineCoreProps: {
      resource: "todo",
      action: "edit",
      id,
    },
    defaultValues: {
      title: "",
      description: "",
      priority: undefined,
      due_date: undefined,
      completed: false,
    },
  });

  const {
    refineCore: { formLoading },
    control,
    handleSubmit,
    reset,
  } = form;

  // Update form when todo data loads
  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title || "",
        description: todo.description || null,
        priority: (todo.priority as "low" | "medium" | "high" | null) || null,
        due_date: todo.due_date ? new Date(todo.due_date) : null,
        completed: todo.completed || false,
      });
    }
  }, [todo, reset]);

  const onSubmit = (data: any) => {
    updateTodo(
      {
        resource: "todo",
        id,
        values: {
          ...data,
          due_date: data.due_date ? data.due_date.toISOString() : null,
        },
      },
      {
        onSuccess: () => {
          router.push("/dashboard/todos");
        },
      }
    );
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

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Tarea</CardTitle>
          <CardDescription>
            Modifica los detalles de la tarea
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título de la tarea" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción de la tarea (opcional)"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una prioridad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="due_date"
                render={({ field }) => {
                  let selectedDate: Date | undefined = undefined;
                  if (field.value) {
                    selectedDate =
                      field.value instanceof Date
                        ? field.value
                        : new Date(field.value);
                  }

                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha Límite</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP", { locale: es })
                                : "Selecciona una fecha"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Completada</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={formLoading}
                >
                  {formLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/todos")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
