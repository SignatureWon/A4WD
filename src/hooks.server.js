import "$lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { env } from "$env/dynamic/public";

export const handle = async ({ event, resolve }) => {
  event.locals.sb = createServerClient(env.PUBLIC_URL, env.PUBLIC_ANON, {
    cookies: {
      getAll() {
        return event.cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: "/" });
          });
        } catch (error) {
          // Prevent the "Cannot use `cookies.set(...)`" error on Vercel
        }
      },
    },
  });

  const {
    data: { session },
  } = await event.locals.sb.auth.getSession();

  event.locals.session = session;

  return await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
// import '$lib/supabaseClient'
