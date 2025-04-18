<script lang="ts">
  import { getContext } from "svelte";
  import { cn } from "../../../utils";
  import type { Writable } from "svelte/store";

  type TabsValue = string;

  let className = "";
  export { className as class };
  export let value: TabsValue;

  const { selectedTabValue } = getContext<{
    selectedTabValue: Writable<TabsValue>;
  }>("tabs");

  let selected: boolean;
  $: selected = $selectedTabValue === value;
</script>

<div
  role="tabpanel"
  id={`${value}-tab`}
  aria-labelledby={`${value}-trigger`}
  tabindex={0}
  class={cn(
    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    selected ? "flex" : "hidden",
    className
  )}
  {...$$restProps}
>
  <slot />
</div>