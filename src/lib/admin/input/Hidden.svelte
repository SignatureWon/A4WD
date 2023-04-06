<script>
  export let key = "";
  // export let field = {};
  export let data = {};
</script>

<input type="hidden" name={key} bind:value={data[key]} />
