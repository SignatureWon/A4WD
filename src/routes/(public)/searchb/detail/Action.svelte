<script>
  import {
    Button,
    Modal,
    NumberInput,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  export let licenses = [];
  export let quote = {};

  let open = false;
</script>

<section class="text-center mb-8">
  <Button type="submit" class="px-10" on:click={() => (open = true)}
    >Book Now</Button
  >
</section>

<Modal
  bind:open
  modalHeading="Travel Information"
  passiveModal
  on:click:button--secondary={() => (open = false)}
>
  <div class="max-w-md mx-auto mt-10 mb-5">
    <form action="/search/book" method="post">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-2">
          <TextInput
            labelText="Email"
            type="email"
            name="email"
            value=""
            required
          />
        </div>
        <div>
          <Select
            name="license"
            labelText="Driver's License"
            value={quote.license.id}
          >
            {#each licenses as license}
              <SelectItem value={license.name} />
            {/each}
          </Select>
        </div>
        <div>
          <NumberInput name="age" label="Driver's Age" allowEmpty required />
        </div>
        <div>
          <NumberInput name="adult" label="No. of Adult" allowEmpty required />
        </div>
        <div>
          <NumberInput
            name="children"
            label="No. of Children"
            allowEmpty
            required
          />
        </div>
        <div class="col-span-2">
          <Button type="submit" class="w-full">Proceed</Button>
          <Button
            kind="ghost"
            type="button"
            class="w-full"
            on:click={() => (open = false)}>Cancel</Button
          >
        </div>
      </div>
      <input type="hidden" name="detail" value={JSON.stringify(quote)} />
    </form>
  </div>
</Modal>
