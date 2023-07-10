<script>
  import Results from "./Results.svelte";
  import Search from "./Search.svelte";
  import SearchForm from "./SearchForm.svelte";

  export let data;

  console.log(data);
</script>

{#if data.results.available.length || data.results.blocked.length}
  <Search options={data.options} search={data.search} />
{:else}
  <SearchForm options={data.options} search={data.search} />
{/if}
<Results results={data.results} search={data.search} />
