import { supabase } from "$lib/supabaseClient";

const removeEmptyForeignKeys = (data) => {
  ["vehicles", "depots", "suppliers", "categories"].forEach((key) => {
    if (key in data) {
      if (data[key] === "") {
        delete data[key];
      }
    }
  });
  // for (const [key, value] of Object.entries(data)) {
  //   if (["vehicles", "depots", "suppliers", "categories"].includes(key)) {
  //     if (value === "") {
  //       delete data[key];
  //     }
  //   }
  // }
};
const slugifyName = (fetch, data) => {
  if (["contents", "vehicles"].includes(fetch.from)) {
    console.log("SLUGG", data)
    data.slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    }
};
const sanitize = (data) => {
  [
    "inserted",
    "deleted",
    "updated",
    "error",
    "duplicated",
    "id",
    "created_at",
    "updated_at",
  ].forEach((key) => {
    if (key in data) {
      delete data[key];
    }
  });
};
export const db = {
  default: (schema) => {
    let res = {};
    for (const key in schema) {
      res[key] = schema[key].default;
    }
    return res;
  },

  one: async (fetch) => {
    const { data, error } = await supabase
      .from(fetch.from)
      .select(fetch.select || "*")
      .eq("id", fetch.id)
      .single();

    if (error) {
      error.error = true;
      return error;
    }
    return data;
  },

  all: async (fetch) => {
    let query = supabase.from(fetch.from).select(fetch.select || "*");

    if (fetch.eq) {
      fetch.eq.forEach((col) => {
        query = query.eq(col.name, col.value);
      });
    }

    const { data } = await query;

    return data;
  },

  insert: async (fetch, data) => {
    sanitize(data);
    removeEmptyForeignKeys(data);
    slugifyName(fetch, data);

    const { data: inserted, error } = await supabase
      .from(fetch.from)
      .insert([data])
      .select()
      .single();

    if (error) {
      error.error = true;
      return error;
    }

    inserted.inserted = true;
    return inserted;
  },

  update: async (fetch, data) => {
    sanitize(data);
    removeEmptyForeignKeys(data);
    slugifyName(fetch, data);

    const { error } = await supabase
      .from(fetch.from)
      .update(data)
      .eq("id", fetch.id);

    if (error) {
      error.error = true;
      return error;
    }

    data.updated = true;
    return data;
  },

  delete: async (fetch, data) => {
    // check uploaded images
    const { data: selected } = await supabase
      .from(fetch.from)
      .select()
      .eq("id", fetch.id)
      .single();

    // if ("image" in selected) {
    //   let file = selected["image"];
    //   if (file !== null || file !== "") {
    //     const { data, error } = await supabase.storage
    //       .from("contents")
    //       .remove([file, `thumb-${file}`]);
    //   }
    // }

    // ["images", "gallery"].forEach((key) => {
    //   if (key in selected) {
    //     selected[key].forEach(async (item) => {
    //       const { data, error } = await supabase.storage
    //         .from("gallery")
    //         .remove([item.name, `thumb-${item.name}`]);
    //     });
    //   }
    // });

    const { error } = await supabase
      .from(fetch.from)
      .delete()
      .eq("id", fetch.id);
    if (error) {
      error.error = true;
      return error;
    }

    data.deleted = true;
    return data;
  },

  duplicate: async (fetch, data) => {
    data.name += " Copy";
    sanitize(data);
    removeEmptyForeignKeys(data);
    slugifyName(fetch, data);

    const { data: inserted, error } = await supabase
      .from(fetch.from)
      .insert([data])
      .select()
      .single();

    if (error) {
      error.error = true;
      return error;
    }

    inserted.duplicated = true;
    return inserted;
  },
};
