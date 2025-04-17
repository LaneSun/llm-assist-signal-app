<script lang="ts">
  import { cn } from "../../../utils";

  let className = "";
  export { className as class };
</script>

<div
  class={cn("flex items-center p-6 pt-0", className)}
  {...$$restProps}
>
  <slot />
</div>