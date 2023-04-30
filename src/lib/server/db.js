import { supabase } from "$lib/supabaseClient";
import { error, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const removeEmptyForeignKeys = (data) => {
  ["vehicles", "depots", "suppliers", "categories", "age", "license"].forEach(
    (key) => {
      if (key in data) {
        if (data[key] === "") {
          delete data[key];
        }
      }
    }
  );
};

const setNull = (data) => {
  for (const key in data) {
    if (data[key] === "") {
      data[key] = null;
      console.log(key, data[key]);
    }
  }
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
    if ("name" in data) {
      data.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
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

      // removeEmptyForeignKeys(newData);
      setNull(newData);
      convertToDate(newData);
      convertToJson(newData);
      slugifyName(fetch, newData);
      // uploadFiles(newData, locals);

      // console.log("newData", newData);

      let manyTables = {};

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

        if (key.indexOf("imageUpload_") === 0) {
          const field = key.replace("imageUpload_", "");
          if (newData[key].size) {
            await img.upload(
              newData[`imageUpload_${field}`],
              newData[`imageName_${field}`],
              newData[`imageBucket_${field}`],
              800,
              600
            );
            await img.upload(
              newData[`imageThumb_${field}`],
              `thumb-${newData[`imageName_${field}`]}`,
              newData[`imageBucket_${field}`],
              400,
              300
            );
          }
          delete newData[`imageUpload_${field}`];
          delete newData[`imageThumb_${field}`];
          delete newData[`imageName_${field}`];
          delete newData[`imageBucket_${field}`];
        }

        if (key.indexOf("manySelected_") === 0) {
          const field = key.replace("manySelected_", "");
          manyTables[field] = {
            selected: newData[`manySelected_${field}`],
            newselected: newData[`manyNewSelected_${field}`],
            unselected: newData[`manyUnSelected_${field}`],
            table: newData[`manyTable_${field}`],
            // id: newData[`manyID_${field}`],
          };
          delete newData[`manySelected_${field}`];
          delete newData[`manyUnSelected_${field}`];
          delete newData[`manyNewSelected_${field}`];
          delete newData[`manyTable_${field}`];
          // delete newData[`manyID_${field}`];
        }
      }

      // console.log("newData", newData);

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

      // console.log("manydata", data);

      for (const key in manyTables) {
        const table = manyTables[key].table;
        const many = table.split("_");
        const id = data.id;
        const selected = manyTables[key].selected
          ? manyTables[key].selected.split(",")
          : [];
        const newselected = manyTables[key].newselected
          ? manyTables[key].newselected.split(",")
          : [];
        const unselected = manyTables[key].unselected
          ? manyTables[key].unselected.split(",")
          : [];

        newselected.forEach(async (item) => {
          if (!selected.includes(item)) {
            let relation = {};
            relation[many[0]] = id;
            relation[many[1]] = item;
            await locals.sb.from(table).insert(relation).select().single();
          }
        });
        unselected.forEach(async (item) => {
          if (selected.includes(item)) {
            await locals.sb
              .from(table)
              .delete()
              .eq(many[0], id)
              .eq(many[1], item);
          }
        });
      }

      let path = url.pathname.split("/");
      path.pop();
      throw redirect(303, `${path.join("/")}/${data.id}`);
    },
    update: async (request, url, locals, fetch) => {
      const formData = await request.formData();
      let newData = Object.fromEntries(formData.entries());

      setNull(newData);
      convertToDate(newData);
      convertToJson(newData);
      slugifyName(fetch, newData);
      // newData = uploadFiles(newData, locals);
      let manyTables = {};

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

        if (key.indexOf("imageUpload_") === 0) {
          const field = key.replace("imageUpload_", "");

          const { data: imageFile, error: errFile } = await locals.sb.storage
            .from(newData[`imageBucket_${field}`])
            .upload(
              newData[`imageName_${field}`],
              newData[`imageUpload_${field}`]
            );
          if (errFile) {
            throw error(404, {
              message: errFile.message,
            });
          }

          // let uploadImage = JSON.parse(newData[`imageUpload_${field}`])
          // let uploadThumb = JSON.parse(newData[`imageThumb_${field}`])

          // console.log("newData[`imageUpload_${field}`]", newData[`imageUpload_${field}`]);

          // if (newData[`imageUpload_${field}`].size) {
          //   await img.upload(
          //     newData[`imageUpload_${field}`],
          //     newData[`imageName_${field}`],
          //     newData[`imageBucket_${field}`],
          //     800,
          //     600
          //   );
          //   await img.upload(
          //     newData[`imageThumb_${field}`],
          //     `thumb-${newData[`imageName_${field}`]}`,
          //     newData[`imageBucket_${field}`],
          //     400,
          //     300
          //   );
          // }
          delete newData[`imageUpload_${field}`];
          // delete newData[`imageThumb_${field}`];
          delete newData[`imageName_${field}`];
          delete newData[`imageBucket_${field}`];
        }

        if (key.indexOf("manySelected_") === 0) {
          const field = key.replace("manySelected_", "");
          manyTables[field] = {
            selected: newData[`manySelected_${field}`],
            newselected: newData[`manyNewSelected_${field}`],
            unselected: newData[`manyUnSelected_${field}`],
            table: newData[`manyTable_${field}`],
            // id: newData[`manyID_${field}`],
          };
          delete newData[`manySelected_${field}`];
          delete newData[`manyUnSelected_${field}`];
          delete newData[`manyNewSelected_${field}`];
          delete newData[`manyTable_${field}`];
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

      for (const key in manyTables) {
        const table = manyTables[key].table;
        const many = table.split("_");
        const id = fetch.id;
        const selected = manyTables[key].selected
          ? manyTables[key].selected.split(",")
          : [];
        const newselected = manyTables[key].newselected
          ? manyTables[key].newselected.split(",")
          : [];
        const unselected = manyTables[key].unselected
          ? manyTables[key].unselected.split(",")
          : [];

        newselected.forEach(async (item) => {
          if (!selected.includes(item)) {
            let relation = {};
            relation[many[0]] = id;
            relation[many[1]] = item;
            await locals.sb.from(table).insert(relation).select().single();
          }
        });
        unselected.forEach(async (item) => {
          if (selected.includes(item)) {
            await locals.sb
              .from(table)
              .delete()
              .eq(many[0], id)
              .eq(many[1], item);
          }
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
