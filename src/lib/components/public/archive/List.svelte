<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { PaginationNav } from "carbon-components-svelte";

  export let records = [];
  export let fetch = {
    from: "vehicles",
    select: "*",
  };

  let url = $page.url;
  let pageNow = Number(url.searchParams.get("page")) || 1;
  let pageSize = 15;
  let pageTotal = 1;
  let searchParams = {};

  const getRecords = async () => {
    let rangeFrom = (pageNow - 1) * pageSize;

    let query = supabase
      .from(fetch.from)
      .select(fetch.select, { count: "exact" })
      .eq("status", true);

    if (fetch.eq) {
      fetch.eq.forEach((col) => {
        query = query.eq(col.name, col.value);
      });
    }

    ["type", "wheel", "categories"].forEach((key) => {
      if (key in searchParams) {
        query = query.eq(key, searchParams[key]);
      }
    });

    if ("search" in searchParams) {
        query = query.like("name", `%${searchParams["search"]}%`);
      }

    query = query
      .order("rank", { ascending: true })
      .range(rangeFrom, rangeFrom + pageSize - 1);

    const { data, count, error } = await query;

    records = data;
    pageTotal = Math.round(count / pageSize + 0.5);
  };

  onMount(async () => {
    getRecords();
  });

  $: {
    url = $page.url;
    pageNow = Number(url.searchParams.get("page")) || 1;
    searchParams = {};
    url.searchParams.forEach((val, key) => {
      searchParams[key] = val;
    });
    getRecords();
  }
</script>

<div class="container xl:max-w-7xl mx-auto px-4 md:px-0 pt-8">
  {#if records.length === 0}
    <div class="px-4 py-20 text-center">
      <div>No records yet</div>
    </div>
  {:else}
    <slot />
  {/if}
</div>
<div class="flex justify-center py-8">
  <PaginationNav
    total={pageTotal}
    shown={5}
    page={pageNow}
    on:change={(e) => {
      searchParams["page"] = e.detail.page;
      let params = [];
      for (const key in searchParams) {
        if (searchParams[key] !== "") {
          params.push(`${key}=${searchParams[key]}`);
        }
      }
      goto(`${url.pathname}?${params.join("&")}`);
    }}
  />
</div>
