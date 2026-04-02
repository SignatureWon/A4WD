import { getServerSession } from '@supabase/auth-helpers-sveltekit'
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  const session = await getServerSession(event);
  // console.log('session', session);
  if (!session) {
    throw redirect(303, "/login")
  }
  return {
    session: session,
    // session: await getServerSession(event),
  }
}
