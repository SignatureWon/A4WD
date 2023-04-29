import { supabase } from "$lib/supabaseClient";
import { error, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const removeEmptyForeignKeys = (data) => {
  ["vehicles", "depots", "suppliers", "categories"].forEach((key) => {
    if (key in data) {
      if (data[key] === "") {
        delete data[key];
      }
    }
  });
};

const convertToDate = (data) => {
  [
    "date_start",
    "date_end",
    "travel_start",
    "travel_end",
    "booking_start",
    "booking_end",
  ].forEach((key) => {
    if (key in data) {
      data[key] = dayjs(data[key], "DD/MM/YYYY").format("MM/DD/YYYY");
    }
  });
};
const convertToJson = (data) => {
  ["tiers", "json_details"].forEach((key) => {
    if (key in data) {
      data[key] = JSON.parse(data[key]);
    }
  });
};
const slugifyName = (fetch, data) => {
  if (["contents", "vehicles"].includes(fetch.table)) {
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

// const uploadFiles = async (data, locals) => {
//   for (const key in data) {
//     if (key.indexOf("fileUpload_") === 0) {
//       console.log("found", key);
//       const field = key.replace("fileUpload_", "");
//       if (data[key].size) {
//         console.log("to upload", key);

//         const { data: dataFile, error: errFile } = await locals.sb.storage
//           .from(data[`fileBucket_${field}`])
//           .upload(data[`fileName_${field}`], data[`fileUpload_${field}`]);
//         if (errFile) {
//           throw error(404, {
//             message: errFile.message,
//           });
//         }
//       }
//       delete data[`fileUpload_${field}`];
//       delete data[`fileName_${field}`];
//       delete data[`fileBucket_${field}`];
//     }
//   }
//   return data
// };

export const db = {
  one: async (fetch) => {
    let record = {};
    fetch.keys.forEach((key) => {
      record[key] = null;
    });

    if (fetch.id !== "add") {
      const { data, error: err } = await supabase
        .from(fetch.table)
        .select(fetch.keys.join(",") || "*")
        .eq("id", fetch.id)
        .single();

      if (err) {
        throw error(404, {
          message: err.message,
        });
      }
      record = data;
    }
    return record;
  },
  all: async (fetch) => {
    let query = supabase.from(fetch.table).select(fetch.keys.join(",") || "*");

    if (fetch.eq) {
      fetch.eq.forEach((col) => {
        query = query.eq(col.name, col.value);
      });
    }
    if (fetch.order) {
      fetch.order.forEach((col) => {
        query = query.order(col.name, { ascending: col.ascend });
      });
    }
    // if (fetch.keys.includes("status")) {
    //   query.eq("status", true);
    // }
    // if (fetch.keys.includes("rank")) {
    //   query.order("rank", { ascending: true });
    // }
    const { data, error: err } = await query;

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    return data;
  },
  related: async (fetch) => {
    let query = supabase.from(fetch.table).select("id, name");

    if (fetch.eq) {
      fetch.eq.forEach((col) => {
        query = query.eq(col.name, col.value);
      });
    }
    if (fetch.in) {
      fetch.in.forEach((col) => {
        query = query.in(col.name, col.value);
      });
    }
    if (fetch.order) {
      fetch.order.forEach((col) => {
        query = query.order(col.name, { ascending: col.ascend });
      });
    }

    const { data, error: err } = await query;

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    return data;
  },
  insert: async (locals, fetch) => {
    const { data, error: err } = await locals.sb
      .from(fetch.table)
      .insert(fetch.data)
      .select();

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
  },
  delete: async (locals, fetch) => {
    const { data, error: err } = await locals.sb
      .from(fetch.table)
      .delete()
      .eq(fetch.key, fetch.value);

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }
  },
  actions: {
    insert: async (request, url, locals, fetch) => {
      // let newData = {};
      const formData = await request.formData();
      let newData = Object.fromEntries(formData.entries());
      // for (const pair of formData.entries()) {
      //   if (pair[1]) {
      //     newData[pair[0]] = pair[1];
      //   }
      // }

      removeEmptyForeignKeys(newData);
      convertToDate(newData);
      convertToJson(newData);
      slugifyName(fetch, newData);
      // uploadFiles(newData, locals);

      // console.log("newData", newData);

      for (const key in newData) {
        if (key.indexOf("fileUpload_") === 0) {
          const field = key.replace("fileUpload_", "");
          if (newData[key].size) {
            const { data: dataFile, error: errFile } = await locals.sb.storage
              .from(newData[`fileBucket_${field}`])
              .upload(
                newData[`fileName_${field}`],
                newData[`fileUpload_${field}`]
              );
            if (errFile) {
              throw error(404, {
                message: errFile.message,
              });
            }
          }
          delete newData[`fileUpload_${field}`];
          delete newData[`fileName_${field}`];
          delete newData[`fileBucket_${field}`];
        }
      }

      const { data, error: err } = await locals.sb
        .from(fetch.table)
        .insert(newData)
        .select()
        .single();

      if (err) {
        throw error(404, {
          message: err.message,
        });
      }

      let path = url.pathname.split("/");
      path.pop();
      throw redirect(303, `${path.join("/")}/${data.id}`);
    },
    update: async (request, url, locals, fetch) => {
      const formData = await request.formData();
      let newData = Object.fromEntries(formData.entries());

      removeEmptyForeignKeys(newData);
      convertToDate(newData);
      convertToJson(newData);
      slugifyName(fetch, newData);
      // newData = uploadFiles(newData, locals);

      for (const key in newData) {
        if (key.indexOf("fileUpload_") === 0) {
          const field = key.replace("fileUpload_", "");
          if (newData[key].size) {
            const { data: dataFile, error: errFile } = await locals.sb.storage
              .from(newData[`fileBucket_${field}`])
              .upload(
                newData[`fileName_${field}`],
                newData[`fileUpload_${field}`]
              );
            if (errFile) {
              throw error(404, {
                message: errFile.message,
              });
            }
          }
          delete newData[`fileUpload_${field}`];
          delete newData[`fileName_${field}`];
          delete newData[`fileBucket_${field}`];
        }
      }

      const { error: err } = await locals.sb
        .from(fetch.table)
        .update(newData)
        .eq("id", fetch.id);

      if (err) {
        throw error(404, {
          message: err.message,
        });
      }

      return newData;
    },
    delete: async (request, url, locals, fetch) => {
      const { error: err } = await locals.sb
        .from(fetch.table)
        .delete()
        .eq("id", fetch.id);

      if (err) {
        throw error(404, {
          message: err.message,
        });
      }

      let path = url.pathname.split("/");
      path.pop();
      throw redirect(303, `${path.join("/")}`);
    },
    duplicate: async (request, url, locals, fetch) => {
      let newData = {};

      const { data: dataOri, error: errOri } = await locals.sb
        .from(fetch.table)
        .select()
        .eq("id", fetch.id)
        .single();

      for (const key in dataOri) {
        if (dataOri[key]) {
          newData[key] = dataOri[key];
        }
      }

      newData.name += " Copy";
      sanitize(newData);
      slugifyName(fetch, newData);

      const { data: dataNew, error: errNew } = await locals.sb
        .from(fetch.table)
        .insert(newData)
        .select()
        .single();

      if (errNew) {
        throw error(404, {
          message: errNew.message,
        });
      }

      let path = url.pathname.split("/");
      path.pop();
      throw redirect(303, `${path.join("/")}/${dataNew.id}`);
    },
  },
};
