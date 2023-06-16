<script>
  import { supabase } from "$lib/supabaseClient";
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import { enhance } from "$app/forms";
  import { html } from "$lib/provisional.js";
  import { jsPDF } from "jspdf";
  import {
    Button,
    Checkbox,
    DatePicker,
    DatePickerInput,
    InlineNotification,
    Modal,
    NumberInput,
    RadioButton,
    RadioButtonGroup,
    Select,
    SelectItem,
    TextArea,
    TextInput,
    Toggle,
  } from "carbon-components-svelte";
  import { format } from "$lib/format.js";
  import { env } from "$env/dynamic/public";
  import dayjs from "dayjs";
  import { bind, onMount } from "svelte/internal";
  import Trip from "$lib/admin/quote/Trip.svelte";
  import Customer from "$lib/admin/quote/Customer.svelte";
  import Confirmation from "$lib/admin/quote/Confirmation.svelte";
  import Driver from "$lib/admin/quote/Driver.svelte";
  import Section from "$lib/admin/quote/Section.svelte";
  import Passenger from "$lib/admin/quote/Passenger.svelte";
  import FeeDaily from "$lib/admin/quote/FeeDaily.svelte";
  import FeeBond from "$lib/admin/quote/FeeBond.svelte";
  import FeeAddons from "$lib/admin/quote/FeeAddons.svelte";
  import FeeOthers from "$lib/admin/quote/FeeOthers.svelte";
  import FeeSpecials from "$lib/admin/quote/FeeSpecials.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
  import CryptoJS from "crypto-js";

  export let data;
  console.log(data);

  let emailContent = "";

  // console.log(data.templates);
  let paneHeight = 0;
  // const d = data.detail;
  // let details = data.quote.details;
  // let selected_bond = 0;
  // let bond_fee = 0;
  // if (d.bond_items.length) {
  //   bond_fee =
  //     d.bond_items[0].gross * (d.duration < (d.bond_items[0].cap || 0) ? d.duration : d.bond_items[0].cap || 0);
  // }
  // let selected_addons = [];

  // let addon_fee = 0;
  // let noCustomer = false;
  // let user = data.user;
  // let quote = data.quote;

  // const duration = details.duration;
  // const date_quote = dayjs().format("DD MMM YYYY");
  // const date_start = dayjs(details.date_start).format("ddd, DD MMM YYYY");
  // const date_end = dayjs(details.date_end).format("ddd, DD MMM YYYY");
  // let agentFees = [];
  // let supplierFees = [];
  // let pickupFees = [];
  // let totalPickupFees = 0;

  // let fees = {
  //   daily: [],
  //   bond: {},
  //   addons: {},
  //   others: [],
  // };
  // let fee_discount = {
  //   daily: {
  //     name: "",
  //     value: 0,
  //   },
  //   specials: [],
  // };

  // // const lookupCustomer = async () => {
  // //   noCustomer = false;
  // //   const { data: dataCustomer, error: errorData } = await supabase
  // //     .from("users")
  // //     .select()
  // //     .eq("email", user.email)
  // //     .single();

  // //   // console.log(dataCustomer);
  // //   if (dataCustomer) {
  // //     // console.log("YES");
  // //     user = dataCustomer;
  // //     quote.users = dataCustomer.id;
  // //   } else {
  // //     // console.log("NO");
  // //     user.id = "add";
  // //   }
  // // };
  // // const changeCustomer = () => {
  // //   noCustomer = false;
  // //   user = {
  // //     id: null,
  // //     first_name: null,
  // //     last_name: null,
  // //     phone: null,
  // //     email: null,
  // //     address_1: null,
  // //     address_2: null,
  // //     postcode: null,
  // //     city: null,
  // //     state: null,
  // //     country: null,
  // //   };
  // //   quote.users = null;
  // // };
  // // const addCustomer = async () => {
  // //   noCustomer = false;
  // //   delete user.id;
  // //   const { data: dataCustomer, error: errorData } = await supabase.from("users").insert(user).select().single();

  // //   // console.log(dataCustomer);
  // //   if (dataCustomer) {
  // //     // console.log("YES");
  // //     user.id = dataCustomer.id;
  // //     quote.users = dataCustomer.id;
  // //   } else {
  // //     // console.log("NO");
  // //     user.id = null;
  // //     quote.users = null;
  // //   }
  // // };

  // const getTotalAgentFee = () => {
  //   let sum = 0;
  //   agentFees.forEach((fee) => {
  //     sum += fee.total;
  //   });
  //   quote.gross = sum;
  //   return sum;
  // };
  // const getTotalAgentCommission = () => {
  //   // console.log(agentFees);
  //   let sum = 0;
  //   agentFees.forEach((fee) => {
  //     sum += fee.profit;
  //   });
  //   quote.agent_fee = sum;
  //   quote.system_fee_fee = ((quote.agent_fee - quote.add_discount) * 8) / 100;
  //   quote.nett_profit = quote.agent_fee - quote.add_discount - quote.system_fee_fee;
  //   return sum;
  // };
  // const getTotalSupplierFee = () => {
  //   let sum = 0;
  //   supplierFees.forEach((fee) => {
  //     sum += fee.total;
  //   });
  //   quote.supplier_fee = sum;
  //   return sum;
  // };

  // let termsItems = [];
  // const getTerms = () => {
  //   let total = getTotalAgentFee();
  //   getTotalAgentCommission();
  //   getTotalSupplierFee();

  //   if ("terms" in quote.details) {
  //     let terms = details.terms;
  //     let gap = dayjs(date_start).diff(dayjs(date_quote), "day");

  //     if (gap < terms.balance) {
  //       termsItems = [
  //         {
  //           name: `Full payment to agent on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
  //           total: total,
  //         },
  //       ];
  //     } else {
  //       termsItems = [
  //         {
  //           name: `Booking deposit to agent now (${
  //             terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
  //           }) on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
  //           total: terms.percentage ? (total * terms.deposit) / 100 : terms.deposit,
  //         },
  //       ];
  //       if (terms.payment2) {
  //         if (terms.balance2 < gap) {
  //           termsItems.push({
  //             name: `First payment to agent (${
  //               terms.percentage2 ? `${terms.deposit2}%` : `$${terms.deposit2}`
  //             }) on ${dayjs(date_start).subtract(terms.balance2, "day").format("ddd, DD MMM YYYY")} (${
  //               terms.balance2
  //             } days before
  //               travel)`,
  //             total: terms.percentage2 ? (total * terms.deposit2) / 100 : terms.deposit2,
  //           });
  //         }
  //       }
  //       if (terms.payment3) {
  //         if (terms.balance3 < gap) {
  //           termsItems.push({
  //             name: `Second payment (${terms.percentage3 ? `${terms.deposit3}%` : `$${terms.deposit3}`}) on ${dayjs(
  //               date_start
  //             )
  //               .subtract(terms.balance3, "day")
  //               .format("ddd, DD MMM YYYY")} (${terms.balance3} days before
  //               travel)`,
  //             total: terms.percentage3 ? (total * terms.deposit3) / 100 : terms.deposit3,
  //           });
  //         }
  //       }
  //       // balance
  //       if (terms.balance < gap) {
  //         let bal = total;
  //         termsItems.forEach((t) => {
  //           bal -= t.total;
  //         });

  //         termsItems.push({
  //           name:
  //             "Balance payment to " +
  //             (terms.pay_counter
  //               ? `supplier at pick-up counter on ${date_start.format("ddd, DD MMM YYYY")}`
  //               : `agent on ${dayjs(date_start).subtract(terms.balance, "day").format("ddd, DD MMM YYYY")}`) +
  //             ` (${terms.balance} days before travel)`,
  //           total: bal,
  //         });
  //       }
  //     }
  //   }
  // };
  // // const updateQuote = () => {
  // //   agentFees = [];
  // //   supplierFees = [];
  // //   pickupFees = [];
  // //   getDailyRates();
  // //   getBonds();
  // //   getOneways();
  // //   getAddons();
  // //   getSpecials();
  // //   getFees();
  // //   getCcs();
  // //   getTerms();
  // //   getTotalAgentFee();
  // //   getTotalAgentCommission();
  // //   getTotalSupplierFee();
  // // };

  // // map data
  // const info = {
  //   // user: {
  //   //   first_name: quote.users.first_name,
  //   //   last_name: quote.users.last_name,
  //   //   email: quote.users.email,
  //   //   phone: quote.users.phone,
  //   //   address_1: quote.users.address_1,
  //   //   address_2: quote.users.address_2,
  //   //   postcode: quote.users.postcode,
  //   //   city: quote.users.city,
  //   //   state: quote.users.state,
  //   //   country: quote.users.country,
  //   // },
  //   quote: {
  //     // id: quote.id + 388000,
  //     date: date_quote,
  //     duration: duration,
  //     pickup: {
  //       name: details.pickup.name,
  //       date: date_start,
  //     },
  //     dropoff: {
  //       name: details.dropoff.name,
  //       date: date_end,
  //     },
  //   },
  //   // comment: quote.comment,
  //   vehicle: {
  //     name: d.vehicle_name,
  //     slug: d.vehicle_slug,
  //     image: d.vehicle_image,
  //   },
  //   // passenger: {
  //   //   adult: details.passenger.adult,
  //   //   children: details.passenger.children,
  //   // },
  //   // driver: {
  //   //   age: details.driver.age,
  //   //   license: details.driver.license,
  //   // },
  //   // terms: {
  //   //   id: details.terms.id,
  //   //   confirmation: {
  //   //     text: details.terms.confirmation_terms,
  //   //     pdf: details.terms.confirmation,
  //   //   },
  //   //   summary: {
  //   //     text: details.terms.summary_terms,
  //   //     pdf: details.terms.summary,
  //   //   },
  //   //   counter: {
  //   //     text: details.terms.counter_terms,
  //   //     pdf: details.terms.counter,
  //   //   },
  //   // },
  //   // daily: getDailyRates(),
  //   // bond: getBonds(),
  //   // oneway: getOneways(),
  //   // addon: getAddons(),
  //   // special: getSpecials(),
  //   // fee: getFees(),
  //   // cc: getCcs(),
  //   // term: getTerms(),
  //   // quote: updateQuote(),
  // };

  // // $: console.log("fees", fees);
  // // $: console.log("fee_discount", fee_discount);
  // // let quote.gross = 0;
  // // let quote.nett = 0;
  // // let quote.profit = 0;
  // // let quote.add_discount = 0;
  // // let quote.discount = 0;
  // // let quote.cc_fee = 0;
  // // let quote.receivables = 0;
  // // let quote.cc_charge = true;
  // // let quote.system_fee = 0;
  // // let quote.nett_profit = 0;

  // const countFees = () => {
  //   quote.gross = 0;
  //   quote.nett = 0;
  //   quote.profit = 0;
  //   // quote.add_discount = 0;
  //   quote.discount = 0;
  //   quote.receivables = 0;
  //   quote.cc_fee = 0;
  //   quote.system_fee = 0;
  //   quote.nett_profit = 0;

  //   // daily
  //   fees.daily.forEach((obj) => {
  //     quote.gross += obj.total;
  //     quote.nett += obj.nett;
  //     quote.profit += obj.profit;
  //   });

  //   // bond
  //   quote.gross += fees.bond.total;
  //   quote.nett += fees.bond.nett;
  //   quote.profit += fees.bond.profit;

  //   // addons
  //   for (const key in fees.addons) {
  //     let obj = fees.addons[key];
  //     quote.gross += obj.total;
  //     quote.nett += obj.nett;
  //     quote.profit += obj.profit;
  //   }

  //   // others
  //   fees.others.forEach((obj) => {
  //     quote.gross += obj.total;
  //     quote.nett += obj.nett;
  //     quote.profit += obj.profit;
  //   });

  //   // discount
  //   // quote.add_discount += fee_discount.daily.value;

  //   // specials
  //   fee_discount.specials.forEach((obj) => {
  //     quote.discount += obj.total;
  //   });

  //   quote.cc_fee = quote.cc_charge ? (quote.gross - quote.discount - quote.add_discount) * 0.02 : 0;
  //   quote.receivables = quote.gross - quote.discount - quote.add_discount + quote.cc_fee;

  //   quote.profit -= quote.add_discount;
  //   quote.system_fee = quote.profit * 0.08;
  //   quote.nett_profit = quote.profit - quote.system_fee;
  // };

  let open = false;
  let openEmail = false;

  let emailPreview = "";

  // onMount(() => {
  //   countFees();
  // });

  // countFees();

  // $: countFees()
  data.quote.cc_fee = data.quote.cc_charge ? data.quote.cc_fee || data.quote.gross * 0.02 : 0;
  let total_receivable = data.quote.cc_fee + data.quote.gross;

  let termsItems = [];
  const date_quote = dayjs(data.quote.created_at).format("DD MMM YYYY");
  const date_start = dayjs(data.quote.details.date_start).format("ddd, DD MMM YYYY");
  const date_end = dayjs(data.quote.details.date_end).format("ddd, DD MMM YYYY");

  let total = total_receivable;

  if ("terms" in data.quote.details) {
    let terms = data.quote.details.terms;
    let gap = dayjs(date_start).diff(dayjs(date_quote), "day");

    if (gap <= terms.balance) {
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
  // onMount(() => {
    console.log(data.quote.payments);

    if (!data.quote.payments) {
      data.quote.payments = [];
    }
    console.log(data.quote.payments);
  // });

  let newPayment = {
    date: dayjs().format("DD/MM/YYYY"),
    method: "Credit Card",
    amount: 0,
    remark: null,
  };
  let noVal = false;
  const addPayment = async () => {
    if (newPayment.amount === 0) {
      noVal = true;
    } else {
      data.quote.payments = [...data.quote.payments, newPayment];
      newPayment = {
        date: dayjs().format("DD/MM/YYYY"),
        method: "Credit Card",
        amount: 0,
        remark: null,
      };
      noVal = false;

      const { error: updateError } = await supabase
        .from("quotes")
        .update({ payments: data.quote.payments })
        .eq("id", data.quote.id);

      if (updateError) {
        console.log(updateError);
      }
    }
  };
  let passcode = "";
</script>

<svelte:window bind:innerHeight={paneHeight} />

<PageTitle title="Q{388000 + data.quote.id}" path={data.path} id={data.id} />
<div class="flex bg-white" style="height: {paneHeight - 190}px">
  <div class="flex-1 h-full overflow-y-auto">
    <div class="p-5">
      <Section title="Payments Schedule">
        {#each termsItems as item}
          <div class="flex py-3 border-b border-gray-200">
            <div class="flex-1">{item.name}</div>
            <div class="w-20">{format.currency(item.total)}</div>
          </div>
        {/each}
      </Section>
      <Section title="Payments">
        <div class="p-4 bg-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <DatePicker datePickerType="single" dateFormat="d/m/Y" bind:value={newPayment.date} required>
              <DatePickerInput labelText="Date" placeholder="dd/mm/yyyy" />
            </DatePicker>
            <Select labelText="Method" bind:value={newPayment.method}>
              <SelectItem value="Credit Card" text="Credit Card" />
              <SelectItem value="Bank Transfer" text="Bank Transfer" />
              <SelectItem value="Cash" text="Cash" />
            </Select>
            <NumberInput
              label="Amount"
              bind:value={newPayment.amount}
              step={0.01}
              required
              helperText={noVal ? "No amount" : ""}
            />
          </div>
          <div class="mb-4">
            <TextInput labelText="Remark" class="md:col-span-2" bind:value={newPayment.remark} />
          </div>
          <div>
            <Button on:click={addPayment}>Add</Button>
          </div>
        </div>
        {#each data.quote.payments as item}
          <div class="py-4 border-b border-gray-200">
            <div class="grid grid-cols-3 mb-4">
              <div>
                <div class="text-sm text-gray-400">Date</div>
                <div>{item.date}</div>
              </div>
              <div>
                <div class="text-sm text-gray-400">Method</div>
                <div>{item.method}</div>
              </div>
              <div>
                <div class="text-sm text-gray-400">Amount</div>
                <div>{item.amount}</div>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Remark</div>
              <div>{item.remark || "No remark"}</div>
            </div>
          </div>
        {/each}
      </Section>
      <Section title="Card Details">
        <div class="py-4">
          <div class="mb-4">
            <div class="text-sm text-gray-400">Card type</div>
            <div>{data.quote.cc_type}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400">Card name</div>
            <div>{data.quote.cc_name}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400">Card number</div>
            <div>{data.quote.cc_number}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400">Card date</div>
            <div>{data.quote.cc_month}/{data.quote.cc_year}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400">Card CVV</div>
            <div>{data.quote.cc_cvv}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400">Card comment</div>
            <div>{data.quote.cc_remark}</div>
          </div>
        </div>
        <div class="p-4 bg-gray-100 my-4">
          <div class="flex max-w-xs mx-auto">
            <TextInput bind:value={passcode} placeholder="Passcode" />
            <Button
              on:click={() => {
                data.quote.cc_number = CryptoJS.AES.decrypt(data.quote.cc_number, passcode).toString(CryptoJS.enc.Utf8);
                data.quote.cc_cvv = CryptoJS.AES.decrypt(data.quote.cc_cvv, passcode).toString(CryptoJS.enc.Utf8);
              }}>Reveal Card</Button
            >
          </div>
        </div>
      </Section>

      <!-- <Section title="Trip Details">
        <Trip {info} />
      </Section>
      <Section title="Customer Details">
        <Customer {user} />
      </Section>
      <Section title="Confirmation Details">
        <Confirmation code={quote.supplier_reference} />
      </Section>
      <Section title="Driver's Details">
        <Driver licenseOptions={data.options.licenses} bind:driver={details.driver} />
      </Section>
      <Section title="Passenger Details">
        <Passenger passenger={details.passenger} />
      </Section>
      <Section title="Daily basic rental">
        <FeeDaily bind:fees={fees.daily} daily={details.daily} type={details.rates_type} {quote} count={countFees} />
      </Section>
      <Section title="Bond Options">
        <FeeBond
          bind:fees={fees.bond}
          list={d.bond_items}
          bind:bonds={details.bonds}
          bind:selected={selected_bond}
          duration={d.duration}
          count={countFees}
        />
      </Section>
      <Section title="Add-ons">
        <FeeAddons
          bind:fees={fees.addons}
          bind:addons={details.addons}
          list={d.addon_items}
          duration={d.duration}
          count={countFees}
        />
      </Section>
      <Section title="Other Fees">
        <FeeOthers bind:fees={fees.others} one_way={details.one_way} others={details.fees} />
      </Section>
      <Section title="Specials">
        <FeeSpecials bind:fees={fee_discount.specials} specials={details.specials} />
      </Section> -->
    </div>
  </div>
  <div class="h-full w-80 overflow-y-auto bg-brand-50">
    <div class="overflow-y-auto" style="height: {paneHeight - 330}px">
      <div class="p-5">
        <h2 class="text-xl font-bold mb-2">Quote Summary</h2>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total Gross</div>
          <div class="text-right ml-4">{format.currency(data.quote.gross)}</div>
        </div>
        <!-- <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total Specials</div>
          <div class="text-right ml-4">{format.currency(quote.discount)}</div>
        </div>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total Discount</div>
          <div class="text-right ml-4">{format.currency(quote.add_discount)}</div>
        </div> -->
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1 relative">
            <!-- <Toggle
              labelA=""
              labelB=""
              size="sm"
              bind:toggled={quote.cc_charge}
              on:toggle={countFees}
              class="absolute -mt-1"
            /> -->
            <div>Credit Card</div>
          </div>
          <div class="text-right ml-4">{format.currency(data.quote.cc_fee || 0)}</div>
        </div>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1 font-bold">Total Receivables</div>
          <div class="text-right ml-4 font-bold">{format.currency(total_receivable)}</div>
        </div>
        <!-- <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total Nett</div>
          <div class="text-right ml-4">{format.currency(quote.nett)}</div>
        </div>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total Profit</div>
          <div class="text-right ml-4">{format.currency(quote.profit)}</div>
        </div>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total System Fee</div>
          <div class="text-right ml-4">{format.currency(quote.system_fee)}</div>
        </div>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1 font-bold">Total A4 Profit</div>
          <div class="text-right ml-4 font-bold">{format.currency(quote.nett_profit)}</div>
        </div> -->
      </div>
    </div>
    <div class="p-4">
      <form action="?/update" method="POST">
        <Button type="submit" class="w-full">Update Ticket</Button>
        <!-- <Button
          on:click={() => {
            console.log(quote);
          }}
          class="w-full"
        >
          Update Quote
        </Button> -->
        <input type="hidden" name="quote" value={JSON.stringify(data.quote)} />
      </form>
      <div class="pt-2 grid grid-cols-2 gap-2">
        <div>
          <Button
            kind="tertiary"
            on:click={async () => {
              emailPreview = await html.create(data.quote.id);
              open = true;
            }}
            class="p-0.5 h-6 w-full">Preview Ticket</Button
          >
        </div>
        <div>
          <form action="?/download" method="POST">
            <Button kind="tertiary" type="submit" class="p-0.5 h-6 w-full">Generate PDF</Button>
          </form>
        </div>
        <div>
          <Button
            kind="tertiary"
            href="https://api.australia4wdrentals.com/storage/v1/object/public/quotes/P{388000 + data.quote.id}.pdf"
            target="_blank"
            class="p-0.5 h-6 w-full block">Download PDF</Button
          >
        </div>
        <div>
          <Button
            kind="tertiary"
            class="p-0.5 h-6 w-full"
            on:click={() => {
              openEmail = true;
            }}>Email Ticket</Button
          >
          <!-- <form action="?/email" method="POST">
            <Button kind="tertiary" type="submit" class="p-0.5 h-6 w-full">Email Quote</Button>
          </form> -->
        </div>
      </div>
    </div>
    <!-- <div class="p-4 bg-brand-200">
      <form action="?/provisional" method="POST">
        <TextInput name="supplier_reference" placeholder="Supplier Booking Reference" class="text-center" />
        <Button type="submit" class="w-full">Create Provisional Ticket</Button>
      </form>
    </div> -->
  </div>
</div>

<Modal passiveModal bind:open={openEmail} modalHeading="Email Provisional Ticket" on:open on:close>
  <div>
    <Select
      labelText="Templates"
      on:change={(e) => {
        emailContent = e.target.value;
      }}
      class="mb-4"
    >
      <SelectItem value="" text="Choose a template" />
      {#each data.templates as item}
        <SelectItem value={item.content} text={item.name} />
      {/each}
    </Select>
  </div>
  <form action="?/email" method="POST">
    <InputRichText name="message" label="Message" bind:value={emailContent} />
    <Button type="submit" class="w-full">Send</Button>
  </form>
</Modal>
<Modal passiveModal bind:open modalHeading="Preview" on:open on:close>
  <!-- <div class="fixed">
    <Button
      on:click={async () => {
        const doc = new jsPDF();
        // const elem = document.getElementById("htmlcontent");
        doc.html(document.getElementById("htmlcontent"), {
          callback: function (doc) {
            doc.save("Generated.pdf");
          },
          x: 15,
          y: 15,
          width: 180, //target width in the PDF document
          windowWidth: 650, //window width in CSS pixels
          pagesplit: true,
        });
        // await doc
        //         .html(elem, 15, 15, {
        //           width: 170,
        //           //   elementHandlers: specialElementHandlers,
        //         })
        //         .save("test.pdf");
      }}>DOWNLOAD</Button
    >
  </div>
  <div class="pt-20"> -->
  <div id="htmlcontent">
    {@html emailPreview}
  </div>
  <!-- </div> -->
</Modal>
