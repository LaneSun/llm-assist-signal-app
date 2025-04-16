<script lang="ts">
  import { cn } from "../../../utils";

  let className = "";
  export { className as class };
</script>

<p
  class={cn("text-sm text-muted-foreground", className)}
  {...$$restProps}
>
  <slot />
</p>