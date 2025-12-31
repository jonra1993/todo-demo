import { createBrowserClient } from "@supabase/ssr";
import { NEXT_PUBLIC_SUPABASE_KEY, NEXT_PUBLIC_SUPABASE_URL } from "@/constants";
import { Database } from "@/types/supabase.extended";

export const supabaseBrowserClient = createBrowserClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_KEY,
  {
    db: {
      schema: "public",
    },
  }
);
