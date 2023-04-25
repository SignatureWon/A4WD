<script>
  import {
    Button,
    Modal,
    MultiSelect,
    NumberInput,
  } from "carbon-components-svelte";
  export let depots = [];
  export let vehicles = [];
  export let tiers = [];
  export let value = [];

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

  if (!value) {
    value = [];
  } else {
    value.forEach((season) => {
      let newTiers = [];
      tiers.forEach((tier, index) => {
        newTiers.push({
          from: tier.from,
          to: tier.to,
          fee: season.tiers.length > index ? season.tiers[index].fee : 0,
        });
      });
      season.tiers = newTiers;
    });
  }

  let jsonTiers = JSON.stringify(value);

  const addRecords = () => {
    let tiersSchema = [];
    tiers.forEach((tier) => {
      let obj = {};
      for (const key in tier) {
        obj[key] = tier[key];
      }
      obj.fee = 0;

      tiersSchema.push(obj);
    });

    if (!value) {
      value = [];
    }
    value = [
      ...value,
      {
        depots: [],
        vehicles: [],
        daily: null,
        tiers: tiersSchema,
      },
    ];
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

  let open = false;
</script>

<div>
  <Button
    on:click={() => {
      open = true;
    }}>Manage Rates</Button
  >
  <input name="tiers" type="hidden" bind:value={jsonTiers} />
</div>
<Modal
  size="lg"
  bind:open
  hasScrollingContent
  primaryButtonText="Done"
  on:click:button--primary={() => {
    jsonTiers = JSON.stringify(value);
    open = false;
  }}
  secondaryButtonText="Add Rate"
  on:click:button--secondary={() => addRecords()}
  modalHeading="Manage Rates"
>
  {#if !value}
    <div class="p-4 text-center bg-gray-100 mb-4">
      <div>No rates yet</div>
    </div>
  {:else}
    <div class="min-h-[400px]">
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
                <div class="grid grid-cols-2 gap-2">
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
                <div class="grid grid-cols-3 gap-2 mt-4">
                  <div>
                    <NumberInput
                      label="Nett Daily Rate"
                      bind:value={row.daily}
                    />
                  </div>
                  {#each row.tiers as tier}
                    <div>
                      <NumberInput
                        label={`${tier.from} ${
                          tier.to === 9999 ? "+" : `- ${tier.to} days`
                        }`}
                        bind:value={tier.fee}
                      />
                    </div>
                  {/each}
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
    </div>
  {/if}
</Modal>
