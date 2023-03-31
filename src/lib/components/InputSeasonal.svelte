<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  import {
    Button,
    NumberInput,
    Select,
    SelectItem,
  } from "carbon-components-svelte";

  let id = $page.params.id;
  let rates = {
    fees: [],
  };
  let suppliers = [];
  let vehicles = [];

  let loading = false;
  let show = false;
  let message = "";
  let errors = {};

  onMount(async () => {
    const { data: dbrates } = await supabase
      .from("rates")
      .select()
      .eq("id", id)
      .single();
    rates = dbrates;

    const { data: dbvehicles } = await supabase
      .from("vehicles")
      .select()
      .eq("suppliers", rates.suppliers);
    vehicles = dbvehicles;

    const { data: dbsuppliers } = await supabase
      .from("suppliers")
      .select()
      .eq("id", rates.suppliers)
      .single();
    suppliers = dbsuppliers;
  });

  const updateRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("rates")
        .update({ fees: rates.fees })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      errors = error;
    } finally {
      message = "Updated successfully";
      show = true;
      loading = false;
    }
  };

  const feeStructure = {
    Europcar: [
      {
        from: 2,
        to: 3,
        fee: 0,
      },
      {
        from: 4,
        to: 6,
        fee: 0,
      },
      {
        from: 7,
        to: 13,
        fee: 0,
      },
      {
        from: 14,
        to: 9999,
        fee: 0,
      },
    ],
  };

  const addRecord = () => {
    rates.fees = [
      ...rates.fees,
      {
        depots: "",
        vehicles: "",
        fee: 0,
        specials: feeStructure[suppliers.name]
      },
    ];
  };
</script>

<Loading {loading} />
<Toast bind:show {message} />

<div class="bg-white">
  <form
    on:submit={() => {
      updateRecord();
    }}
  >
    {suppliers.name}
    {#if rates.fees.length === 0}
      <div class="px-4 py-20 text-center border-b border-gray-200">
        <div class="pb-4">No records yet</div>
      </div>
    {:else}
      {#each rates.fees as fee, i}
        <div class="px-4 pt-2 pb-4 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <Select
                labelText="Depot"
                name="depots"
                bind:selected={fee.depots}
                required={true}
              >
                <SelectItem value="" text="Select depot" />
                {#each suppliers.depots as depot}
                  <SelectItem
                    value={depot.Depots.id}
                    text={depot.Depots.label}
                  />
                {/each}
              </Select>
            </div>
            <div class="md:col-span-1">
              <Select
                labelText="Vehicle"
                name="vehicles"
                bind:selected={fee.vehicles}
                required={true}
              >
                <SelectItem value="" text="Select vehicle" />
                {#each vehicles as vechicle}
                  <SelectItem value={vechicle.id} text={vechicle.name} />
                {/each}
              </Select>
            </div>
            <div class="md:col-span-1">
              <div class="pt-2">
                <NumberInput
                  label="Daily"
                  name="fees"
                  bind:value={fee.fees}
                  step={1}
                />
              </div>
            </div>
            {#each feeStructure[suppliers.name] as special, specialIndex}
            <div class="md:col-span-1">
              <div class="pt-2">
                <NumberInput
                  label="{special.from}{special.to === 9999 ? '+' : ` - ${special.to}`} days"
                  name="fees"
                  bind:value={fee.fees}
                  step={1}
                />
              </div>
            </div>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
    <footer class="p-5 bg-gray-50 flex items-center justify-between">
      <div>
        <Button class="flex" kind="secondary" on:click={() => addRecord()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            class="w-4 h-4"
            ><path fill="none" d="M0 0h24v24H0z" /><path
              d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
            /></svg
          >
          <span class="hidden sm:block ml-2">New</span>
        </Button>
      </div>
      <div>
        <Button type="submit">Save</Button>
      </div>
    </footer>
  </form>
</div>
