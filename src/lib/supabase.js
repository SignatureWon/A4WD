import ws from "ws";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_URL } from "$env/static/public";
import { DB_SERVICE } from "$env/static/private";

export const supabaseClient = createClient(PUBLIC_URL, DB_SERVICE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: ws,
  },
});
