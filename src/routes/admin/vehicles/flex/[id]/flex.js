import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export const keys = [
  "name",
  "suppliers",
  "license",
  "nett",
  "gross",
  "matrix",
  "matrix_start",
  "matrix_end",
  "matrix2",
  "matrix2_start",
  "matrix2_end",
  "data",
  "zero",
  "type",
  "rank",
];
export const generateMatrix = (data, zero) => {
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

export const generateRates = async (ratesID, data) => {
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
    // const dbDepots = await db.all({
    //   table: "depots",
    //   keys: ["id", "code"],
    // });
    const dbDepots = await supabase.from("depots").select("id, code");
    // console.log("dbDepots", dbDepots);
    dbDepots.data.forEach((item) => {
      depots[item.code] = item.id;
    });
    // console.log("depots", depots);

    let vehicles = {};
    // const dbVehicles = await db.all({
    //   table: "vehicles",
    //   keys: ["id", "code"],
    // });
    const dbVehicles = await supabase.from("vehicles").select("id, code");

    dbVehicles.data.forEach((item) => {
      vehicles[item.code] = item.id;
    });
    // console.log("vehicles", vehicles);

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
    });
  }

  // console.log("ratesValid", ratesValid);
  // console.log("ratesInvalid", ratesInvalid);

  return {
    valid: ratesValid,
    invalid: ratesInvalid,
  };
};
