<script>
  import { Button, MultiSelect, NumberInput } from "carbon-components-svelte";

  export let depots = [];
  export let vehicles = [];
  export let value = [];
  export let nett = 1;
  export let gross = 1;

  const name = "fees";
  const schema = {
    depots: [],
    vehicles: [],
    tiers: [
      {
        from: 0,
        to: 0,
        rate: 0,
      },
    ],
  };
  const schemaTiers = {
    from: 0,
    to: 0,
    rate: 0,
  };

  const icon = {
    up: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z" /></svg>`,
    down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z" /></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" /></svg>`,
  };

  const toMultiSelectItem = (arr) => {
    let resp = [];
    arr.forEach((obj) => {
      resp.push({
        id: obj.id,
        text: obj.name,
      });
    });
    return resp;
  };

  const addRecords = () => {
    if (!value) {
      value = [];
    }
    value = [...value, { ...schema }];
  };
  const move = (arr, from, to) => {
    let newArr = arr;
    let el = newArr.splice(from, 1)[0];
    newArr.splice(to, 0, el);
    return newArr;
  };
  const remove = (arr, index) => {
    let newArr = arr;
    newArr.splice(index, 1);
    return newArr;
  };
</script>

<div class="md:col-span-2">
  <h2 class="text-lg font-medium mb-5">Rates</h2>
  {#if (value || []).length === 0}
    <div class="p-4 text-center bg-gray-100 mb-4">
      <div>No records yet</div>
    </div>
  {:else}
    {#each value as row, rowIndex}
      <div class="flex pb-4 mb-4 border-b border-gray-200">
        <div class="pr-4">
          <div
            class="w-8 h-8 leading-8 text-center rounded bg-brand-600 text-white"
          >
            {rowIndex + 1}
          </div>
        </div>
        <div class="flex-1">
          <div class="md:flex">
            <div class="md:flex-1">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <MultiSelect
                    filterable
                    titleText="Depots"
                    bind:selectedIds={row.depots}
                    placeholder={`Select Depots`}
                    items={toMultiSelectItem(depots)}
                  />
                </div>
                <div>
                  <MultiSelect
                    filterable
                    titleText="Vehicles"
                    bind:selectedIds={row.vehicles}
                    placeholder={`Select Vehicles`}
                    items={toMultiSelectItem(vehicles)}
                  />
                </div>
              </div>
              <div class="bg-gray-100 p-4">
                {#each row.tiers || [] as tier, tierIndex}
                  <div class="md:flex mb-4">
                    <div class="md:flex-1">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <NumberInput
                          label="From (days)"
                          bind:value={tier.from}
                        />
                        <NumberInput label="To (days)" bind:value={tier.to} />
                        <NumberInput
                          label="Daily Rate"
                          bind:value={tier.rate}
                          step={0.01}
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-200 p-2 mt-2 text-sm"
                      >
                        <div>
                          Nett rate: ${(tier.rate * nett).toFixed(2)}
                        </div>
                        <div>
                          Gross rate: ${(tier.rate * gross).toFixed(2)}
                        </div>
                        <div>
                          Earnings: ${Math.abs(
                            tier.rate * nett - tier.rate * gross
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-end">
                      <div class="flex">
                        <Button
                          kind="ghost"
                          iconDescription="Move up"
                          disabled={tierIndex === 0 ? true : false}
                          on:click={() => {
                            row.tiers = [
                              ...move(row.tiers, tierIndex, tierIndex - 1),
                            ];
                          }}
                          class="md:px-2"
                        >
                          {@html icon.up}
                        </Button>
                        <Button
                          kind="ghost"
                          iconDescription="Move down"
                          disabled={tierIndex === row.tiers.length - 1
                            ? true
                            : false}
                          on:click={() => {
                            row.tiers = [
                              ...move(row.tiers, tierIndex, tierIndex + 1),
                            ];
                          }}
                          class="md:px-2"
                        >
                          {@html icon.down}
                        </Button>
                        <Button
                          kind="ghost"
                          iconDescription="Delete"
                          on:click={() => {
                            row.tiers = [...remove(row.tiers, tierIndex)];
                          }}
                          class="md:px-2"
                        >
                          {@html icon.delete}
                        </Button>
                      </div>
                    </div>
                  </div>
                {/each}
                <div class="text-center">
                  <Button
                    kind="tertiary"
                    class="text-sm h-8 leading-8 py-0"
                    on:click={() =>
                      (row.tiers = [...row.tiers, { ...schemaTiers }])}
                  >
                    Add tier
                  </Button>
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <div class="flex">
                <Button
                  kind="ghost"
                  iconDescription="Move up"
                  disabled={rowIndex === 0 ? true : false}
                  on:click={() => {
                    value = [...move(value, rowIndex, rowIndex - 1)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.up}
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Move down"
                  disabled={rowIndex === value.length - 1 ? true : false}
                  on:click={() => {
                    value = [...move(value, rowIndex, rowIndex + 1)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.down}
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Delete"
                  on:click={() => {
                    value = [...remove(value, rowIndex)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.delete}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
  <div class="text-center">
    <Button
      kind="tertiary"
      class="text-sm h-8 leading-8 py-0"
      on:click={() => addRecords()}>Add record</Button
    >
  </div>
  <input {name} type="hidden" value={JSON.stringify(value)} />
</div>
