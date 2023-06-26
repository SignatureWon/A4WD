<script>
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import dayjs from "dayjs";
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  // import { quote } from "$lib/quote";
  import { format } from "$lib/format.js";
  import {
    Button,
    Checkbox,
    InlineNotification,
    NumberInput,
    RadioButton,
    RadioButtonGroup,
    Select,
    SelectItem,
    TextArea,
    TextInput,
    ToastNotification,
  } from "carbon-components-svelte";

  export let data;
  // console.log(data);
  let paneHeight = 0;
  const d = data.detail;
  // console.log("d", d);
  let details = {
    date_book: dayjs(),
    date_start: dayjs(data.search.date_start),
    date_end: dayjs(data.search.date_end),
    pax: data.search.pax,
    duration: d.duration,
    min_days: d.min_days,
    rates_type: d.rates_type,
    rates_nett: d.rates_nett,
    rates_gross: d.rates_gross,
    rates: {
      id: d.rates_id,
      type: d.rates_type,
      nett: d.rates_nett,
      gross: d.rates_gross,
    },
    driver: {
      age: 21,
      license: "AU/NZ",
    },
    passenger: {
      adult: 1,
      children: 0,
    },
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
    license: {
      id: d.license_id,
      name: d.license_name,
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
    bonds: d.bond_items[0],
    addons: {},
    terms: d.terms,
    add_discount: 0,
    add_discount_remark: "",
  };
  let selected_bond = 0;
  let bond_fee = 0;
  if (d.bond_items.length) {
    bond_fee =
      d.bond_items[0].gross * (d.duration < (d.bond_items[0].cap || 0) ? d.duration : d.bond_items[0].cap || 0);
  }
  let addon_fee = 0;
  let noCustomer = false;

  let customerEmail = "";
  let user = {
    id: null,
    first_name: null,
    last_name: null,
    phone: null,
    email: null,
    address_1: null,
    address_2: null,
    postcode: null,
    city: null,
    state: null,
    country: null,
  };
  let searchCustomer = "";

  let quote = {
    details: details,
    users: null,
    status: "Request",
    balance: 0,
    deposit: 0,
    payment_1: 0,
    payment_2: 0,
    gross: 0,
    nett: 0,
    profit: 0,
    discount: 0,
    agent_fee: 0,
    supplier_fee: 0,
    system_fee: 0,
    nett_profit: 0,
    add_discount: 0,
    add_discount_remark: "",
    comment: null,
  };

  const lookupCustomer = async () => {
    noCustomer = false;
    const { data: dataCustomer, error: errorData } = await supabase
      .from("users")
      .select()
      // .or(`email.eq.${searchCustomer},last_name.eq.${searchCustomer}`)
      .eq("email", user.email)
      .single();

    // console.log(dataCustomer);
    if (dataCustomer) {
      // console.log("YES");
      user = dataCustomer;
      quote.users = dataCustomer.id;
    } else {
      // console.log("NO");
      user.id = "add";
      // user.email = searchCustomer
    }
  };
  const changeCustomer = () => {
    noCustomer = false;
    user = {
      id: null,
      first_name: null,
      last_name: null,
      phone: null,
      email: null,
      address_1: null,
      address_2: null,
      postcode: null,
      city: null,
      state: null,
      country: null,
    };
    quote.users = null;
  };
  const addCustomer = async () => {
    noCustomer = false;
    delete user.id;
    const { data: dataCustomer, error: errorData } = await supabase.from("users").insert(user).select().single();

    // console.log(dataCustomer);
    if (dataCustomer) {
      // console.log("YES");
      user.id = dataCustomer.id;
      quote.users = dataCustomer.id;
    } else {
      // console.log("NO");
      user.id = null;
      quote.users = null;
    }
  };
  // nett = detail.daily.profit - agent_fee - system_fee

  // console.log("details", details);

  const duration = details.duration;
  const date_quote = dayjs().format("DD MMM YYYY");
  const date_start = dayjs(details.date_start).format("ddd, DD MMM YYYY");
  const date_end = dayjs(details.date_end).format("ddd, DD MMM YYYY");
  let agentFees = [];
  let supplierFees = [];
  let pickupFees = [];
  let totalPickupFees = 0;
  // let totalSystemFees = 0;

  const getTotalAgentFee = () => {
    let sum = 0;
    agentFees.forEach((fee) => {
      sum += fee.total;
    });
    quote.gross = sum;
    return sum;
  };
  const getTotalAgentCommission = () => {
    // console.log(agentFees);
    let sum = 0;
    agentFees.forEach((fee) => {
      sum += fee.profit;
    });
    quote.agent_fee = sum;
    quote.system_fee = ((quote.agent_fee - quote.add_discount) * 8) / 100;
    quote.nett_profit = quote.agent_fee - quote.add_discount - quote.system_fee;
    return sum;
  };
  const getTotalSupplierFee = () => {
    let sum = 0;
    supplierFees.forEach((fee) => {
      sum += fee.total;
    });
    quote.supplier_fee = sum;
    return sum;
  };

  const getDailyRates = () => {
    let obj = details.daily;
    let type = details.rates_type;
    let arr = obj.items;
    if (type === "flex") {
      let week = 1;
      let day = 0;
      arr.forEach((o, i) => {
        if (i !== 0 && i % 7 === 0) {
          agentFees.push({
            name: `Daily basic rental: Week ${week}: Flex[${arr[i - 1].flex}]: $${format.currency(
              arr[i - 1].gross
            )} x ${day} days`,
            total: arr[i - 1].gross * day,
            nett: arr[i - 1].nett * day,
            profit: arr[i - 1].profit * day,
          });
          day = 1;
          week++;
        } else {
          day++;
        }
        if (i === arr.length - 1) {
          agentFees.push({
            name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
            total: o.gross * day,
            nett: o.nett * day,
            profit: o.profit * day,
          });
        }
      });
    } else {
      agentFees.push({
        name: `Daily basic rental: $${format.currency(obj.gross / arr.length)} x ${arr.length} days`,
        total: obj.gross,
        nett: obj.nett,
        profit: obj.profit,
      });
    }
  };

  const getBonds = () => {
    const bond = Object.keys(details.bonds).length ? details.bonds : details.bond;
    let gross = bond.gross * duration;
    let nett = bond.nett * duration;
    let profit = gross - nett;

    if (bond.gross > 0) {
      const row = {
        name: `${bond.display_name}: $${bond.gross} x ${duration} days`,
        total: gross,
        nett: nett,
        profit: profit,
      };
      if (bond.gross > bond.nett) {
        agentFees.push(row);
      } else {
        supplierFees.push(row);
      }
    }
    pickupFees.push({
      name: `Bond: $${format.currency(
        bond.bond,
        0
      )} is taken from the hirer's credit or debit card <div style="font-size: 14px; color: #999999">Refundable as per supplier's Summary of Terms<div>`,
      total: bond.bond,
      nett: 0,
      profit: 0,
    });
  };

  const getOneways = () => {
    let one_way = details.one_way;
    if (one_way > 0) {
      supplierFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: 0,
        profit: 0,
      });
      pickupFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: 0,
        profit: 0,
      });
    }
  };
  const getAddons = () => {
    let addons = details.addons;
    // console.log("addons", addons);

    for (const key in addons) {
      const addon = addons[key];
      let gross = addon.gross_rate;
      if (addon.daily) {
        gross = gross * duration;
      }
      if (addon.gross_cap > 0) {
        if (gross > addon.gross_cap) {
          gross = addon.gross_cap;
        }
      }
      let nett = addon.nett_rate;
      if (addon.daily) {
        nett = nett * duration;
      }
      if (addon.nett_cap > 0) {
        if (nett > addon.nett_cap) {
          nett = addon.nett_cap;
        }
      }
      const row = {
        name: `Add-on: ${addon.name}${addon.daily ? `$${addon.gross_rate} x ${duration} days` : ""}`,
        total: gross,
        nett: nett,
        profit: gross - nett,
      };
      if (addon.gross_rate > addon.nett_rate) {
        agentFees.push(row);
      } else {
        supplierFees.push(row);
        pickupFees.push(row);
      }
    }
  };

  const getSpecials = () => {
    let special = details.specials;
    if (special.total > 0) {
      special.items.forEach((item) => {
        agentFees.push({
          name: item.name,
          total: -item.discount_amount,
          nett: 0,
          profit: 0,
        });
      });
    }
  };
  const getFees = () => {
    let fee = details.fees;
    if (fee.total > 0) {
      fee.items.forEach((item) => {
        supplierFees.push({
          name: item.name,
          total: item.fee,
          nett: 0,
          profit: 0,
        });
        pickupFees.push({
          name: item.name,
          total: item.fee,
          nett: 0,
          profit: 0,
        });
      });
    }
  };
  const getCcs = () => {
    let fee = (getTotalAgentFee() * 2) / 100;
    if (fee > 0) {
      agentFees.push({
        name: "Credit card surcharge (2%)",
        total: fee,
        nett: 0,
        profit: 0,
      });
    }
  };

  let termsItems = [];
  const getTerms = () => {
    let total = getTotalAgentFee();
    getTotalAgentCommission();
    getTotalSupplierFee();

    if ("terms" in quote.details) {
      let terms = details.terms;
      let gap = dayjs(date_start).diff(dayjs(date_quote), "day");

      if (gap < terms.balance) {
        termsItems = [
          {
            name: `Full payment to agent on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
            total: total,
          },
        ];
      } else {
        termsItems = [
          {
            name: `Booking deposit to agent now (${
              terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
            }) on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
            total: terms.percentage ? (total * terms.deposit) / 100 : terms.deposit,
          },
        ];
        if (terms.payment2) {
          if (terms.balance2 < gap) {
            termsItems.push({
              name: `First payment to agent (${
                terms.percentage2 ? `${terms.deposit2}%` : `$${terms.deposit2}`
              }) on ${dayjs(date_start).subtract(terms.balance2, "day").format("ddd, DD MMM YYYY")} (${
                terms.balance2
              } days before
                travel)`,
              total: terms.percentage2 ? (total * terms.deposit2) / 100 : terms.deposit2,
            });
          }
        }
        if (terms.payment3) {
          if (terms.balance3 < gap) {
            termsItems.push({
              name: `Second payment (${terms.percentage3 ? `${terms.deposit3}%` : `$${terms.deposit3}`}) on ${dayjs(
                date_start
              )
                .subtract(terms.balance3, "day")
                .format("ddd, DD MMM YYYY")} (${terms.balance3} days before
                travel)`,
              total: terms.percentage3 ? (total * terms.deposit3) / 100 : terms.deposit3,
            });
          }
        }
        // balance
        if (terms.balance < gap) {
          let bal = total;
          termsItems.forEach((t) => {
            bal -= t.total;
          });

          termsItems.push({
            name:
              "Balance payment to " +
              (terms.pay_counter
                ? `supplier at pick-up counter on ${dayjs(date_start).format("ddd, DD MMM YYYY")}`
                : `agent on ${dayjs(date_start).subtract(terms.balance, "day").format("ddd, DD MMM YYYY")}`) +
              ` (${terms.balance} days before travel)`,
            total: bal,
          });
        }
      }
    }
  };
  const updateQuote = () => {
    agentFees = [];
    supplierFees = [];
    pickupFees = [];
    getDailyRates();
    getBonds();
    getOneways();
    getAddons();
    getSpecials();
    getFees();
    getCcs();
    getTerms();
    getTotalAgentFee();
    getTotalAgentCommission();
    getTotalSupplierFee();
  };

  // map data
  const info = {
    // user: {
    //   first_name: quote.users.first_name,
    //   last_name: quote.users.last_name,
    //   email: quote.users.email,
    //   phone: quote.users.phone,
    //   address_1: quote.users.address_1,
    //   address_2: quote.users.address_2,
    //   postcode: quote.users.postcode,
    //   city: quote.users.city,
    //   state: quote.users.state,
    //   country: quote.users.country,
    // },
    quote: {
      // id: quote.id + 388000,
      date: date_quote,
      duration: duration,
      pickup: {
        name: details.pickup.name,
        date: date_start,
      },
      dropoff: {
        name: details.dropoff.name,
        date: date_end,
      },
    },
    // comment: quote.comment,
    vehicle: {
      name: d.vehicle_name,
      slug: d.vehicle_slug,
      image: d.vehicle_image,
    },
    // passenger: {
    //   adult: details.passenger.adult,
    //   children: details.passenger.children,
    // },
    // driver: {
    //   age: details.driver.age,
    //   license: details.driver.license,
    // },
    terms: {
      id: details.terms.id,
      confirmation: {
        text: details.terms.confirmation_terms,
        pdf: details.terms.confirmation,
      },
      summary: {
        text: details.terms.summary_terms,
        pdf: details.terms.summary,
      },
      counter: {
        text: details.terms.counter_terms,
        pdf: details.terms.counter,
      },
    },
    daily: getDailyRates(),
    bond: getBonds(),
    oneway: getOneways(),
    addon: getAddons(),
    special: getSpecials(),
    fee: getFees(),
    cc: getCcs(),
    term: getTerms(),
    // quote: updateQuote(),
  };

  const createQuote = async () => {
    noCustomer = false;
    if (quote.users) {
      const { data, error } = await supabase.from("quotes").insert(quote).select().single();
      setTimeout(() => {
        goto(`/admin/sales/quotes/${data.id}`);
      }, 500);
    } else {
      noCustomer = true;
    }
  };
