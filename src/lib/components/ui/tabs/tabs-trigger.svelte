<script lang="ts">
  import { getContext } from "svelte";
  import { cn } from "../../../utils";
  import type { Writable } from "svelte/store";

  type TabsValue = string;

  let className = "";
  export { className as class };
  export let value: TabsValue;
  export let disabled = false;

  const { selectedTabValue, activateOnFocus, onSelectedTabValueChange } =
    getContext<{
      selectedTabValue: Writable<TabsValue>;
      activateOnFocus: boolean;
      onSelectedTabValueChange: (value: TabsValue) => void;
    }>("tabs");

  let selected: boolean;
  $: selected = $selectedTabValue === value;

  function handleClick() {
    if (!disabled) {
      onSelectedTabValueChange(value);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      handleClick();
    }
  }

  function handleFocus() {
    if (activateOnFocus && !disabled) {
      onSelectedTabValueChange(value);
    }
  }
</script>

<button
  type="button"
  role="tab"
  aria-selected={selected}
  aria-controls={`${value}-tab`}
  data-state={selected ? "active" : "inactive"}
  disabled={disabled}
  tabindex={selected ? 0 : -1}
  class={cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    selected
      ? "bg-background text-foreground shadow-sm"
      : "text-muted-foreground hover:text-current",
    className
  )}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  on:focus={handleFocus}
  {...$$restProps}
>
  <slot />
</button>