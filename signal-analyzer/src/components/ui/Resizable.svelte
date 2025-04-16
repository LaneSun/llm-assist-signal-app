<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  // Props
  export let initialLeftWidth = 60; // Initial left panel width in percentage
  export let minLeftWidth = 20; // Minimum left panel width in percentage
  export let maxLeftWidth = 80; // Maximum left panel width in percentage
  
  // Internal state
  let container;
  let resizer;
  let leftPanel;
  let rightPanel;
  let isResizing = false;
  let leftWidthPercent = initialLeftWidth;
  
  const dispatch = createEventDispatcher();
  
  // Handle mouse down on the resizer
  function startResize(e) {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    // Prevent text selection during resize
    e.preventDefault();
  }
  
  // Handle mouse move to resize
  function doResize(e) {
    if (!isResizing) return;
    
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate new width as percentage
    let newLeftWidthPercent = (mouseX / containerWidth) * 100;
    
    // Apply constraints
    newLeftWidthPercent = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidthPercent));
    
    // Update width
    leftWidthPercent = newLeftWidthPercent;
    
    // Dispatch resize event
    dispatch('resize', { leftWidthPercent });
  }
  
  // Handle mouse up to stop resizing
  function stopResize() {
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
  
  // Handle keyboard resizing
  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      leftWidthPercent = Math.max(minLeftWidth, leftWidthPercent - 1);
      dispatch('resize', { leftWidthPercent });
    } else if (e.key === 'ArrowRight') {
      leftWidthPercent = Math.min(maxLeftWidth, leftWidthPercent + 1);
      dispatch('resize', { leftWidthPercent });
    }
  }
  
  onMount(() => {
    // Add global event listeners
    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
    
    // Clean up event listeners on component destroy
    return () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    };
  });
</script>

<div 
  class="resizable-container" 
  bind:this={container}
  style="--left-width: {leftWidthPercent}%;"
>
  <div class="left-panel" bind:this={leftPanel}>
    <slot name="left"></slot>
  </div>
  
  <div 
    class="resizer" 
    bind:this={resizer}
    on:mousedown={startResize}
    on:touchstart|preventDefault={startResize}
    role="presentation"
  >
    <div class="resizer-handle"></div>
  </div>
  
  <div class="right-panel" bind:this={rightPanel}>
    <slot name="right"></slot>
  </div>
</div>

<style>
  .resizable-container {
    display: flex;
    flex: 1 1;
    overflow: hidden;
    min-height: 0;
  }
  
  .left-panel {
    width: var(--left-width);
    overflow: hidden;
    flex-shrink: 0;
    min-height: 0;
  }
  
  .right-panel {
    flex-grow: 1;
    overflow: hidden;
    min-height: 0;
  }
  
  .resizer {
    width: 6px;
    background-color: hsl(var(--border));
    cursor: col-resize;
    flex-shrink: 0;
    transition: background-color 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .resizer:hover, .resizer:active, .resizer:focus-visible {
    background-color: hsl(var(--primary));
    outline: none;
  }
  
  .resizer-handle {
    width: 2px;
    height: 20px;
    background-color: hsl(var(--muted-foreground));
    border-radius: 1px;
  }
</style>