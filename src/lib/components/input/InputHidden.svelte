<script>
  export let field = {};
  export let record = {};
</script>

<input type="hidden" name={field.name} bind:value={record[field.name]} />
