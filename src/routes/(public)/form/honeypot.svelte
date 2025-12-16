<script>
  import { TextInput } from "carbon-components-svelte";
</script>

<div class="website_url">
  <TextInput labelText="Website" name="website" />
</div>

<style>
  .website_url {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    z-index: -1;
  }
</style>
