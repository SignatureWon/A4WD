<script>
  import { Tab, Tabs } from "carbon-components-svelte";
  export let tabs = [];
  export let selected = 0;
</script>

<div class="overflow-y-auto">
  <div class="flex border-b-2 border-gray-200">
    {#each tabs as tab, index}
      <a
        href={tab.link}
        class="block py-2 px-6 -mb-0.5 border-b-2 {selected === index
          ? 'border-brand-500 font-bold'
          : 'hover:border-gray-500'}"
      >
        {tab.name}
      </a>
    {/each}
  </div>
</div>
