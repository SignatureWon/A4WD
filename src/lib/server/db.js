import { supabase } from "$lib/supabaseClient";
import { error, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// const removeEmptyForeignKeys = (data) => {
//   ["vehicles", "depots", "suppliers", "categories", "age", "license"].forEach(
//     (key) => {
//       if (key in data) {
//         if (data[key] === "") {
//           delete data[key];
//         }
//       }
//     }
//   );
// };

const setNull = (data) => {
  for (const key in data) {
    if (data[key] === "") {
      data[key] = null;
      // console.log(key, data[key]);
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
  [
    "tiers",
    "json_details",
    "specifications",
    "faqs",
    "images",
    "addons",
    "compulsory",
    "routes",
    "depots",
    "fees",
  ].forEach((key) => {
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
    // fetch.data = setNull(fetch.data);
    // convertToDate(fetch.data);
    // convertToJson(fetch.data);
    // slugifyName(fetch, fetch.data);

    // console.log("fetch.data", fetch.data);

    const { data, error: err } = await locals.sb
      .from(fetch.table)
      .insert(fetch.data)
      .select();
    // .single()

    if (err) {
      throw error(404, {
        message: err.message,
      });
    }

    return data;
  },
  update: async (locals, fetch) => {
    setNull(fetch.data);

    console.log("fetch.data", fetch.data);
    // convertToDate(fetch.data);
    // convertToJson(fetch.data);
    // slugifyName(fetch, fetch.data);

    const { error: err } = await locals.sb
      .from(fetch.table)
      .update(fetch.data)
      .eq("id", fetch.id);

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
    insertProfile: async (request, url, locals, fetch) => {
      const formData = await request.formData();
      let newData = Object.fromEntries(formData.entries());
      let path = url.pathname.split("/");
      path.pop();

      const { data: checkUser } = await locals.sb
        .from("profiles")
        .select()
        .eq("email", newData.email)
        .single();

      if (!checkUser) {
        const { data: newUser, error: errUser } = await locals.sb.auth.signUp({
          email: newData.email,
          password: "password",
        });

        const { data, error: err } = await locals.sb
          .from(fetch.table)
          .update(newData)
          .eq("id", newUser.user.id);

        if (err) {
          console.log("err", err);
          throw error(404, {
            message: err.message,
          });
        }
        throw redirect(303, `${path.join("/")}/${newUser.user.id}`);
      } else {
        throw redirect(303, `${path.join("/")}/${checkUser.id}`);
      }
    },
    updatePassword: async (request, url, locals, fetch) => {
      const formData = await request.formData();
      let newData = Object.fromEntries(formData.entries());
      console.log(newData);

      const { data: user, error: err } = await locals.sb.auth.admin.updateUserById(
        fetch.id,
        { password: newData.password }
      );
      if (err) {
        console.log("err", err);
        throw error(404, {
          message: err.message,
        });
      }

      // const { data, error } = await await locals.sb.rpc("change_password", {pwd: newData.password, id: fetch.id})

      throw redirect(303, `${url.pathname}?success=update`);
    },
    insert: async (request, url, locals, fetch) => {
      const formData = await request.formData();
      let newData = Object.fromEntries(formData.entries());

      setNull(newData);
      convertToDate(newData);
      convertToJson(newData);
      slugifyName(fetch, newData);

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
          }
          delete newData[`imageUpload_${field}`];
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
          };
          delete newData[`manySelected_${field}`];
          delete newData[`manyUnSelected_${field}`];
          delete newData[`manyNewSelected_${field}`];
          delete newData[`manyTable_${field}`];
        }
      }

      const { data, error: err } = await locals.sb
        .from(fetch.table)
        .insert(newData)
        .select()
        .single();

      if (err) {
        console.log("err", err);
        throw error(404, {
          message: err.message,
        });
      }

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
          if (newData[key].size) {
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
          }
          delete newData[`imageUpload_${field}`];
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

      // let path = url.pathname.split("/");
      throw redirect(303, `${url.pathname}?success=update`);
      // return newData;
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
      const len = path.length;
      let depth = 4;
      if (path[3] === fetch.id) {
        depth = 3;
      }
      for (let i = depth; i < len; i++) {
        path.pop();
      }
      throw redirect(303, `${path.join("/")}`);
    },
    duplicate: async (request, url, locals, fetch) => {
      let newData = {};

      const { data: dataOri, error: errOri } = await locals.sb
        .from(fetch.table)
        .select()
        .eq("id", fetch.id)
        .single();

      // get only valued fields, remove all null fields
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

      if ("all_depots" in dataNew) {
        const { data: dataDepots, error: errDepots } = await locals.sb
          .from(`${fetch.table}_depots`)
          .select()
          .eq(fetch.table, fetch.id);

        dataDepots.forEach(async (row) => {
          row[fetch.table] = dataNew.id;
          const { data: dataNewDepot, error: errNewDepot } = await locals.sb
            .from(`${fetch.table}_depots`)
            .insert(row)
            .select()
            .single();
        });
      }
      if ("all_dropoffs" in dataNew) {
        const { data: dataDropoffs, error: errDropoffs } = await locals.sb
          .from(`${fetch.table}_dropoffs`)
          .select()
          .eq(fetch.table, fetch.id);

        dataDropoffs.forEach(async (row) => {
          row[fetch.table] = dataNew.id;
          const { data: dataNewDropoff, error: errNewDropoff } = await locals.sb
            .from(`${fetch.table}_dropoffs`)
            .insert(row)
            .select()
            .single();
        });
      }
      if ("all_vehicles" in dataNew) {
        const { data: datavehicles, error: errvehicles } = await locals.sb
          .from(`${fetch.table}_vehicles`)
          .select()
          .eq(fetch.table, fetch.id);

        datavehicles.forEach(async (row) => {
          row[fetch.table] = dataNew.id;
          const { data: dataNewvehicles, error: errNewvehicles } =
            await locals.sb
              .from(`${fetch.table}_vehicles`)
              .insert(row)
              .select()
              .single();
        });
      }
      if ("all_suppliers" in dataNew) {
        const { data: datasuppliers, error: errsuppliers } = await locals.sb
          .from(`${fetch.table}_suppliers`)
          .select()
          .eq(fetch.table, fetch.id);

        datasuppliers.forEach(async (row) => {
          row[fetch.table] = dataNew.id;
          const { data: dataNewsuppliers, error: errNewsuppliers } =
            await locals.sb
              .from(`${fetch.table}_suppliers`)
              .insert(row)
              .select()
              .single();
        });
      }
      if ("all_categories" in dataNew) {
        const { data: datacategories, error: errcategories } = await locals.sb
          .from(`${fetch.table}_categories`)
          .select()
          .eq(fetch.table, fetch.id);

        datacategories.forEach(async (row) => {
          row[fetch.table] = dataNew.id;
          const { data: dataNewcategories, error: errNewcategories } =
            await locals.sb
              .from(`${fetch.table}_categories`)
              .insert(row)
              .select()
              .single();
        });
      }

      if (fetch.table === "rates") {
        const { data: dataSeasons, error: errSeasons } = await locals.sb
          .from("ratesSeasons")
          .select()
          .eq("rates", fetch.id);

        dataSeasons.forEach(async (season) => {
          sanitize(season);
          season.rates = dataNew.id;
          const { data: dataNewSeason, error: errNewSeason } = await locals.sb
            .from("ratesSeasons")
            .insert(season)
            .select()
            .single();
        });
      }

      let path = url.pathname.split("/");
      const len = path.length;
      let depth = 4;
      if (path[3] === fetch.id) {
        depth = 3;
      }
      for (let i = depth; i < len; i++) {
        path.pop();
      }
      throw redirect(303, `${path.join("/")}/${dataNew.id}`);
      // for (let i = 3; i < len; i++) {
      //   path.pop();
      // }
      // throw redirect(303, `/admin/${fetch.table}/${dataNew.id}`);
    },
  },
};
