<script>
  import { supabase } from "$lib/supabaseClient";
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  // import Form from "$lib/components/admin/Form.svelte";
  import Form from "$lib/components/admin/FormClient.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputHidden from "$lib/components/admin/InputHidden.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  // import { Checkbox } from "carbon-components-svelte";
  import { generateRates } from "./flex.js";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";

  export let data;
  // console.log(data);
  let loading = false;
  let show = false;
  let message = "";

  const updateFlex = async () => {
    loading = true;

    const { data: data_rates, error: error_rates } = await supabase
      .from("rates")
      .update(data.data)
      .eq("id", data.id)
      .select();

    let rates = await generateRates(data.id, data.data);
    // console.log(rates);
    const { error: error_delete } = await supabase.from("ratesCard").delete().eq("rates", data.id);
    const { error: error_insert } = await supabase.from("ratesCard").insert(rates.valid);

    message = "Updated successfully";
    show = true;

    loading = false;
  };
</script>

<Loading {loading} />
<Toast bind:show {message} />

<PageTitle title="Flex" path={data.path} data={data.data} id={data.id} />
<Form id={data.id} path={data.path} update={updateFlex}>
  <FormSection title="Info">
    <InputText name="name" label="Name" bind:value={data.data.name} required={true} />
    <InputSelect name="suppliers" label="Supplier" bind:value={data.data.suppliers} options={data.suppliers} />
    <InputDateRange
      nameFrom="date_start"
      nameTo="date_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.data.date_start}
      bind:valueTo={data.data.date_end}
    />

    <InputNumber name="rank" label="Rank" bind:value={data.data.rank} half={true} />
  </FormSection>
  <FormSection title="Driver">
    <InputSelect
      name="license"
      label="License"
      bind:value={data.data.license}
      options={[
        {
          id: "",
          name: "Any license",
        },
        ...data.licenses,
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
  <FormSection title="Matrix">
    <InputTextArea name="matrix" label="Matrix" bind:value={data.data.matrix} required={true} />
    <!-- <InputDateRange
      nameFrom="matrix_start"
      nameTo="matrix_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.data.matrix_start}
      bind:valueTo={data.data.matrix_end}
    /> -->
  </FormSection>
  <FormSection title="Second Matrix">
    <InputTextArea name="matrix2" label="Matrix" bind:value={data.data.matrix2} />
    <InputDateRange
      nameFrom="matrix2_start"
      nameTo="matrix2_end"
      labelFrom="Start Date for Second Matrix"
      labelTo="End Date for Second Matrix"
      bind:valueFrom={data.data.matrix2_start}
      bind:valueTo={data.data.matrix2_end}
    />
  </FormSection>
  <FormSection title="Rates">
    <InputTextArea name="data" label="Flex" bind:value={data.data.data} required={true} />
    <!-- <Checkbox name="zero" bind:checked={data.data.zero} labelText="Matrix start from zero" /> -->
    <InputToggle name="zero" label="Matrix start from zero" bind:value={data.data.zero} />
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
