<script>
  import Results from "./Results.svelte";
  import Search from "./Search.svelte";
  import SearchForm from "./SearchForm.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { calculator } from "$lib/calculator";
  // import { onMount } from "svelte";
  import { page } from "$app/stores";

  export let data;

  let results = {
    available: [],
    blocked: [],
  };

  let loading = false;
  let params = $page.url.searchParams;

  const submit = async () => {
    loading = true;

    // console.log("search", data.search);
    if (data.search.pickup !== "" && data.search.dropoff !== "") {
      results = await calculator.search(data.search);
    }
    loading = false;
  };

  // onMount(() => {
  //   submit();
  // });

  // $: params = $page.url.searchParams;
  $: {
    params = $page.url.searchParams;
    submit();

    // console.log("params", params);
  }

  // $: submit();

  // console.log(data);
</script>

<Loading {loading} />

{#if results.available.length || results.blocked.length}
  <Search options={data.options} search={data.search} />
{:else}
  <SearchForm options={data.options} search={data.search} />
{/if}
<Results {results} search={data.search} />
