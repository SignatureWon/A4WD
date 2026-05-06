import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  const session = event.locals.session;
  // console.log('session', session);
  if (!session) {
    throw redirect(303, "/login");
  }
  return {
    session: session,
  };
};
