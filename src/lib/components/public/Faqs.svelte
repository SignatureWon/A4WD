<script>
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";

  export let records = [];
  export let title = {
    name: "",
    subtitle: "",
    description: "",
  };

  // console.log(records);
</script>

<div class="bg-white">
  <div class="lg:flex space-y-8 lg:justify-between lg:space-x-8 lg:space-y-0 container xl:max-w-7xl mx-auto px-4 py-16">
    <!-- Heading -->
    <div class="text-center lg:text-left">
      <div class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600">
        {title.name}
      </div>
      <h2 class="text-xl font-extrabold mb-4">
        {title.subtitle}
      </h2>
      {#if title.description}
        <p class="mb-4 leading-relaxed text-gray-600">
          {@html title.description}
        </p>
      {/if}
    </div>
    <!-- END Heading -->

    <!-- FAQ -->
    <div class="space-y-8 lg:w-3/5 lg:flex-none">
      <Accordion>
        {#each records as item}
          <AccordionItem title={item.name}>
            <div class="text-gray-500 p-5">{item.description}</div>
          </AccordionItem>
        {/each}
      </Accordion>
      <div class="py-4">
        <Button href="/faqs" class="inline-block">More FAQs</Button>
      </div>
    </div>
    <!-- END FAQ -->
  </div>
</div>
