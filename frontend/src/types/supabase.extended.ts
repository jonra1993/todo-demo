//@ts-nocheck
import type { MergeDeep, PartialDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./supabase";

/**
 * ============================================================================
 * TABLE EXTENSIONS (JSONB Schema Definitions)
 * ============================================================================
 */
export interface TableExtensions {

}

/**
 * ============================================================================
 * SUPABASE TYPE UTILITIES
 * ============================================================================
 */

// Type utility to extend Row, Insert, Update if they exist
type ExtendTableOrView<T, Ext> = T extends { Row: infer R }
  ? {
      Row: MergeDeep<R, Ext>;
    } & (T extends { Insert: infer I; Update: infer U }
      ? {
          Insert: MergeDeep<I, Ext>;
          Update: MergeDeep<U, PartialDeep<Ext>>;
        }
      : {})
  : T;

// Utility to map over Tables and apply extensions
type ExtendedTables<T_Tables, T_Extensions> = {
  [K in keyof T_Tables]: K extends keyof T_Extensions
    ? ExtendTableOrView<T_Tables[K], T_Extensions[K]>
    : T_Tables[K];
};

// Utility to map over Views and apply extensions
type ExtendedViews<T_Views, T_Extensions> = {
  [K in keyof T_Views]: K extends keyof T_Extensions
    ? ExtendTableOrView<T_Views[K], T_Extensions[K]>
    : T_Views[K];
};

// Construct the extended public schema parts
type ExtendedPublicSchema = {
  Tables: ExtendedTables<
    DatabaseGenerated["public"]["Tables"],
    TableExtensions
  >;
  Views: ExtendedViews<DatabaseGenerated["public"]["Views"], TableExtensions>;
};

/**
 * ============================================================================
 * FINAL DATABASE TYPE
 * ============================================================================
 */
export type Database = MergeDeep<
  DatabaseGenerated,
  { public: ExtendedPublicSchema }
>;

/**
 * ============================================================================
 * HELPER TYPES
 * ============================================================================
 */

// Extract the Public schema correctly from the potentially modified Database type
type PublicSchema = Database["public"];

export type TableName = keyof PublicSchema["Tables"];
export type ViewName = keyof PublicSchema["Views"];

// These helpers correctly infer the extended types
export type TableRow<T extends TableName> = PublicSchema["Tables"][T]["Row"];
export type TableView<T extends ViewName> = PublicSchema["Views"][T]["Row"];

// Combined type for Tables and Views Row access
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

// Insert types
export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

// Update types
export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

// Enums helper
export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
