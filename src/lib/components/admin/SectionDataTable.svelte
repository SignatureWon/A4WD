<script>
  import {
    Button,
    DataTable,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import { goto } from "$app/navigation";
  import dayjs from "dayjs";

  export let rows = [];
  export let path = "";
  export let headers = [{ key: "name", value: "Name" }];
  export let modal = false;

  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  let page = 1;
  let pageSize = 100;
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
        shouldFilterRows
        bind:filteredRowIds
      />
      <Button on:click={() => goto(`${path}/add`)}>+ New</Button>
    </ToolbarContent>
  </Toolbar>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === "status"}
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
      {:else}
        {cell.value}
      {/if}
    {:else if ["date_start", "date_end", "travel_start", "travel_end", "created_at", "updated_at"].includes(cell.key)}
      {dayjs(cell.value).format("DD/MM/YYYY")}
    {:else if cell.value === null}
      &mdash;
    {:else if cell.key === "gross"}
      {formatCurrency(cell.value)}
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
