<script>
  export let title;
</script>

<section class="bg-white mb-8">
  <div class="py-2 border-b border-gray-200">
    <h2 class="text-xl font-bold">{title}</h2>
  </div>
  <slot />
</section>
