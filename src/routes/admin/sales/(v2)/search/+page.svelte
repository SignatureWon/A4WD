<script>
  import Search from '../../../../(public)/search/Search.svelte';
  import Results from '../../../../(public)/search/Results.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<Search options={data.options} search={data.search} url="/admin/sales/search/redirect" />
<Results results={data.results} search={data.search} url="/admin/sales/search/detail" />
