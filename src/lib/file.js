export const f = {
  extension: (filename) => {
    const lastDot = filename.lastIndexOf(".");
    const ext = filename.substring(lastDot + 1);
    return ext;
  },
  upload: async (locals, fetch) => {
    const { data, error: err } = await locals.sb
      .from(fetch.bucket)
      .upload(fetch.name, fetch.file);
    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
    return data;
  },
};
