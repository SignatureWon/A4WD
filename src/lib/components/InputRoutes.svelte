<script>
  import { supabase } from "$lib/supabaseClient";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import { Button, NumberInput } from "carbon-components-svelte";

  export let update = 1;

  const id = $page.params.id;

  let records = [];

  let loading = false;
  let show = false;
  let message = "";
  let errors = {};

  let supplier = {};

  const getRecord = async () => {
    // get routes
    try {
      loading = true;
      const { data, error } = await supabase
        .from("routes")
        .select("suppliers, routes")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        records = data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }

    // get supplier
    try {
      loading = true;
      const { data, error } = await supabase
        .from("suppliers")
        .select("depots")
        .eq("id", records.suppliers)
        .single();

      if (error) throw error;

      if (data) {
        supplier = data;
        let routes = [];

        supplier.depots.forEach((pickup) => {
          supplier.depots.forEach((dropoff) => {
            routes.push({
              code: `${pickup.Depots.code}-${dropoff.Depots.code}`,
              from: pickup.Depots,
              to: dropoff.Depots,
              days: 0,
              fee: 0,
            });
          });
        });

        routes.forEach((route) => {
          records.routes.forEach((exist) => {
            if (route.code === exist.code) {
              route.days = exist.days;
            }
          });
        });

        records.routes = routes;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };
  const updateRecord = async (record) => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("routes")
        .update(records)
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

  $: update, getRecord();
</script>

<Loading {loading} />
<Toast bind:show {message} />

<div class="bg-white">
  <form
    on:submit={() => {
      updateRecord();
    }}
  >
    {#if records.length === 0}
      <div class="px-4 py-20 text-center border-b border-gray-200">
        <div class="pb-4">No routes yet</div>
      </div>
    {:else}
      {#each records.routes as item, itemIndex}
        <div
          class="flex p-4 border-b border-gray-200 {item.from.label ===
          item.to.label
            ? 'bg-brand-50'
            : ''}"
        >
          <div class="w-8 text-right h-10 leading-10 text-gray-400">
            {itemIndex + 1}
          </div>
          <div class="md:flex flex-1">
            <div class="flex-1 flex px-2 pb-4">
              <div class="py-2">
                {item.from.label}
              </div>
              <div class="text-gray-400 px-2 pt-3">
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
              <div class="py-2">
                {item.to.label}
              </div>
            </div>
            <div class="flex">
              <div class="w-1/2 md:w-40 px-2">
                <NumberInput label="Minimum Days" bind:value={item.days} />
              </div>
              <div class="w-1/2 md:w-40 px-2">
                <NumberInput label="One-way Fee" bind:value={item.fee} />
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
    <footer class="p-5 bg-gray-50 flex items-center justify-between">
      <div />
      <div>
        <Button type="submit">Save</Button>
      </div>
    </footer>
  </form>
</div>
