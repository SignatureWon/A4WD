<script>
  import { NumberInput, Toggle } from "carbon-components-svelte";

  export let depots = "";
  export let value = "";

  const name = "routes";
  const iconTo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" /></svg>`;

  let routes = [];
  if (!value) {
    value = [];
  }

  depots.forEach((pickup) => {
    depots.forEach((dropoff) => {
      routes.push({
        code: `${pickup.depots.code}-${dropoff.depots.code}`,
        from: pickup.depots,
        to: dropoff.depots,
        days: 0,
        fee: 0,
        active: true,
      });
    });
  });

  routes.forEach((route) => {
    value.forEach((exist) => {
      if (route.code === exist.code) {
        route.days = exist.days;
        route.fee = exist.fee;
        route.active = exist.active;
      }
    });
  });
  value = routes;
</script>

<div class="md:col-span-2">
  {#each value as item, itemIndex}
    <div
      class="flex p-4 border-b border-gray-200 {item.from === item.to
        ? 'bg-brand-50'
        : ''}"
    >
      <div
        class="w-8 h-8 leading-8 text-center rounded bg-brand-600 text-white"
      >
        {itemIndex + 1}
      </div>
      <div class="md:flex flex-1">
        <div class="flex-1 flex px-2 pb-4">
          <div class="py-2">
            {item.from.name}
          </div>
          <div class="text-gray-400 px-2 pt-3">
            {@html iconTo}
          </div>
          <div class="py-2">
            {item.to.name}
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
  <input {name} type="hidden" value={JSON.stringify(value)} />
</div>
