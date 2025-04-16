<script lang="ts">
  import { cn } from "../../../utils";

  let className = "";
  export { className as class };
</script>

<div
  class={cn("flex flex-col space-y-1.5 p-6", className)}
  {...$$restProps}
>
  <slot />
</div>