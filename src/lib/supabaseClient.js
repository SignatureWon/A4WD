import { createBrowserClient } from "@supabase/ssr";
import { env } from "$env/dynamic/public";

export const supabase = createBrowserClient(env.PUBLIC_URL, env.PUBLIC_ANON);
