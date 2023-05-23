<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputHidden from "$lib/components/admin/InputHidden.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  export let data;
</script>

<PageTitle title="Flex" path={data.path} data={data.data} id={data.id} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText
      name="name"
      label="Name"
      bind:value={data.data.name}
      required={true}
    />
    <InputSelect
      name="suppliers"
      label="Supplier"
      bind:value={data.data.suppliers}
      options={data.suppliers}
    />
  </FormSection>
  <FormSection title="Driver">
    <InputSelect
      name="license"
      label="License"
      bind:value={data.data.license}
      options={[
        {
          id: "",
          name: "Any license"
        },
        ...data.licenses
      ]}
    />
  </FormSection>
  <FormSection title="Factors">
    <InputNumber
      name="nett"
      label="Nett Factor (Percentage)"
      bind:value={data.data.nett}
      step={0.01}
      half={true}
      required={true}
    />
    <InputNumber
      name="gross"
      label="Gross Factor (Percentage)"
      bind:value={data.data.gross}
      step={0.01}
      half={true}
      required={true}
    />
  </FormSection>
  <FormSection title="Rates">
    <InputTextArea
      name="matrix"
      label="Matrix"
      bind:value={data.data.matrix}
      required={true}
    />
    <InputTextArea
      name="data"
      label="Flex"
      bind:value={data.data.data}
      required={true}
    />
    <InputToggle
      name="zero"
      label="Matrix startd from zero"
      bind:value={data.data.zero}
    />
  </FormSection>
  {#if data.rates.invalid.length}
    <FormSection title="Invalid Rates">
      <div class="bg-gray-100 p-4 md:col-span-2">
        {#each data.rates.invalid as invalid}
          {#if "invalidDepot" in invalid}
            <div>
              Line {invalid.invalidDepot.row}: Invalid depot <b>"{invalid.invalidDepot.depot}"</b>
            </div>
          {/if}
          {#if "invalidVehicle" in invalid}
            <div>
              Line {invalid.invalidVehicle.row}: Invalid vehicle <b>"{invalid.invalidVehicle.vehicle}"</b>
            </div>
          {/if}
        {/each}
      </div>
    </FormSection>
  {/if}

  <InputHidden name="type" value="flex" />
</Form>
