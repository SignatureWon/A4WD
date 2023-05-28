<script>
  import {
    DataTable,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import { page as storePage } from "$app/stores";
  import { goto } from "$app/navigation";
  import dayjs from "dayjs";
  import {format} from "$lib/format"

  export let search = {};
  export let rows = [];
  export let headers = [];
  export let disabled = false;
  let pageSize = 100;
  let page = 1;
  // let headers = [
  //   { key: "vehicle_name", value: "Vehicle" },
  //   // { key: "rates_type", value: "Type" },
  //   { key: "license_name", value: "License" },
  //   // { key: "supplier_name", value: "Supplier" },
  //   // { key: "special_total", value: "Special" },
  //   // { key: "fee_total", value: "Fee" },
  //   { key: "gross", value: "Gross" },
  //   { key: "nett", value: "Nett" },
  //   // { key: "profit", value: "Profit" },
  // ];
  let filteredRowIds = [];
  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
</script>

<DataTable
  sortable
  {headers}
  {pageSize}
  {page}
  {rows}
  on:click:row={(row) => {
    const r = row.detail;
    if (!disabled) {
      goto(
        `/admin/sales/calculator/detail?pickup=${r.depot_id}&dropoff=${r.dropoff_id}&rates=${r.rates_id}&date_start=${search.date_start}&date_end=${search.date_end}&age=${r.age_id}&license=${r.license_id}&vehicle=${r.vehicle_id}`
      );
    }
  }}
  class="cursor-pointer"
>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === "status"}
      {#if cell.value === true}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-5 h-5 text-green-600"
          fill="currentColor"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"
          /></svg
        >
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-5 h-5 text-gray-300"
          fill="currentColor"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"
          /></svg
        >
      {/if}
    {:else if ["date_start", "date_end", "routes_date_start", "routes_date_end", "travel_start", "travel_end", "created_at", "updated_at"].includes(cell.key)}
      {dayjs(cell.value).format("DD/MM/YYYY")}
    {:else if ["nett", "gross", "profit", "special_total"].includes(cell.key)}
      {format.currency(cell.value)}
    {:else if ["vehicles_categories", "block_items"].includes(cell.key)}
      {#each cell.value as item}
        {item.name}<br />
      {/each}
    {:else if cell.value === null}
      &mdash;
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>
</DataTable>
<Pagination
  bind:pageSize
  bind:page
  totalItems={rows.length}
  pageSizeInputDisabled
/>
