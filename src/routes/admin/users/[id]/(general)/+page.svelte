<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  import { Select, SelectItem } from "carbon-components-svelte";
  export let data;
</script>

<PageTitle title="User" path={data.path} data={data.data} id={data.id} />
<!-- <Tabs tabs={PageTabs(data.type, data.id)} /> -->
<Form id={data.id} path={data.path}>
  <FormSection title="Personal">
    <InputSelect
      name="title"
      label="Title"
      bind:value={data.data.title}
      options={[
        { id: "Mr.", name: "Mr." },
        { id: "Ms.", name: "Ms." },
        { id: "Mrs.", name: "Mrs." },
        { id: "Miss", name: "Miss" },
        { id: "Dr.", name: "Dr." },
      ]}
      half={true}
    />
    <InputText
      name="first_name"
      label="First Name"
      bind:value={data.data.first_name}
      required={true}
    />
    <InputText
      name="last_name"
      label="Last Name"
      bind:value={data.data.last_name}
      required={true}
    />
  </FormSection>
  <FormSection title="Contacts">
    <InputText name="email" label="Email" bind:value={data.data.email} required={true} />
    <InputText name="phone" label="Phone" bind:value={data.data.phone} />
  </FormSection>
  <FormSection title="Address">
    <InputText
      name="address_1"
      label="Line 1"
      bind:value={data.data.address_1}
    />
    <InputText
      name="address_2"
      label="Line 2"
      bind:value={data.data.address_2}
    />
    <InputText
      name="postcode"
      label="Post code"
      bind:value={data.data.postcode}
      half={true}
    />
    <InputText
      name="city"
      label="City"
      bind:value={data.data.city}
      half={true}
    />
    <InputText
      name="state"
      label="State"
      bind:value={data.data.state}
      half={true}
    />
    <div>
      <Select labelText="Country" name="country" bind:selected={data.data.country} required={true}>
        <SelectItem value="" text="Select country" />
        {#each data.options.countries as country}
          <SelectItem value={country.name} text={country.name} />
        {/each}
      </Select>
    </div>
  </FormSection>
</Form>
