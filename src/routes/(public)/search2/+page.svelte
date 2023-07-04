<script>
  import Results from "./Results.svelte";
  import Search from "./Search.svelte";

  export let data;

  console.log(data);
</script>

<Search options={data.options} search={data.search} />
<Results results={data.results} search={data.search} />
