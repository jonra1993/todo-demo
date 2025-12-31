"use client";

import { supabaseBrowserClient } from "@utils/supabase/client";
import { liveProvider as liveProviderSupabase } from "@refinedev/supabase";

export const liveProvider = liveProviderSupabase(supabaseBrowserClient);
