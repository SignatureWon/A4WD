<script>
  import { TextInput } from "carbon-components-svelte";

  export let reference;
</script>

<div class="p-3 bg-gray-100 flex items-center">
  <div class="w-32">Supplier Ref.</div>
  <div class="flex-1">
    <TextInput bind:value={reference} />
  </div>
</div>
