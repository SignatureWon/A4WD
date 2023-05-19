<script>
  import SearchForm from "$lib/components/admin/SearchForm.svelte";
  import SearchResults from "$lib/components/admin/SearchResults.svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";

  export let data;
</script>

<SearchForm />

<Tabs>
  <Tab label="Rates" />
  <Tab label="Blocked" />
  <svelte:fragment slot="content">
    <TabContent>
      <SearchResults rows={data.results} search={data.search} headers={[
        { key: "vehicle_name", value: "Vehicle" },
        { key: "license_name", value: "License" },
        { key: "gross", value: "Gross" },
        { key: "nett", value: "Nett" },
      ]} />
    </TabContent>
    <TabContent>
      <SearchResults rows={data.blocked} search={data.search} headers={[
        { key: "vehicle_name", value: "Vehicle" },
        { key: "license_name", value: "License" },
        { key: "block_items", value: "Reason" },
      ]} disabled={true} />
    </TabContent>
  </svelte:fragment>
</Tabs>
