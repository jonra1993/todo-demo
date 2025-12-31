"use client";

import type { DataProvider } from "@refinedev/core";
import { todoStore, userStore } from "@/store/memory-store";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "@/types/todo";

export const memoryDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    if (resource !== "todos") {
      throw new Error(`Resource ${resource} is not supported`);
    }

    const currentUserId = userStore.getCurrentUserId();
    if (!currentUserId) {
      return {
        data: [],
        total: 0,
      };
    }

    // Get all todos for current user
    let todos = todoStore.getAll(currentUserId);

    // Apply filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.operator === "eq") {
          if (filter.field === "completed") {
            todos = todos.filter(
              (t) => t.completed === (filter.value === true || filter.value === "true")
            );
          } else if (filter.field === "priority") {
            todos = todos.filter((t) => t.priority === filter.value);
          }
        } else if (filter.operator === "contains") {
          if (filter.field === "title") {
            const searchTerm = String(filter.value).toLowerCase();
            todos = todos.filter((t) =>
              t.title.toLowerCase().includes(searchTerm)
            );
          }
        }
      });
    }

    // Apply sorting
    if (sorters && sorters.length > 0) {
      sorters.forEach((sorter) => {
        todos.sort((a, b) => {
          const aValue = a[sorter.field as keyof Todo];
          const bValue = b[sorter.field as keyof Todo];

          if (aValue === undefined) return 1;
          if (bValue === undefined) return -1;

          if (aValue < bValue) return sorter.order === "asc" ? -1 : 1;
          if (aValue > bValue) return sorter.order === "asc" ? 1 : -1;
          return 0;
        });
      });
    }

    const total = todos.length;

    // Apply pagination
    if (pagination) {
      const { current = 1, pageSize = 10 } = pagination;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      todos = todos.slice(start, end);
    }

    return {
      data: todos,
      total,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    if (resource !== "todos") {
      throw new Error(`Resource ${resource} is not supported`);
    }

    const currentUserId = userStore.getCurrentUserId();
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    const todo = todoStore.findById(String(id), currentUserId);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    return {
      data: todo,
    };
  },

  create: async ({ resource, variables, meta }) => {
    if (resource !== "todos") {
      throw new Error(`Resource ${resource} is not supported`);
    }

    const currentUserId = userStore.getCurrentUserId();
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    const todoData = variables as CreateTodoInput;
    const newTodo = todoStore.create(currentUserId, todoData);

    return {
      data: newTodo,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    if (resource !== "todos") {
      throw new Error(`Resource ${resource} is not supported`);
    }

    const currentUserId = userStore.getCurrentUserId();
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    const updates = variables as UpdateTodoInput;
    const updatedTodo = todoStore.update(String(id), currentUserId, updates);

    if (!updatedTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    return {
      data: updatedTodo,
    };
  },

  deleteOne: async ({ resource, id, meta }) => {
    if (resource !== "todos") {
      throw new Error(`Resource ${resource} is not supported`);
    }

    const currentUserId = userStore.getCurrentUserId();
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    const deleted = todoStore.delete(String(id), currentUserId);
    if (!deleted) {
      throw new Error(`Todo with id ${id} not found`);
    }

    return {
      data: { id },
    };
  },

  getApiUrl: () => {
    return "";
  },
};
