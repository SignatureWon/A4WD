<script>
  import Search from "../../../../(public)/search/Search.svelte";
  import Results from "../../../../(public)/search/Results.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { calculator } from "$lib/calculator";
  // import { onMount } from "svelte";
  import { page } from "$app/stores";

  /** @type {import('./$types').PageData} */
  export let data;

  let results = {
    available: [],
    blocked: [],
  };

  let loading = false;
  let params = $page.url.searchParams;

  const submit = async () => {
    loading = true;
    if (data.search.pickup !== "" && data.search.dropoff !== "") {
      results = await calculator.search(data.search);
    }

    // console.log("submitted", data.search);
    // console.log("results", results);
    loading = false;
  };

  // onMount(() => {
  //   submit();
  // });
  $: {
    params = $page.url.searchParams;
    submit();

    // console.log("params", params);
  }
</script>

<Loading {loading} />

<Search options={data.options} search={data.search} url="/admin/sales/search/redirect" />
<Results {results} search={data.search} url="/admin/sales/search/detail" />
