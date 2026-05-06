// export const csr = false;

export const load = async ({ parent }) => {
  const { session } = await parent();
  return { session };
};