// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const keys = [
  "name",
  "suppliers",
  "date_start",
  "date_end",
  "license",
  "nett",
  "gross",
  "matrix",
  // "matrix_start",
  // "matrix_end",
  "matrix2",
  "matrix2_start",
  "matrix2_end",
  "data",
  "zero",
  "type",
  "rank",
];
const generateMatrix = (data, zero) => {
  let az = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let results = {};

  if (data) {
    data.split(/\r?\n/).forEach((row, rowIndex) => {
      let thisRow = row.trim();
      if (thisRow !== "") {
        if (thisRow.indexOf(",") > 0) {
          row
            .trim()
            .split(",")
            .forEach((col, colIndex) => {
              results[`${az[rowIndex]}${colIndex + zero}`] = Number(col);
            });
        } else {
          row
            .trim()
            .split(" ")
            .forEach((col, colIndex) => {
              results[`${az[rowIndex]}${colIndex + zero}`] = Number(col);
            });
        }
      }
    });
  }
  return results;
};

const generateRates = async (ratesID, data) => {
  let az = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  if (typeof data.zero === "string") {
    if (data.zero === "false") {
      data.zero = false;
    } else {
      data.zero = true;
    }
  }
  let zero = data.zero ? 0 : 1;
  // console.log("zero", data.zero, zero);
  let matrix = generateMatrix(data.matrix, zero);
  if (data.matrix2.trim.length === 0) {
    data.matrix2 = data.matrix;
  }
  let matrix2 = generateMatrix(data.matrix2, zero);

  // let matrix = {};
  // if (data.matrix) {
  //   data.matrix.split(/\r?\n/).forEach((row, rowIndex) => {
  //     let thisRow = row.trim();
  //     if (thisRow !== "") {
  //       if (thisRow.indexOf(",") > 0) {
  //         row
  //           .trim()
  //           .split(",")
  //           .forEach((col, colIndex) => {
  //             matrix[`${az[rowIndex]}${colIndex + zero}`] = Number(col);
  //           });
  //       } else {
  //         row
  //           .trim()
  //           .split(" ")
  //           .forEach((col, colIndex) => {
  //             matrix[`${az[rowIndex]}${colIndex + zero}`] = Number(col);
  //           });
  //       }
  //     }
  //   });
  // }

  // console.log("generateMatrix", generateMatrix(data.matrix, zero));

  let ratesValid = [];
  let ratesInvalid = [];
  // console.log("typeof", data);
  if (data.data) {
    // console.log("YES DATA", data.data);
    let depots = {};
    const dbDepots = await db.all({
      table: "depots",
      keys: ["id", "code"],
    });
    dbDepots.forEach((item) => {
      depots[item.code] = item.id;
    });
    // console.log("depots", depots);

    let vehicles = {};
    const dbVehicles = await db.all({
      table: "vehicles",
      keys: ["id", "code"],
    });
    dbVehicles.forEach((item) => {
      vehicles[item.code] = item.id;
    });
    // console.log("vehicles", vehicles);
    const flex_start = dayjs(data.date_start);
    const flex_end = dayjs(data.date_end);

    data.data.split(/\r?\n/).forEach((row, rowIndex) => {
      if (row.trim() !== "") {
        let arr = row.split(";");
        // console.log(arr);
        if (arr.length === 4) {
          let col = {
            depot: arr[0].trim(),
            vehicle: arr[1].trim(),
            start: dayjs(arr[2].trim(), "DD/MM/YYYY"),
            end: dayjs(arr[2].trim(), "DD/MM/YYYY").add(7, "day"),
            flex: arr[3].trim(),
          };
          // console.log("col", rowIndex, col);
          let valid = true;
          let d = depots[col.depot] || null;
          let v = vehicles[col.vehicle] || null;
          let matrixUsed = matrix;
          if (Object.keys(matrix2).length) {
            if (col.start.isBetween(dayjs(data.matrix2_start), dayjs(data.matrix2_end), "day", "[)")) {
              matrixUsed = matrix2;
            }
          }
          let obj = {
            rates: ratesID,
            depots: d,
            vehicles: v,
            date_start: col.start.format("MM/DD/YYYY"),
            date_end: col.end.format("MM/DD/YYYY"),
            daily: matrixUsed[col.flex],
            flex: col.flex,
          };
          // console.log("v", v);

          if (!d) {
            valid = false;
            obj.invalidDepot = {
              row: rowIndex + 1,
              depot: col.depot,
            };
          }
          if (!v) {
            valid = false;
            obj.invalidVehicle = {
              row: rowIndex + 1,
              vehicle: col.vehicle,
            };
          }
          // console.log("obj", rowIndex, obj);

          if (col.start.isBetween(flex_start, flex_end, "day", "[]")) {
            if (valid) {
              // if (obj.vehicles === '2eae491a-17f2-414e-bfb6-1e09dd3fc970' && obj.flex === 'F7') {
              if (obj.vehicles === "2eae491a-17f2-414e-bfb6-1e09dd3fc970" && obj.date_start === "09/25/2023") {
                console.log("matrixUsed", matrixUsed);
              }
              ratesValid.push(obj);
            } else {
              ratesInvalid.push(obj);
            }
          }
        }
      }
    });
  }

  // console.log("ratesValid", ratesValid);
  // console.log("ratesInvalid", ratesInvalid);

  return {
    valid: ratesValid,
    invalid: ratesInvalid,
  };
};
export async function load({ url, params, locals }) {
  let flex = await db.one({
    table: "rates",
    id: params.id,
    keys: keys,
  });

  // console.log("flex", flex);
  let checkRates = await generateRates(params.id, flex);
  // console.log("checkRates", checkRates);
  // console.log("checkRates", checkRates.invalid[0].invalidDepot);

  return {
    data: flex,
    rates: checkRates,
    suppliers: db.related({
      table: "suppliers",
    }),
    licenses: db.related({
      table: "constants",
      eq: [{ name: "type", value: "licenses" }],
    }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());
    if (!newData.license) {
      delete newData.license;
    }
    let data = await db.insert(locals, {
      table: "rates",
      data: newData,
    });

    let rates = await generateRates(data[0].id, newData);

    await db.insert(locals, {
      table: "ratesCard",
      data: rates.valid,
    });

    let path = url.pathname.split("/");
    path.pop();
    throw redirect(303, `${path.join("/")}/${data[0].id}`);

    // throw redirect(303, `${url.pathname}?success=update`);

    // await db.actions.insert(request, url, locals, {
    //   table: "rates",
    // });
  },
  update: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());
    // if (!newData.license) {
    // newData.license = null;
    // }

    await db.update(locals, {
      id: params.id,
      table: "rates",
      data: newData,
    });

    let rates = await generateRates(params.id, newData);

    await db.delete(locals, {
      table: "ratesCard",
      key: "rates",
      value: params.id,
    });

    // console.log(rates.valid);

    await db.insert(locals, {
      table: "ratesCard",
      data: rates.valid,
    });

    throw redirect(303, `${url.pathname}?success=update`);
  },
  delete: async ({ request, url, params, locals }) => {
    // await db.delete(locals, {
    //   table: "ratesCard",
    //   key: "rates",
    //   value: params.id,
    // });

    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "rates",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "rates",
    });
  },
};
