<script>
  import { Button, Select, SelectItem, TextInput } from "carbon-components-svelte";
  import dayjs from "dayjs";
  export let options;
  export let search;
  export let url = "/search2/redirect";

  // console.log("search", search);
  let innerWidth = 0;
  let show = false;
  const icon_search = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z" /><path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" /></svg>`;
  const icon_right = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" /></svg>`;
  const getName = (arr, id) => {
    const result = arr.filter((obj) => {
      return obj.id === id;
    });
    if (result.length) {
      return result[0].name;
    } else {
      return "—";
    }
  };
</script>

<svelte:window bind:innerWidth />
<section class="border-t border-b border-brand-500 bg-brand-100">
  {#if innerWidth < 768}
    <div class="flex items-center bg-brand-200 p-4 border-b border-brand-500">
      <div class="flex-1 text-right">
        <div class="value">{getName(options[0].options || [], search.pickup)}</div>
        <div>{dayjs(search.date_start).format("DD MMM YYYY")}</div>
      </div>
      <div class="px-4">{@html icon_right}</div>
      <div class="flex-1">
        <div class="value">{getName(options[0].options || [], search.dropoff)}</div>
        <div>{dayjs(search.date_end).format("DD MMM YYYY")}</div>
      </div>
      <div class="ml-4">
        <Button
          class="rounded-full"
          on:click={() => {
            show = !show;
          }}>{@html icon_search}</Button
        >
      </div>
    </div>
  {/if}
  {#if innerWidth > 768 || show === true}
    <form action={url} method="get">
      <div class="container xl:max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div>
            <div class="label text-brand-500">Pick-up</div>
            <Select name="pickup" bind:selected={search.pickup} class="mb-2">
              <SelectItem text="Pick-up from" value="" />
              {#each options[0].options || [] as item}
                <SelectItem text={item.name} value={item.id} />
              {/each}
            </Select>
            <TextInput
              name="date_start"
              type="date"
              bind:value={search.date_start}
              on:change={(e) => {
                if (dayjs(e.detail).isAfter(dayjs(search.date_end))) {
                  search.date_end = dayjs(e.detail).format("YYYY-MM-DD");
                }
              }}
            />
          </div>
          <div>
            <div class="label text-brand-500">Drop-off</div>
            <Select name="dropoff" bind:selected={search.dropoff} class="mb-2">
              <SelectItem text="Drop-off from" value="" />
              {#each options[0].options || [] as item}
                <SelectItem text={item.name} value={item.id} />
              {/each}
            </Select>
            <TextInput name="date_end" type="date" bind:value={search.date_end} />
          </div>
          <div>
            <div class="label text-brand-500">Driver</div>
            <Select name="license" bind:selected={search.license}>
              <SelectItem text="License" value="" />
              {#each options[3].options || [] as item}
                <SelectItem text={item.name} value={item.id} />
              {/each}
            </Select>
            <Select name="age" bind:selected={search.age}>
              <SelectItem text="Age" value="" />
              {#each options[2].options || [] as item}
                <SelectItem text={item.name} value={item.id} />
              {/each}
            </Select>
          </div>
          <div>
            <div class="label text-brand-500">Vehicle Type</div>
            <Select name="category" bind:selected={search.category}>
              <SelectItem text="Vehicle Type" value="" />
              {#each options[1].options || [] as item}
                <SelectItem text={item.name} value={item.id} />
              {/each}
            </Select>
          </div>
          <div>
            <div class="label text-brand-500">No. of Passengers</div>
            <TextInput name="pax" type="number" bind:value={search.pax} class="mt-2" />
          </div>
          <div>
            <Button type="submit" class="w-full flex justify-center items-center md:mt-6">
              {@html icon_search}
              <span class="ml-2">Search</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  {/if}
</section>
