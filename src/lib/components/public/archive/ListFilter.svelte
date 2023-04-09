<script>
  import { Search, Select, SelectItem } from "carbon-components-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let filters = [
    {
      key: "wheel",
      label: "Type",
      options: [
        {
          key: "4WD",
          label: "4WD",
        },
        {
          key: "2WD",
          label: "2WD",
        },
      ],
    },
  ];

  let url = $page.url;
  let searchParams = {};

  $: {
    searchParams = {};
    url.searchParams.forEach((val, key) => {
      searchParams[key] = val;
    });
  }
</script>

<div class="bg-white">
  <div class="container xl:max-w-7xl mx-auto py-2 px-4 md:px-0">
    <div class="sm:flex">
      <div class="sm:w-1/2 md:w-2/3">
        <div class="md:flex">
          {#each filters as filter}
            <div class="md:w-1/2 p-2">
              <Select
                labelText={filter.label}
                selected={searchParams[filter.key] || ""}
                on:change={(e) => {
                  searchParams["page"] = "";
                  searchParams[filter.key] = e.target.value;
                  let params = [];
                  for (const key in searchParams) {
                    if (searchParams[key] !== "") {
                      params.push(`${key}=${searchParams[key]}`);
                    }
                  }
                  goto(`${url.pathname}?${params.join("&")}`);
                }}
              >
                <SelectItem value="" text="All" />
                {#each filter.options as opt}
                  <SelectItem value={opt.key} text={opt.name} />
                {/each}
              </Select>
            </div>
          {/each}
        </div>
      </div>
      <div class="sm:w-1/2 md:w-1/3 p-2 sm:mt-4">
        <Search
          value={searchParams["search"] || ""}
          on:clear={(e) => {          
            searchParams["page"] = "";
            searchParams["search"] = "";
            let params = [];
            for (const key in searchParams) {
              if (searchParams[key] !== "") {
                params.push(`${key}=${searchParams[key]}`);
              }
            }
            goto(`${url.pathname}?${params.join("&")}`);
          }}
          on:change={(e) => {
            searchParams["page"] = "";
            searchParams["search"] = e.target.value;
            let params = [];
            for (const key in searchParams) {
              if (searchParams[key] !== "") {
                params.push(`${key}=${searchParams[key]}`);
              }
            }
            goto(`${url.pathname}?${params.join("&")}`);
          }}
        />
      </div>
    </div>
  </div>
</div>
