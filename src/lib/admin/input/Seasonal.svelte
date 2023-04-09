<script>
  import {
    Button,
    SelectItem,
    Select,
    TextInput,
    NumberInput,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { db } from "$lib/db";

  export let key = "";
  export let field = {};
  export let data = {
    fees: []
  };

  const feeStructure = {
    Europcar: [
      {
        from: 0,
        to: 1,
        fee: 0,
      },
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

  let suppliers = {
    depots: []
  };
  let vehicles = [];
  let schema = {
    depot: null,
    vehicle: null,
    fees: [
      {
        from: 0,
        to: 1,
        fee: 0,
      },
    ],
  };

  onMount(async () => {
    suppliers = await db.one({
      from: "suppliers",
      select: "name, depots",
      id: field.related,
    });

    vehicles = await db.all({
      from: "vehicles",
      select: "id, name",
      eq: [{ name: "suppliers", value: field.related }],
    });

    if (suppliers.name in feeStructure) {
      schema.fees = feeStructure[suppliers.name];
    }
  });

  const addRecords = () => {
    data[key] = [...data[key], schema];
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

<div class="bg-white">
  {#if data[key].length === 0}
    <div class="px-4 py-20 text-center">
      <div class="pb-4">No records yet</div>
    </div>
  {:else}
    {#each data[key] as row, rowIndex}
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
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Select
                    labelText="Depot"
                    name="depot{rowIndex}"
                    bind:selected={row.depot}
                    required={true}
                  >
                    <SelectItem value="" text="Select depot" />
                    {#each suppliers.depots as option}
                      <SelectItem
                        value={option.Depots.id}
                        text={option.Depots.label}
                      />
                    {/each}
                  </Select>
                </div>
                <div>
                  <Select
                    labelText="Vehicle"
                    name="vehicle{rowIndex}"
                    bind:selected={row.vehicle}
                    required={true}
                  >
                    <SelectItem value="" text="Select vehicle" />
                    {#each vehicles as option}
                      <SelectItem value={option.id} text={option.name} />
                    {/each}
                  </Select>
                </div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each row.fees as fee}
                  <div>
                    <NumberInput
                      label={fee.from === 0
                        ? "Daily fee"
                        : `${fee.from} ${
                            fee.to === 9999 ? "+" : `- ${fee.to} days`
                          }`}
                      name="fees{rowIndex}"
                      bind:value={fee.fee}
                      step={0.1}
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
                    data[key] = [...move(data[key], rowIndex, rowIndex - 1)];
                  }}
                  class="md:px-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    class="h-4 w-4"
                    fill="currentColor"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"
                    /></svg
                  >
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Move down"
                  disabled={rowIndex === data[key].length - 1 ? true : false}
                  on:click={() => {
                    data[key] = [...move(data[key], rowIndex, rowIndex + 1)];
                  }}
                  class="md:px-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    class="h-4 w-4"
                    fill="currentColor"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z"
                    /></svg
                  >
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Delete"
                  on:click={() => {
                    data[key] = [...remove(data[key], rowIndex)];
                  }}
                  class="md:px-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    class="h-4 w-4"
                    fill="currentColor"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
                    /></svg
                  >
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
  <div class="text-center">
    <Button kind="tertiary" on:click={() => addRecords()}>Add record</Button>
  </div>
</div>
