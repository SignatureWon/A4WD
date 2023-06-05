<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
  import InputFile from "$lib/components/admin/InputFile.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputHidden from "$lib/components/admin/InputHidden.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputSeasonalTiers from "$lib/components/admin/InputSeasonalTiers.svelte";
  export let data;
</script>

<PageTitle title="Terms" path={data.path} data={data.data} id={data.id} />
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
    <InputDateRange
      nameFrom="booking_start"
      nameTo="booking_end"
      labelFrom="Booking Start"
      labelTo="Booking End"
      bind:valueFrom={data.data.booking_start}
      bind:valueTo={data.data.booking_end}
    />
    <InputDateRange
      nameFrom="travel_start"
      nameTo="travel_end"
      labelFrom="Travel Start"
      labelTo="Travel End"
      bind:valueFrom={data.data.travel_start}
      bind:valueTo={data.data.travel_end}
    />
  </FormSection>
  <FormSection title="Payment">
    <InputNumber
      name="deposit"
      label="Deposit ({data.data.percentage ? '%' : '$'})"
      bind:value={data.data.deposit}
      step={0.01}
      half={true}
    />
    <InputToggle
      name="percentage"
      label="Percentage"
      bind:value={data.data.percentage}
      half={true}
    />
    <InputText
      name="description"
      label="Description"
      bind:value={data.data.description}
    />
    <!-- <div class="h-2 border-b border-gray-200 col-span-2" /> -->
    <div class="bg-gray-100 p-4 md:col-span-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputToggle
          name="payment2"
          label="Second Payment"
          bind:value={data.data.payment2}
        />

        {#if data.data.payment2}
          <InputNumber
            name="deposit2"
            label="Amount ({data.data.percentage2 ? '%' : '$'})"
            bind:value={data.data.deposit2}
            step={0.01}
            half={true}
          />
          <InputToggle
            name="percentage2"
            label="Percentage"
            bind:value={data.data.percentage2}
            half={true}
          />
          <InputNumber
            name="balance2"
            label="Pay before (Days)"
            bind:value={data.data.balance2}
            half={true}
          />
          <InputNumber
            name="reminder2"
            label="Reminder (Days)"
            bind:value={data.data.reminder2}
            half={true}
          />
          <InputText
            name="description2"
            label="Description"
            bind:value={data.data.description2}
          />
          <div class="bg-gray-200 p-4 -mx-4 -mb-4 col-span-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputToggle
                name="payment3"
                label="Third Payment"
                bind:value={data.data.payment3}
              />

              {#if data.data.payment3}
                <InputNumber
                  name="deposit3"
                  label="Amount ({data.data.percentage3 ? '%' : '$'})"
                  bind:value={data.data.deposit3}
                  step={0.01}
                  half={true}
                />
                <InputToggle
                  name="percentage3"
                  label="Percentage"
                  bind:value={data.data.percentage3}
                  half={true}
                />
                <InputNumber
                  name="balance3"
                  label="Pay before (Days)"
                  bind:value={data.data.balance3}
                  half={true}
                />
                <InputNumber
                  name="reminder3"
                  label="Reminder (Days)"
                  bind:value={data.data.reminder3}
                  half={true}
                />
                <InputText
                  name="description3"
                  label="Description"
                  bind:value={data.data.description3}
                />
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
    <!-- <div class="h-2 border-b border-gray-200 col-span-2" /> -->
    <InputNumber
      name="balance"
      label="Balance Due (Days)"
      bind:value={data.data.balance}
      half={true}
    />
    <InputNumber
      name="reminder"
      label="Reminder (Days)"
      bind:value={data.data.reminder}
      half={true}
    />
    <InputText
      name="description4"
      label="Description"
      bind:value={data.data.description4}
    />
    <InputToggle
      name="pay_counter"
      label="Pay balance at counter"
      bind:value={data.data.pay_counter}
    />
  </FormSection>
  <FormSection title="Summary of Terms">
    <InputRichText
      name="summary_terms"
      label="Terms"
      bind:value={data.data.summary_terms}
    />
    <InputFile
      name="summary"
      label="Attachment"
      bind:value={data.data.summary}
      bucket="terms"
      fetch={{
        table: "terms",
        id: data.id,
      }}
    />
  </FormSection>
  <FormSection title="Agent's Terms and Conditions">
    <InputRichText
      name="confirmation_terms"
      label="Terms"
      bind:value={data.data.confirmation_terms}
    />
    <InputFile
      name="confirmation"
      label="Attachment"
      bind:value={data.data.confirmation}
      bucket="terms"
      fetch={{
        table: "terms",
        id: data.id,
      }}
    />
  </FormSection>
  <FormSection title="Counter Agreement">
    <InputRichText
      name="counter_terms"
      label="Terms"
      bind:value={data.data.counter_terms}
    />
    <InputFile
      name="counter"
      label="Attachment"
      bind:value={data.data.counter}
      bucket="terms"
      fetch={{
        table: "terms",
        id: data.id,
      }}
    />
  </FormSection>
  <!-- <FormSection title="Driver">
    <InputToggle
      name="calendar"
      label="Calendar Day"
      bind:value={data.data.calendar}
    />
    <InputSelect
      name="license"
      label="License"
      bind:value={data.data.license}
      options={data.licenses}
    />
    <InputSelect
      name="age"
      label="Age"
      bind:value={data.data.age}
      options={data.ages}
    />
  </FormSection>
  <FormSection title="Factors">
    <InputNumber
      name="nett"
      label="Nett Factor (Percentage)"
      bind:value={data.data.nett}
      step={0.01}
      half={true}
    />
    <InputNumber
      name="gross"
      label="Gross Factor (Percentage)"
      bind:value={data.data.gross}
      step={0.01}
      half={true}
    />
  </FormSection>
  <FormSection title="Tiered-rates">
    <InputSeasonalTiers
      bind:value={data.data.tiers}
    />
  </FormSection>
  <InputHidden name="type" value="seasonal" /> -->
</Form>
