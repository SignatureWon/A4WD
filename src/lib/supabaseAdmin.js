import { createClient } from "@supabase/auth-helpers-sveltekit";
import { PUBLIC_URL } from "$env/static/public";
import { DB_SERVICE } from "$env/static/private";

export const supabase = createClient(PUBLIC_URL, DB_SERVICE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
