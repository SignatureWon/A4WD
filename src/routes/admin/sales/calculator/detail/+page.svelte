<script>
  import { env } from "$env/dynamic/public";
  import dayjs from "dayjs";
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import { quote } from "$lib/quote";

  export let data;
  console.log(data);
  let paneHeight = 0;
  const d = data.detail;
  let details = {
    date_book: dayjs(),
    date_start: dayjs(data.search.date_start),
    date_end: dayjs(data.search.date_end),
    pax: dayjs(data.search.pax),
    duration: d.duration,
    min_days: d.min_days,
    rates_type: d.rates_type,
    rates_nett: d.rates_nett,
    rates_gross: d.rates_gross,
    pickup: {
      id: d.depot_id,
      name: d.depot_name,
    },
    dropoff: {
      id: d.dropoff_id,
      name: d.dropoff_name,
    },
    vehicle: {
      id: d.vehicle_id,
      name: d.vehicle_name,
      image: `${env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/${d.vehicle_image}?width=600&height=600&resize=contain`,
      excerpt: d.vehicle_excerpt,
      slug: d.vehicle_slug,
      fuel: d.vehicle_fuel,
      pax: d.vehicle_pax,
      shower: d.vehicle_shower,
      toilet: d.vehicle_toilet,
      wheel: d.vehicle_wheel,
      transmission: d.vehicle_transmission,
    },
    supplier: {
      id: d.supplier_id,
      name: d.supplier_name,
    },
    age: {
      id: d.age_id,
      name: d.age_name,
    },
    daily: {
      gross: d.gross,
      nett: d.nett,
      profit: d.profit,
      items: d.list,
    },
    fees: {
      total: d.fee_total,
      items: d.fee_items,
    },
    one_way: d.one_way,
    specials: {
      total: d.special_total,
      items: d.special_items,
    },
    bonds: {},
    addons: {},
    terms: d.terms,
    add_discount: 0,
    add_discount_remark: "",
  };
  // console.log("details", details);

  // let quoteDetails = quote.getDetail(details);
  // console.log(quoteDetails);
</script>

<svelte:window bind:innerHeight={paneHeight} />
{paneHeight}
<PageTitle title="Create Quote" />
<div class="flex bg-white" style="height: {paneHeight - 150}px">
  <div class="flex-1 h-full overflow-y-auto">
    <div class="p-5" />
  </div>
  <div class="h-full w-80 overflow-y-auto bg-brand-50">
    <div class="p-5">contente</div>
    NAV
  </div>
</div>
