<script>
  import dayjs from "dayjs";

  import Trip from "./Trip.svelte";
  import Price from "./Price.svelte";
  import Fees from "./Fees.svelte";
  import Bonds from "./Bonds.svelte";
  import Addons from "./Addons.svelte";
  import Total from "./Total.svelte";
  import Schedule from "./Schedule.svelte";
  import Action from "./Action.svelte";
  export let data;

  const d = data.detail;
  const detail = data.detail;

  const checkBondCap = (duration, cap) => {
    return cap > duration ? duration : cap;
  };
  const calculateBondPrice = (gross, duration, cap) => {
    gross = gross || 0;
    cap = cap || 0;

    let days = checkBondCap(duration, cap);

    return gross * days;
  };

  let quote = {
    search: data.search,
    duration: d.duration,
    min_days: d.min_days,
    rates_type: d.rates_type,
    rates_nett: d.rates_nett,
    rates_gross: d.rates_gross,
    supplier: {
      id: d.supplier_id,
      name: d.supplier_name,
    },
    age: {
      id: d.age_id,
      name: d.age_name,
    },
    license: {
      id: d.license_id,
      name: d.license_name,
    },
    gross: 0,
    nett: 0,
    vehicle: {
      id: d.vehicle_id,
      name: d.vehicle_name,
    },
    pickup: {
      id: d.depot_id,
      name: d.depot_name,
    },
    dropoff: {
      id: d.dropoff_id,
      name: d.dropoff_name,
    },
    date_start: dayjs(data.search.date_start),
    date_end: dayjs(data.search.date_end),
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
    bonds: {
      gross: calculateBondPrice(
        d.bond_items[0].gross,
        d.duration,
        d.bond_items[0].cap
      ),
      nett: calculateBondPrice(
        d.bond_items[0].nett,
        d.duration,
        d.bond_items[0].cap
      ),
      items: d.bond_items[0],
    },
    addons: {
      gross: 0,
      nett: 0,
      items: {},
    },
  };

  $: quote.gross = quote.daily.gross + quote.one_way + quote.fees.total + quote.bonds.gross + quote.addons.gross - quote.specials.total;

  function handleChange(e) {
    quote = e.detail
  }
</script>

<Trip search={data.search} {detail} />
<Price>
  <Fees {detail} />
  <Bonds {detail} {quote} on:change={handleChange} />
  <Addons {detail} {quote} on:change={handleChange} />
</Price>
<Total bind:quote />
<Schedule {detail} {quote} />
<Action licenses={data.options.licenses} {quote} />
