<script lang="ts">
  import { createEventDispatcher, setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { cn } from "../../../utils";

  type TabsValue = string;

  let className = "";
  export { className as class };
  export let value: TabsValue = undefined;
  export let defaultValue: TabsValue = undefined;
  export let activateOnFocus = true;

  const dispatch = createEventDispatcher<{
    change: TabsValue;
  }>();

  const selectedTabValue: Writable<TabsValue> = writable(value ?? defaultValue);

  $: if (value !== undefined) {
    selectedTabValue.set(value);
  }

  setContext("tabs", {
    selectedTabValue,
    activateOnFocus,
    onSelectedTabValueChange: (value: TabsValue) => {
      selectedTabValue.set(value);
      dispatch("change", value);
    },
  });
</script>

<div class={cn("", className)} {...$$restProps}>
  <slot />
</div>