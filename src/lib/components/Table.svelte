<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page as storePage } from "$app/stores";
  import { goto } from "$app/navigation";
  import dayjs from "dayjs";
  import Loading from "$lib/components/Loading.svelte";
  import {
    DataTable,
    Pagination,
    Button,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";

  export let table = "";
  export let fields = "*";
  export let pageSize = 100;
  export let page = 1;
  export let title = "";
  export let description = "";
  export let headers = [{ key: "name", value: "Name" }];
  export let filters = [];
  export let orders = [];
  // export let rows = [{ name: "Name" }];

  let rows = [];
  let errors = {};
  let loading = false;
  let filteredRowIds = [];

  onMount(() => {
    if (table !== "") {
      getRows();
    }
  });

  const getRows = async () => {
    try {
      loading = true;
      let query = supabase.from(table).select(fields);

      filters.forEach((filter) => {
        if (filter.type === "eq") {
          query = query.eq(filter.column, filter.value);
        }
      });

      orders.forEach((order) => {
        query = query.order(order.column, { ascending: order.ascend });
      });

      query = query.order("updated_at", { ascending: false })

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        rows = data;
      console.log(rows);

      }
    } catch (error) {
      errors = error;
    } finally {
      loading = false;
    }
  };
</script>

<DataTable
  sortable
  {title}
  {description}
  {headers}
  {pageSize}
  {page}
  {rows}
  on:click:row={(row) => {
    goto(`${$storePage.url.pathname}/${row.detail.id}`);
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
      <Button on:click={() => goto(`${$storePage.url.pathname}/add`)}
        >+ New</Button
      >
    </ToolbarContent>
  </Toolbar>
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
    {:else if ["date_start", "date_end", "travel_start", "travel_end", "created_at", "updated_at"].includes(cell.key)}
      {dayjs(cell.value).format("DD/MM/YYYY")}
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
