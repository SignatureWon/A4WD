<script>
  export let title = {
    type: "",
    name: "",
    subtitle: "",
    description: "",
  };
</script>

{#if title.name || title.subtitle || title.description}
  <section class="pt-5 pb-10 bg-white">
    <div class="container xl:max-w-7xl mx-auto p-5">
      {#if title.name}
        <div class="text-sm font-bold tracking-wider text-brand-600">
          {title.name}
        </div>
      {/if}
      {#if title.subtitle}
        <h2 class="text-xl font-extrabold mb-2">{title.subtitle}</h2>
      {/if}
      {#if title.description}
        <p class="mb-4 leading-relaxed text-gray-600">
          {@html title.description}
        </p>
      {/if}
    </div>
  </section>
{/if}
