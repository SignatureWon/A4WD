<script>
  import {
    Button,
    InlineNotification,
    Modal,
    NumberInput,
    Toggle,
  } from "carbon-components-svelte";
  import { db } from "$lib/db";
  import { supabase } from "$lib/supabaseClient";

  //   export let key = "";
  //   export let field = {};
  export let data = {
    routes: [],
  };

  let open = false;

  const genRoutes = async () => {
    const dataDepots = await db.all({
      from: "routes_depots",
      select: "routes, depots, depots (name, code)",
      eq: [
        {
          name: "routes",
          value: data.id,
        },
      ],
    });

    let newRoutes = [];

    dataDepots.forEach((pickup) => {
      dataDepots.forEach((dropoff) => {
        newRoutes.push({
          code: `${pickup.depots.code}-${dropoff.depots.code}`,
          from: pickup.depots.name,
          to: dropoff.depots.name,
          days: 0,
          fee: 0,
          active: true,
        });
      });
    });

    newRoutes.forEach((route) => {
      data.routes.forEach((exist) => {
        if (route.code === exist.code) {
          route.days = exist.days;
          route.fee = exist.fee;
          route.active = exist.active;
        }
      });
    });
    data.routes = newRoutes;
  };
  const saveRoutes = async () => {
    data.updated = false;
    await supabase
      .from("routes")
      .update({
        routes: data.routes,
      })
      .eq("id", data.id);

    open = false;
    data.updated = true;
  };
</script>

{#if data.id}
  <Button
    on:click={() => {
      open = true;
      genRoutes();
    }}
  >
    Manage Routes
  </Button>

  <Modal
    size="lg"
    bind:open
    hasScrollingContent
    modalHeading="Manage Routes"
    primaryButtonText="Save Routes"
    secondaryButtonText="Cancel"
    on:click:button--secondary={() => (open = false)}
    on:submit={() => saveRoutes()}
  >
    {#if !data.routes}
      <InlineNotification
        lowContrast
        hideCloseButton
        kind="warning"
        title="No depot:"
        subtitle="Please select depots in criteria"
        class="mx-auto"
      />
    {:else}
      {#each data.routes || [] as item, itemIndex}
        <div
          class="flex p-4 border-b border-gray-200 {item.from === item.to
            ? 'bg-brand-50'
            : ''}"
        >
          <div class="w-8 h-8 leading-8 text-center rounded bg-brand-600 text-white">
            {itemIndex + 1}
          </div>
          <div class="md:flex flex-1">
            <div class="flex-1 flex px-2 pb-4">
              <div class="py-2">
                {item.from}
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
                {item.to}
              </div>
            </div>
            <div class="flex">
              <div class="w-1/5 md:w-20 px-2">
                <Toggle
                  labelText="Active"
                  labelA=""
                  labelB=""
                  bind:toggled={item.active}
                />
              </div>
              <div class="w-2/5 md:w-40 px-2">
                <NumberInput label="Minimum Days" bind:value={item.days} />
              </div>
              <div class="w-2/5 md:w-40 px-2">
                <NumberInput label="One-way Fee" bind:value={item.fee} />
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </Modal>
{:else}
  <InlineNotification
    hideCloseButton
    lowContrast
    kind="warning"
    title="Not available: "
    subtitle="Will be enabled after added this record"
  />
{/if}