</script>

<svelte:window bind:innerHeight={paneHeight} />
<PageTitle title="Create Quote" />
<div class="flex bg-white" style="height: {paneHeight - 150}px">
  <div class="flex-1 h-full overflow-y-auto">
    <div class="p-5">
      <section class="bg-white mb-4">
        <div class="py-2 border-b border-gray-200">
          <h2 class="text-xl font-bold">Trip Details</h2>
        </div>
        <!-- <h2 class="uppercase tracking-wider font-bold mb-2">Trip Summary</h2> -->
        <div class="grid grid-cols-1 md:grid-cols-3 py-4 gap-4">
          <div class="text-center">
            <img
              src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{info.vehicle
                .image}?width=200&height=200&resize=contain"
              alt={info.vehicle.name}
            />
          </div>
          <div class="col-span-2">
            <h2 class="text-lg font-bold mb-4">{info.vehicle.name}</h2>
            <div class="flex items-center justify-between py-2">
              <div class="w-5/12">
                <div class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400">Pick-up</div>
                <div class="font-bold text-lg">{info.quote.pickup.name}</div>
                <div>{dayjs(info.quote.pickup.date).format("DD/MM/YYYY (ddd)")}</div>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="w-4 h-4"
                  fill="currentColor"
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  /></svg
                >
              </div>
              <div class="w-5/12">
                <div class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400">Drop-off</div>
                <div class="font-bold text-lg">{info.quote.dropoff.name}</div>
                <div>{dayjs(info.quote.dropoff.date).format("DD/MM/YYYY (ddd)")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="bg-white mb-8">
        <div class="py-2 border-b border-gray-200">
          <h2 class="text-xl font-bold">Customer Details</h2>
        </div>
        {#if !user.id}
          <div class="py-5 text-center flex items-end">
            <div class="flex-1">
              <TextInput labelText="Customer Email or Name" bind:value={user.email} />
            </div>
            <Button on:click={lookupCustomer}>Search</Button>
          </div>
        {:else if user.id === "add"}
          <div class="grid grid-cols-1 gap-6 py-5">
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-6">
              <div>
                <Select name="title" labelText="Title" value={user.title} required>
                  <SelectItem value="Mr." text="Mr." />
                  <SelectItem value="Ms." text="Ms." />
                  <SelectItem value="Mrs." text="Mrs." />
                  <SelectItem value="Miss" text="Miss" />
                  <SelectItem value="Dr." text="Dr." />
                </Select>
              </div>
              <div class="col-span-2">
                <TextInput name="first_name" labelText="First Name" bind:value={user.first_name} required />
              </div>
              <div class="col-span-2">
                <TextInput name="last_name" labelText="Last Name" bind:value={user.last_name} required />
              </div>
            </div>
            <div>
              <TextInput name="email" labelText="Email" type="email" bind:value={user.email} required />
            </div>
            <div>
              <TextInput name="phone" labelText="Phone" bind:value={user.phone} required />
            </div>
            <div class="font-bold text-lg pt-10">Home Address</div>
            <div>
              <TextInput name="address_1" labelText="Address 1" bind:value={user.address_1} required />
            </div>
            <div>
              <TextInput name="address_2" labelText="Address 2" bind:value={user.address_2} required />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <TextInput name="postcode" labelText="Postcode" bind:value={user.postcode} required />
              </div>
              <div>
                <TextInput name="city" labelText="City" bind:value={user.city} required />
              </div>
              <div>
                <TextInput name="state" labelText="State" bind:value={user.state} required />
              </div>
              <div>
                <Select labelText="Country" name="country" bind:value={user.country}>
                  {#each data.countries as country}
                    <SelectItem value={country.name} />
                  {/each}
                </Select>
              </div>
            </div>
            <div>
              <Button on:click={addCustomer}>Add Customer</Button>
              <Button
                kind="ghost"
                on:click={() => {
                  user.id = null;
                }}>Cancel</Button
              >
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 py-5">
            <div>
              <div class="text-sm text-gray-400">Name</div>
              <div class="mb-5">{user.first_name} {user.last_name}</div>
              <div class="text-sm text-gray-400">Contact</div>
              <div class="mb-5">
                {user.email}<br />
                {user.phone}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Address</div>
              <div class="mb-5">
                {@html user.address_1 ? `${user.address_1},<br>` : ""}
                {@html user.address_2 ? `${user.address_2},<br>` : ""}
                {@html user.postcode ? `${user.postcode}` : ""}
                {@html user.city ? `${user.city},<br>` : ""}
                {@html user.state ? `${user.state}` : ""}
                {@html user.country ? `${user.country}` : ""}
              </div>
            </div>
          </div>
          <div>
            <Button on:click={changeCustomer}>Change Customer</Button>
          </div>
        {/if}
      </section>
      <section class="bg-white mb-8">
        <div class="py-2 border-b border-gray-200">
          <h2 class="text-xl font-bold">Driver's Details</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div>
            <Select name="license" labelText="License" bind:value={details.driver.license}>
              {#each data.options.licenses as license}
                <SelectItem value={license.name} />
              {/each}
            </Select>
          </div>
          <div>
            <NumberInput name="age" label="Age" bind:value={details.driver.age} allowEmpty required />
          </div>
        </div>
      </section>
      <section class="bg-white mb-8">
        <div class="py-2 border-b border-gray-200">
          <h2 class="text-xl font-bold">Passenger Details</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div>
            <NumberInput name="adult" label="No. of Adult" bind:value={details.passenger.adult} allowEmpty required />
          </div>
          <div>
            <NumberInput
              name="children"
              label="No. of Children"
              bind:value={details.passenger.children}
              allowEmpty
              required
            />
          </div>
        </div>
      </section>
      <section class="bg-white mb-8">
        <div class="py-2 border-b border-gray-200">
          <h2 class="text-xl font-bold">Price Details</h2>
        </div>
        <div class="font-bold text-sm text-gray-400 pt-5">Agent Fees</div>
        {#each agentFees as item}
          <div class="flex py-3 border-b border-gray-200">
            <div class="flex-1">
              {item.name}
            </div>
            <div class="text-right">
              {format.currency(item.total)}
            </div>
          </div>
        {/each}
        <div class="flex py-3 border-b border-gray-200 font-bold">
          <div class="flex-1">Total Agent Fees</div>
          <div class="text-right">
            {format.currency(quote.gross)}
          </div>
        </div>
        <div class="font-bold text-sm text-gray-400 pt-5">Supplier Fees</div>
        {#each supplierFees as item}
          <div class="flex py-3 border-b border-gray-200">
            <div class="flex-1">
              {item.name}
            </div>
            <div class="text-right">
              {format.currency(item.total)}
            </div>
          </div>
        {/each}
        <div class="flex py-3 border-b border-gray-200 font-bold">
          <div class="flex-1">Total Supplier Fees</div>
          <div class="text-right">
            {format.currency(quote.supplier_fee)}
          </div>
        </div>
      </section>
      <section class="bg-white mb-8">
        <div class="py-2 border-b border-gray-200">
          <h2 class="text-xl font-bold">Bond Options</h2>
        </div>
        <RadioButtonGroup orientation="vertical" selected={0} class="w-full [&>fieldset]:w-full">
          {#each d.bond_items as b, i}
            <div class="flex mb-2 justify-between w-full pt-2 pb-3 border-b border-gray-200">
              <div class="flex-1 flex justify-start">
                <RadioButton
                  labelText={`${b.display_name} - ${b.liability.toLocaleString(
                    "en-US"
                  )} Excess, ${b.bond.toLocaleString("en-US")} Bond (${format.currency(b.gross || 0)} x ${
                    b.cap ? (b.cap > d.duration ? d.duration : b.cap) : d.duration
                  } days)                
                `}
                  value={i}
                  on:change={() => {
                    selected_bond = i;
                    bond_fee = b.gross * (d.duration < (b.cap || 0) ? d.duration : b.cap || 0);
                    details.bonds = b;
                    updateQuote();
                    // console.log(details);
                  }}
                />
              </div>
              <div class="whitespace-nowrap pl-4">
                ${format.currency((b.gross || 0) * (b.cap ? (b.cap > d.duration ? d.duration : b.cap) : d.duration))}
              </div>
            </div>
          {/each}
        </RadioButtonGroup>
      </section>
      {#if d.addon_items.length}
        <section class="bg-white mb-8">
          <div class="py-2 border-b border-gray-200">
            <h2 class="text-xl font-bold">Add-ons</h2>
          </div>
          <div class="divide-y divide-gray-200">
            {#each d.addon_items as item, index1}
              {#each item.addons as addon, index2}
                <div class="flex justify-between py-2">
                  <div class="flex">
                    <div>
                      <Checkbox
                        on:change={(e) => {
                          let fee = addon.daily ? addon.gross_rate * d.duration : addon.gross_rate;
                          if (e.target.checked) {
                            addon_fee += fee;
                            details.addons[`${index1}-${index2}`] = addon;
                          } else {
                            addon_fee -= fee;
                            delete details.addons[`${index1}-${index2}`];
                          }
                          updateQuote();
                        }}
                      />
                    </div>
                    <div>
                      <div>
                        {addon.name}
                        {#if addon.daily}
                          {#if addon.gross_rate * d.duration > addon.gross_cap}
                            ${format.currency(addon.gross_cap)}
                          {:else}
                            (${format.currency(addon.gross_rate)} x {d.duration} days)
                          {/if}
                        {/if}
                      </div>
                      <div class="text-gray-400 text-sm">{addon.description}</div>
                    </div>
                  </div>
                  <div class="pl-4">
                    {#if addon.daily}
                      <!-- ${format.currency(addon.gross_rate * d.duration)} -->
                      {#if addon.gross_rate * d.duration > addon.gross_cap}
                        ${format.currency(addon.gross_cap)}
                      {:else}
                        ${format.currency(addon.gross_rate * d.duration)}
                      {/if}

                    {:else}
                      ${format.currency(addon.gross_rate)}
                    {/if}
                  </div>
                </div>
              {/each}
            {/each}
          </div>
        </section>
      {/if}
    </div>
  </div>
  <div class="h-full w-80 overflow-y-auto bg-brand-50">
    <div class="p-5">
      <div class="py-2 border-b border-gray-200">
        <h2 class="text-xl font-bold">Quote Details</h2>
      </div>
      <div class="pt-4">
        <h2 class="font-bold">Summary</h2>
      </div>
      <div class="flex py-3 border-b border-gray-200">
        <div class="flex-1">Total Receivable</div>
        <div class="text-right ml-4">{format.currency(quote.gross)}</div>
      </div>
      <div class="flex py-3 border-b border-gray-200">
        <div class="flex-1">Total Commission</div>
        <div class="text-right ml-4">{format.currency(quote.agent_fee)}</div>
      </div>
      <div>
        <div class="mb-2">Special Discount</div>
        <TextArea labelText="Remark" bind:value={quote.add_discount_remark} class="mb-2" />
        <NumberInput label="Amount" bind:value={quote.add_discount} on:blur={getTotalAgentCommission} />
      </div>
      <!-- <div class="flex py-3 border-b border-gray-200">
        <div class="flex-1">Total System Commission (8%)</div>
        <div class="text-right ml-4">{format.currency(quote.system_fee)}</div>
      </div>
      <div class="flex py-3 border-b border-gray-200 font-bold">
        <div class="flex-1">Nett Commission</div>
        <div class="text-right ml-4">{format.currency(quote.nett_profit)}</div>
      </div> -->
      <div class="pt-4">
        <h2 class="font-bold">Payment Schedule</h2>
      </div>
      {#each termsItems as item}
        <div class="flex py-3 border-b border-gray-200">
          <div class="flex-1">{item.name}</div>
          <div class="text-right">{format.currency(item.total)}</div>
        </div>
      {/each}
      <div class="pt-4">
        <Button on:click={createQuote}>Create Quote</Button>
        {#if noCustomer}
          <InlineNotification
            hideCloseButton
            lowContrast
            kind="warning"
            title="Required"
            subtitle="Please select a customer"
          />
        {/if}
      </div>
    </div>
  </div>
</div>
