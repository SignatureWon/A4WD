import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export async function load({ url, params }) {
  let seasonal = await db.one({
    table: "rates",
    id: params.id,
    keys: ["name", "tiers", "suppliers"],
  });

  return {
    seasonal: seasonal,
    season: db.one({
      table: "ratesSeasons",
      id: params.season_id,
      keys: ["name", "rates", "flex", "matrix", "zero"],
    }),
    path: url.pathname,
    id: params.id,
    season_id: params.season_id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "ratesSeasons",
    });
  },
  update: async ({ request, url, params, locals }) => {
    const resp = await db.actions.update(request, url, locals, {
      id: params.season_id,
      table: "ratesSeasons",
    });

    let az = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let zero = resp.zero === "true" ? 0 : 1;
    let matrix = {};
    resp.matrix.split(/\r?\n/).forEach((row, rowIndex) => {
      row.split(",").forEach((col, colIndex) => {
        matrix[`${az[rowIndex]}${colIndex + zero}`] = Number(col);
      });
    });

    const dbDepots = await db.all({
      table: "depots",
      keys: ["id", "code"],
    });
    let depots = {};
    dbDepots.forEach((d) => {
      depots[d.code] = d.id;
    });

    const dbVehicles = await db.all({
      table: "vehicles",
      keys: ["id", "code"],
    });
    let vehicles = {};
    dbVehicles.forEach((d) => {
      vehicles[d.code] = d.id;
    });

    let ratesList = [];
    resp.flex.split(/\r?\n/).forEach((row, rowIndex) => {
      let col = row.split(";");
      // console.log();
      ratesList.push({
        rates: params.id,
        ratesSeasons: params.season_id,
        depots: depots[col[0].trim()] || null,
        vehicles: vehicles[col[1].trim()] || null,
        date_start: dayjs(col[2].trim(), "DD/MM/YYYY"),
        date_end: dayjs(col[2].trim(), "DD/MM/YYYY").add(7, "day"),
        daily: matrix[col[3].trim()],
        flex: col[3].trim(),
      });
    });

    console.log(ratesList);

    await db.delete(locals, {
      table: "ratesList",
      key: "ratesSeasons",
      value: params.season_id,
    });

    await db.insert(locals, {
      table: "ratesList",
      data: ratesList,
    });

    throw redirect(303, url.pathname);
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.season_id,
      table: "ratesSeasons",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.season_id,
      table: "ratesSeasons",
    });
  },
};
