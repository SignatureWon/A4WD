<script>
  import { supabase } from "$lib/supabaseClient";
  import { format } from "$lib/format.js";
  import { onMount } from "svelte";
  export let quote;
  // console.log(quote);

  let routes = quote.details.routes || false;

  const findRoute = (data, supplier_id) => {
    let result;
    // console.log("data", data);
    (data || []).forEach((route) => {
      let filter_suppliers = route.routes_suppliers.filter((item) => {
        return item.suppliers.id === supplier_id;
      });
      if (filter_suppliers.length) {
        result = route;
      }
    });
    return result;
  };

  const getRoutes = async () => {
    let query = supabase.from("routes").select(`
        routes_suppliers (suppliers(id, name)),
        routes_depots (depots(id, name)),
        all_suppliers, 
        all_depots, 
        name, 
        waive,
        waive_days, 
        routes
      `);
    query = query.or(`date_start.lte.${quote.details.date_start},date_end.gte.${quote.details.date_end}`);
    query = query.lte("date_start", quote.details.date_end);
    query = query.gte("date_end", quote.details.date_start);
    query = query.eq("status", true);

    const { data, error } = await query;

    let routes = findRoute(data, quote.details.supplier.id);

    return routes;
  };
  const hasOneWay = (waive, waive_days, duration) => {
    let result = true;
    // console.log("f", waive);
    if (waive) {
      if (duration > waive_days) {
        result = false;
      } else {
        result = true;
      }
    }
    // console.log(waive, waive_days, duration);

    // console.log("hasOneWay", result);
    return result;
  };

  let showOneWay = true

  onMount(async () => {
    if (!routes) {
      routes = await getRoutes();
    }

    let waive = routes.waive || false;
    let waive_days = routes.waive_days || 0;
    let duration = quote.details.duration;

    showOneWay = hasOneWay(waive, waive_days, duration);
  });

  // $: hasOneWay();
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Other Fees</h2>
  </div>
  <div class="p-4">
    {#if showOneWay}
      {#if quote.details.one_way > 0}
        <div class="flex">
          <div class="flex-1">One-way fee</div>
          <div class="w-20 text-right">${format.currency(quote.details.one_way)}</div>
        </div>
      {/if}
    {/if}
    {#each quote.details.fees.items as item}
      <div class="flex">
        <div class="flex-1">{item.name}</div>
        <div class="w-20 text-right">${format.currency(item.fee)}</div>
      </div>
    {/each}
    {#if (!showOneWay || quote.details.one_way === 0) && quote.details.fees.items.length === 0}
      <div class="p-3 bg-gray-50 text-gray-400 text-center">No fees</div>
    {/if}
  </div>
</div>
