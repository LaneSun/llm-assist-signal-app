<script lang="ts">
  import { cva, type VariantProps } from "class-variance-authority";
  import { cn } from "../../../utils";
  import { buttonVariants } from ".";

  let className = "";
  export { className as class };
  export let variant: VariantProps<typeof buttonVariants>["variant"] = "default";
  export let size: VariantProps<typeof buttonVariants>["size"] = "default";
  export let disabled = false;
  export let type: "button" | "submit" | "reset" = "button";
</script>

<button
  {type}
  class={cn(buttonVariants({ variant, size, className }))}
  {disabled}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</button>