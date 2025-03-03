import { createClient } from "@supabase/auth-helpers-sveltekit";
import { env } from "$env/dynamic/public";

export const supabase = createClient(env.PUBLIC_DB_URL, env.PUBLIC_DB_SERVICE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
