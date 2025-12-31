import { Tables, TablesInsert, TablesUpdate } from "./supabase.extended";

export interface User extends Tables<"user"> {}

export interface CreateUserInput extends TablesInsert<"user"> {}

export interface UpdateUserInput extends TablesUpdate<"user"> {}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}
