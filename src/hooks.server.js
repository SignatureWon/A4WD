import "$lib/supabase";
import ws from "ws";
import { createServerClient } from "@supabase/ssr";
import { env } from "$env/dynamic/public";

export const handle = async ({ event, resolve }) => {
  event.locals.sb = createServerClient(env.PUBLIC_URL, env.PUBLIC_ANON, {
    realtime: {
      transport: ws,
    },
    cookies: {
      getAll() {
        return event.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            event.cookies.set(name, value, { ...options, path: "/" });
          } catch (error) {
            // This can happen on Vercel/SvelteKit when trying to set cookies
            // after the response headers have been sent or in certain load contexts.
            // We log it but don't let it crash the request.
            console.error(`Error setting cookie ${name}:`, error);
          }
        });
      },
    },
  });

  /**
   * Optimization: Only call getSession if there are Supabase-related cookies and the
   * request is not for a static asset or standard media file.
   * This prevents unnecessary API calls and avoids parallel token refresh race conditions.
   */
  const hasSupabaseCookie = event.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  
  const isAsset = event.url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|otf|txt|map)$/) ||
                  (event.url.pathname.endsWith('.json') && !event.url.pathname.endsWith('__data.json'));

  if (hasSupabaseCookie && !isAsset) {
    try {
      const {
        data: { session },
      } = await event.locals.sb.auth.getSession();
      event.locals.session = session;
    } catch (e) {
      console.error("Error getting session in hooks.server.js:", e);
      event.locals.session = null;
    }
  } else {
    event.locals.session = null;
  }

  return await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
// import '$lib/supabaseClient'
