import { Tables, TablesInsert, TablesUpdate } from "./supabase.extended";

export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo extends Tables<"todo"> {}

export interface CreateTodoInput extends TablesInsert<"todo"> {}

export interface UpdateTodoInput extends TablesUpdate<"todo"> {}
