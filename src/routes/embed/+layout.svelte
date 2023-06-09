<script>
  import { theme } from "$lib/theme.js";
  export let data;
  const c = theme.brandcolor(data.site.color);
</script>

<div
  style="--brand50: {c.brand50}; --brand100: {c.brand100}; --brand200: {c.brand200}; --brand300: {c.brand300}; --brand400: {c.brand400}; --brand-color: {c.brand500}; --brand600: {c.brand600}; --brand700: {c.brand700}; --brand-color-hover: {c.brand800}; --brand900: {c.brand900};"
>
  <slot />
</div>
