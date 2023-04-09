<script>
  import { Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";

  export let record = {};
  export let parent = {};
</script>

<div>
  <a href="/" class="text-gray-400 hover:text-gray-600">Home</a>
  <span class="px-1 text-gray-200">/</span>
  <a href={parent.url} class="text-gray-400 hover:text-gray-600">{parent.name}</a>
</div>

<h1 class="text-2xl font-bold text-brand-500 mb-4">{record.name}</h1>
