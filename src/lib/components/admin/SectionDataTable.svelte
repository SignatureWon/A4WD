<script>
  import { Button, DataTable, Pagination, Toolbar, ToolbarContent, ToolbarSearch } from "carbon-components-svelte";
  import { goto } from "$app/navigation";
  import dayjs from "dayjs";

  export let rows = [];
  export let path = "";
  export let prefix = "";
  export let headers = [{ key: "name", value: "Name" }];
  export let modal = false;
  export let keys = [];

  // console.log(rows);

  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const getBond = (details) => {
    let result = "";
    if ("bonds" in details) {
      if (Object.keys(details.bonds).length) {
        result = details.bonds.display_name;
      }
    }
    if ("bond" in details) {
      if (Object.keys(details.bond).length) {
        result = details.bond.display_name;
      }
    }
    if (result !== "") {
      result = `(${result})`;
    }
    return result;
  };

  let page = 1;
  let pageSize = 250;
  let filteredRowIds = [];
  let open = false;
</script>

<DataTable
  sortable
  {headers}
  {pageSize}
  {page}
  {rows}
  on:click:row={(row) => {
    goto(`${path}/${row.detail.id}`);
  }}
  class="cursor-pointer"
>
  <Toolbar class="mb-4">
    <ToolbarContent>
      <ToolbarSearch
        size="lg"
        persistent
        value=""
        shouldFilterRows={(row, value) => {
          let show = false;

          if (keys.length > 0) {
            keys.forEach((key) => {
              let col = "";
              if (key.indexOf(".") > 0) {
                let levels = key.split(".");

                levels.forEach((lvl, idx) => {
                  if (idx === 0) {
                    col = row[lvl];
                  } else {
                    col = col[lvl];
                  }
                });
              } else {
                col = row[key];
                // console.log("col", key, col);
              }
              if (String(col).toLowerCase().includes(value.toLowerCase())) {
                show = true;
              }
            });
          } else {
            for (const key in row) {
              if (String(row[key]).toLowerCase().includes(value.toLowerCase())) {
                show = true;
              }
            }
          }
          return show;
        }}
        bind:filteredRowIds
      />
      <Button on:click={() => goto(`${path}/add`)}>+ New</Button>
    </ToolbarContent>
  </Toolbar>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === "status" || cell.key === "all_day"}
      {#if typeof cell.value === "boolean"}
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
      {:else if cell.value}
        {cell.value}
      {:else}
        &mdash;
      {/if}
    {:else if ["date_start", "date_end", "travel_start", "travel_end", "updated_at"].includes(cell.key)}
      {#if cell.value}
        {dayjs(cell.value).format("DD/MM/YYYY")}
      {:else}
        &mdash;
      {/if}
    {:else if ["date_deposit", "date_balance", "date_provisional", "created_at"].includes(cell.key)}
      {#if cell.value}
        {dayjs(cell.value).format("DD/MM/YYYY hh:mm:ssa")}
      {:else}
        &mdash;
      {/if}
    {:else if cell.value === null}
      &mdash;
    {:else if cell.key === "gross"}
      {formatCurrency(cell.value)}
    {:else if cell.key === "quote_id"}
      {prefix}{388000 + row.id}
    {:else if cell.key === "quote_title"}
      {row.details.vehicle.name.trim()}: {row.details.pickup.name.trim()}, {dayjs(row.details.date_start).format(
        "DD MMM YYYY"
      )} - {row.details.dropoff.name.trim()}, {dayjs(row.details.date_end).format("DD MMM YYYY")}
      {getBond(row.details).trim()}
    {:else if cell.key === "quote_customer"}
      {#if row.users}
        {row.users.first_name} {row.users.last_name}
      {:else}
        No User
      {/if}
    {:else if cell.key === "quote_status"}
      {row.status}
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>
</DataTable>
<Pagination bind:pageSize bind:page totalItems={filteredRowIds.length} pageSizeInputDisabled />
