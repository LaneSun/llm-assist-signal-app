<script lang="ts">
  import { cn } from "../../../utils";

  let className = "";
  export { className as class };
  export let tag = "h3";
</script>

<svelte:element
  this={tag}
  class={cn(
    "text-2xl font-semibold leading-none tracking-tight",
    className
  )}
  {...$$restProps}
>
  <slot />
</svelte:element>