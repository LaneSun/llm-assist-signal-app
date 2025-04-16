<script>
  import { channels, processChannel } from '../lib/stores.js';
  import * as processors from '../lib/SignalProcessors.js';
  import { Button } from '../lib/components/ui/button';

  // Available processing methods
  const processingMethods = [
    { id: 'movingAverage', name: 'Moving Average', processor: processors.movingAverage, params: ['windowSize'] },
    { id: 'lowPass', name: 'Low-Pass Filter', processor: processors.lowPassFilter, params: ['cutoffFrequency', 'sampleRate'] },
    { id: 'highPass', name: 'High-Pass Filter', processor: processors.highPassFilter, params: ['cutoffFrequency', 'sampleRate'] },
    { id: 'fft', name: 'FFT', processor: processors.calculateFFT, params: [] },
    { id: 'powerSpectrum', name: 'Power Spectrum', processor: processors.calculatePowerSpectrum, params: ['sampleRate'] },
    { id: 'differentiate', name: 'Differentiate', processor: processors.differentiate, params: ['sampleRate'] },
    { id: 'integrate', name: 'Integrate', processor: processors.integrate, params: ['sampleRate'] }
  ];

  // Form values
  let selectedMethod = processingMethods[0];
  let selectedChannelId = '';
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

<div class="space-y-4 py-4">
  <form on:submit|preventDefault={processSignal} class="space-y-4">
    <div class="grid gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="sourceChannel" class="text-sm font-medium">Source Channel</label>
          <select 
            id="sourceChannel" 
            bind:value={selectedChannelId} 
            required
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          >
            <option value="">Select a channel</option>
            {#each $channels as channel}
              <option value={channel.id}>{channel.name}</option>
            {/each}
          </select>
        </div>
        
        <div class="space-y-2">
          <label for="processingMethod" class="text-sm font-medium">Processing Method</label>
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
      
      <div class="space-y-2">
        <label for="newChannelName" class="text-sm font-medium">New Channel Name</label>
        <input 
          id="newChannelName" 
          type="text" 
          bind:value={newChannelName} 
          required 
          class="w-full px-3 py-2 border rounded-md border-input bg-background"
        />
      </div>
      
      {#if selectedMethod && selectedMethod.params.includes('windowSize')}
        <div class="space-y-2">
          <label for="windowSize" class="text-sm font-medium">Window Size</label>
          <input 
            id="windowSize" 
            type="number" 
            bind:value={windowSize} 
            min="1" 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
      {/if}
      
      {#if selectedMethod && selectedMethod.params.includes('cutoffFrequency')}
        <div class="space-y-2">
          <label for="cutoffFrequency" class="text-sm font-medium">Cutoff Frequency (Hz)</label>
          <input 
            id="cutoffFrequency" 
            type="number" 
            bind:value={cutoffFrequency} 
            min="0.1" 
            step="0.1" 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
      {/if}
    </div>
    
    <Button type="submit" disabled={!selectedChannelId} class="w-full">Process Signal</Button>
  </form>
</div>