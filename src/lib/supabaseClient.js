import { createClient } from "@supabase/auth-helpers-sveltekit";
import { env } from "$env/dynamic/public";

export const supabase = createClient(env.PUBLIC_URL, env.PUBLIC_ANON);
