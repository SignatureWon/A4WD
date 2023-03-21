<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  import { DataTable, Pagination } from "carbon-components-svelte";
  dayjs.extend(customParseFormat);

  export let update = 1;
  let toUpdate = 0; // not to update for the 1st time

  const id = $page.params.id;
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  let offset = 1;
  let records = [];
  let depots = [];
  let vehicles = [];
  let matrix = {};
  let matrixTable = [
    {
      row: "",
      col: [],
    },
  ];
  let dataTable = [
    {
      depot: "",
      depotDetail: {},
      vehicle: "",
      vehicleDetail: {},
      dateStr: null,
      date: null,
      matrix: "",
      fee: 0,
    },
  ];
  let flexTable = [];

  let loading = false;
  let show = false;
  let message = "";
  let errors = {};

  onMount(() => {
    getDepots();
    getVehicles();
  });

  const getRecords = async () => {
    toUpdate++
    try {
      loading = true;
      const { data, error } = await supabase
        .from("flex")
        .select("matrix, data, zero, suppliers, fees, matrixTable")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        records = data;

        if (data.zero) {
          offset = 0;
        }
        popMatrix();
        popData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
    if (toUpdate > 1) {
      try {
        loading = true;
        const { data, error } = await supabase
          .from("flex")
          .update({
            fees: flexTable,
            matrixTable: matrixTable,
          })
          .eq("id", id);

        if (error) throw error;
      } catch (error) {
        errors = error;
      } finally {
        message = "Updated successfully";
        show = true;
        loading = false;
      }
    }
  };
  const getDepots = async () => {
    try {
      loading = true;
      const { data, error } = await supabase.from("depots").select("id, name");

      if (error) throw error;

      if (data) {
        depots = data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };
  const getVehicles = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, name");

      if (error) throw error;

      if (data) {
        vehicles = data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };

  const popMatrix = () => {
    let matrixTrimmed = records.matrix.trim();

    matrixTable = [];

    matrixTrimmed.split(/\r?\n/).forEach((row, rowIndex) => {
      matrixTable = [
        ...matrixTable,
        {
          row: alphabet[rowIndex],
          col: [],
        },
      ];
      row.split(",").forEach((col, colIndex) => {
        matrix[`${alphabet[rowIndex]}${colIndex + offset}`] = Number(col);
        matrixTable[rowIndex].col.push(col);
      });
    });
  };

  const popData = async () => {
    let dataTrimmed = records.data.trim();
    dataTable = [];
    dataTrimmed.split(/\r?\n/).forEach((row, rowIndex) => {
      let thisRow = {
        id: uuidv4(),
        depot: "",
        depotDetail: {},
        vehicle: "",
        vehicleDetail: {},
        date: null,
        dateStr: null,
        matrix: "",
        fee: 0,
      };
      row.split(";").forEach((col, colIndex) => {
        col = col.trim();
        switch (colIndex) {
          case 0:
            thisRow.depot = col;
            thisRow.depotDetail =
              depots.filter(function (item) {
                return item.code === col;
              })[0] || {};
            break;

          case 1:
            thisRow.vehicle = col;
            thisRow.vehicleDetail =
              vehicles.filter(function (item) {
                return item.code === col;
              })[0] || {};
            break;

          case 2:
            thisRow.dateStr = col;
            thisRow.date = dayjs(col, "DD/MM/YYYY").$d;
            break;

          case 3:
            thisRow.matrix = col;
            thisRow.fee = matrix[col];
            break;

          default:
            break;
        }
      });
      dataTable = [...dataTable, thisRow];
    });

    let tempData = [];
    dataTable.forEach((item) => {
      tempData.push(item);
      for (let i = 1; i < 7; i++) {
        let newDate = dayjs(item.date).add(i, "day").$d;
        tempData.push({
          id: uuidv4(),
          date: newDate,
          dateStr: dayjs(newDate).format("DD/MM/YYYY"),
          depot: item.depot,
          depotDetail: item.depotDetail,
          vehicle: item.vehicle,
          vehicleDetail: item.vehicleDetail,
          matrix: item.matrix,
          fee: item.fee,
        });
      }
    });
    flexTable = [...tempData];
  };

  let pageSize = 20;
  let pageCurrent = 1;

  $: update, getRecords();
</script>

<Loading {loading} />
<Toast bind:show {message} />

<div class="bg-white">
  <div class="p-4">
    <h2 class="text-lg font-bold mb-2">Flex Matrix</h2>
    <table
      class="table-fixed border-collapse border border-gray-200 w-full text-center"
    >
      <tbody>
        <tr>
          <td class="border border-gray-200 bg-gray-50" />
          {#each matrixTable[0].col as col, colIndex}
            <td class="border border-gray-200 bg-gray-50">{colIndex}</td>
          {/each}
        </tr>
        {#each matrixTable as row, rowIndex}
          <tr>
            <td class="border border-gray-200 bg-gray-50">
              {row.row}
            </td>
            {#each row.col as col, colIndex}
              <td class="border border-gray-200">{col}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>

    <h2 class="text-lg font-bold mb-2 mt-8">Flex Rates</h2>
    <DataTable
      headers={[
        { key: "depot", value: "Depot" },
        { key: "vehicle", value: "Vehicle" },
        { key: "dateStr", value: "Date" },
        { key: "matrix", value: "Flex" },
        { key: "fee", value: "Daily Rate" },
      ]}
      {pageSize}
      page={pageCurrent}
      rows={flexTable}
    />
    <Pagination
      bind:pageSize
      bind:page={pageCurrent}
      totalItems={flexTable.length}
      pageSizeInputDisabled
    />
  </div>
</div>
