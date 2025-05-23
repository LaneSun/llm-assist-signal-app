<script>
  import { channels, processChannel } from '$lib/stores.js';
  import * as processors from '$lib/signal_processors.js';
  import { Button } from '$lib/components/ui/button';
    import Input from '$lib/components/ui/input/input.svelte';

  // Available processing methods
  const processingMethods = [
    { id: 'movingAverage', name: '移动平均', processor: processors.movingAverage, params: ['windowSize'] },
    { id: 'lowPass', name: '低通滤波器', processor: processors.lowPassFilter, params: ['cutoffFrequency', 'sampleRate'] },
    { id: 'highPass', name: '高通滤波器', processor: processors.highPassFilter, params: ['cutoffFrequency', 'sampleRate'] },
    { id: 'fft', name: 'FFT', processor: processors.calculateFFT, params: [] },
    { id: 'powerSpectrum', name: '功率谱', processor: processors.calculatePowerSpectrum, params: ['sampleRate'] },
    { id: 'differentiate', name: '微分', processor: processors.differentiate, params: ['sampleRate'] },
    { id: 'integrate', name: '积分', processor: processors.integrate, params: ['sampleRate'] }
  ];

  // Form values
  let selectedMethod = processingMethods[0];
  export let selectedChannelId = '';
  let newChannelName = '';
  let windowSize = 10;
  let cutoffFrequency = 100;

  // Process the selected channel
  function processSignal() {
    if (!selectedChannelId || !newChannelName) {
      return;
    }

    const sourceChannel = $channels.find(ch => ch.id === selectedChannelId);
    if (!sourceChannel) {
      return;
    }

    // Set default new channel name if not provided
    if (!newChannelName) {
      newChannelName = `${sourceChannel.name} (${selectedMethod.name})`;
    }

    // Prepare processor parameters
    const processorParams = {};
    
    if (selectedMethod.params.includes('windowSize')) {
      processorParams.windowSize = windowSize;
    }
    
    if (selectedMethod.params.includes('cutoffFrequency')) {
      processorParams.cutoffFrequency = cutoffFrequency;
    }
    
    if (selectedMethod.params.includes('sampleRate')) {
      processorParams.sampleRate = sourceChannel.sampleRate;
    }

    // Process the channel
    const newChannel = processChannel(
      selectedChannelId,
      selectedMethod.processor,
      newChannelName,
      processorParams
    );

    // Reset form
    newChannelName = '';
  }

  // Update new channel name when source channel or method changes
  $: {
    if (selectedChannelId && selectedMethod) {
      const sourceChannel = $channels.find(ch => ch.id === selectedChannelId);
      if (sourceChannel) {
        newChannelName = `${sourceChannel.name} (${selectedMethod.name})`;
      }
    }
  }
</script>

<div class="box gap-4">
  <form onsubmit={(e) => { e.preventDefault(); processSignal(); }} class="box space-y-4">
    <div class="grid gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="box gap-2">
          <label for="sourceChannel" class="text-sm font-medium">源通道</label>
          <select 
            id="sourceChannel" 
            bind:value={selectedChannelId} 
            required
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          >
            <option value="">选择一个通道</option>
            {#each $channels as channel}
              <option value={channel.id}>{channel.name}</option>
            {/each}
          </select>
        </div>
        
        <div class="box gap-2">
          <label for="processingMethod" class="text-sm font-medium">处理方法</label>
          <select 
            id="processingMethod" 
            bind:value={selectedMethod}
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          >
            {#each processingMethods as method}
              <option value={method}>{method.name}</option>
            {/each}
          </select>
        </div>
      </div>
      
      <div class="box gap-2">
        <label for="newChannelName" class="text-sm font-medium">新通道名称</label>
        <Input
          id="newChannelName" 
          type="text" 
          bind:value={newChannelName} 
          required 
        />
      </div>
      
      {#if selectedMethod && selectedMethod.params.includes('windowSize')}
        <div class="box gap-2">
          <label for="windowSize" class="text-sm font-medium">窗口大小</label>
          <Input 
            id="windowSize" 
            type="number" 
            bind:value={windowSize} 
            min="1" 
            required
          />
        </div>
      {/if}
      
      {#if selectedMethod && selectedMethod.params.includes('cutoffFrequency')}
        <div class="box gap-2">
          <label for="cutoffFrequency" class="text-sm font-medium">截止频率 (Hz)</label>
          <Input 
            id="cutoffFrequency" 
            type="number" 
            bind:value={cutoffFrequency} 
            min="0.1" 
            step="0.1" 
            required
          />
        </div>
      {/if}
    </div>
    
    <Button type="submit" disabled={!selectedChannelId} class="w-full">处理信号</Button>
  </form>
</div>