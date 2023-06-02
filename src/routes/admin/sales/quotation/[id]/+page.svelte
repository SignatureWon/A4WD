<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
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
  } from "carbon-components-svelte";
  import { format } from "$lib/format.js";
  import { env } from "$env/dynamic/public";
  import dayjs from "dayjs";
  import Trip from "../Trip.svelte";
  import Customer from "../Customer.svelte";
  import Driver from "../Driver.svelte";
  import { bind } from "svelte/internal";
  import Section from "../Section.svelte";
  import Passenger from "../Passenger.svelte";
  import FeeDaily from "../FeeDaily.svelte";
  import FeeBond from "../FeeBond.svelte";
  import FeeAddons from "../FeeAddons.svelte";
  import FeeOthers from "../FeeOthers.svelte";
  import FeeSpecials from "../FeeSpecials.svelte";

  export let data;

  let paneHeight = 0;
  const d = data.detail;
  let details = data.quote.details;
  let selected_bond = 0;
  let bond_fee = 0;
  if (d.bond_items.length) {
    bond_fee =
      d.bond_items[0].gross * (d.duration < (d.bond_items[0].cap || 0) ? d.duration : d.bond_items[0].cap || 0);
  }
  let selected_addons = [];

  let addon_fee = 0;
  let noCustomer = false;
  let user = data.user;
  let quote = data.quote;

  const duration = details.duration;
  const date_quote = dayjs().format("DD MMM YYYY");
  const date_start = dayjs(details.date_start).format("ddd, DD MMM YYYY");
  const date_end = dayjs(details.date_end).format("ddd, DD MMM YYYY");
  let agentFees = [];
  let supplierFees = [];
  let pickupFees = [];
  let totalPickupFees = 0;

  let fees = {
    daily: [],
    bond: {},
    addons: {},
    others: [],
  };
  let fee_discount = {
    daily: {
      name: "",
      value: "",
    },
    specials: [],
  };

  let total_gross = 0
  let total_commission = 0
  const countFees = () => {

  }



  // const lookupCustomer = async () => {
  //   noCustomer = false;
  //   const { data: dataCustomer, error: errorData } = await supabase
  //     .from("users")
  //     .select()
  //     .eq("email", user.email)
  //     .single();

  //   // console.log(dataCustomer);
  //   if (dataCustomer) {
  //     // console.log("YES");
  //     user = dataCustomer;
  //     quote.users = dataCustomer.id;
  //   } else {
  //     // console.log("NO");
  //     user.id = "add";
  //   }
  // };
  // const changeCustomer = () => {
  //   noCustomer = false;
  //   user = {
  //     id: null,
  //     first_name: null,
  //     last_name: null,
  //     phone: null,
  //     email: null,
  //     address_1: null,
  //     address_2: null,
  //     postcode: null,
  //     city: null,
  //     state: null,
  //     country: null,
  //   };
  //   quote.users = null;
  // };
  // const addCustomer = async () => {
  //   noCustomer = false;
  //   delete user.id;
  //   const { data: dataCustomer, error: errorData } = await supabase.from("users").insert(user).select().single();

  //   // console.log(dataCustomer);
  //   if (dataCustomer) {
  //     // console.log("YES");
  //     user.id = dataCustomer.id;
  //     quote.users = dataCustomer.id;
  //   } else {
  //     // console.log("NO");
  //     user.id = null;
  //     quote.users = null;
  //   }
  // };

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
                ? `supplier at pick-up counter on ${date_start.format("ddd, DD MMM YYYY")}`
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
    // daily: getDailyRates(),
    // bond: getBonds(),
    // oneway: getOneways(),
    // addon: getAddons(),
    // special: getSpecials(),
    // fee: getFees(),
    // cc: getCcs(),
    // term: getTerms(),
    // quote: updateQuote(),
  };
</script>

<svelte:window bind:innerHeight={paneHeight} />

<PageTitle title="Q{388000 + data.quote.id}" path={data.path} id={data.id} />
<div class="flex bg-white" style="height: {paneHeight - 190}px">
  <div class="flex-1 h-full overflow-y-auto">
    <div class="p-5">
      <Section title="Trip Details">
        <Trip {info} />
      </Section>
      <Section title="Customer Details">
        <Customer {user} />
      </Section>
      <Section title="Driver's Details">
        <Driver licenseOptions={data.options.licenses} bind:driver={details.driver} />
      </Section>
      <Section title="Passenger Details">
        <Passenger passenger={details.passenger} />
      </Section>
      <Section title="Daily basic rental">
        <FeeDaily
          bind:fees={fees.daily}
          daily={details.daily}
          type={details.rates_type}
          discount={fee_discount.daily}
        />
      </Section>
      <Section title="Bond Options">
        <FeeBond
          bind:fees={fees.bond}
          list={d.bond_items}
          bind:bonds={details.bonds}
          bind:selected={selected_bond}
          duration={d.duration}
        />
      </Section>
      <Section title="Add-ons">
        <FeeAddons
          bind:fees={fees.addons}
          addons={d.addon_items}
          bind:selected={selected_addons}
          bind:bond={fees.bond}
          duration={d.duration}
        />
      </Section>
      <Section title="Other Fees">
        <FeeOthers bind:fees={fees.others} one_way={details.one_way} others={details.fees} />
      </Section>
      <Section title="Specials">
        <FeeSpecials bind:fees={fee_discount.specials} specials={details.specials} />
      </Section>
    </div>
  </div>
  <div class="h-full w-80 overflow-y-auto bg-brand-50">
    <div class="overflow-y-auto" style="height: {paneHeight - 330}px">
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
        <div class="flex py-3 border-b border-gray-200">
          <div class="flex-1">Total System Commission (8%)</div>
          <div class="text-right ml-4">{format.currency(quote.system_fee)}</div>
        </div>
        <div class="flex py-3 border-b border-gray-200 font-bold">
          <div class="flex-1">Nett Commission</div>
          <div class="text-right ml-4">{format.currency(quote.nett_profit)}</div>
        </div>
        <div class="pt-4">
          <h2 class="font-bold">Payment Schedule</h2>
        </div>
        {#each termsItems as item}
          <div class="flex py-3 border-b border-gray-200">
            <div class="flex-1">{item.name}</div>
            <div class="text-right">{format.currency(item.total)}</div>
          </div>
        {/each}
      </div>
    </div>
    <div class="p-5">
      <Button on:click={() => {
        console.log("fees", fees);
        console.log("fee_discount", fee_discount);
      }} class="w-full">Update Quote</Button>
      <div class="pt-4 flex justify-between">
        <Button kind="ghost" on:click={() => console.log("Preview")}>Preview Quote</Button>
        <Button kind="tertiary" on:click={() => console.log("Email")}>Email Quote</Button>
      </div>
    </div>
  </div>
</div>
