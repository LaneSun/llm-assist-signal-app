<script>
  import { channels, processChannel } from '../lib/stores.js';
  import * as processors from '../lib/SignalProcessors.js';

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

<div class="signal-processor">
  <h2>Signal Processor</h2>
  
  <form on:submit|preventDefault={processSignal}>
    <div class="form-group">
      <label for="sourceChannel">Source Channel</label>
      <select id="sourceChannel" bind:value={selectedChannelId} required>
        <option value="">Select a channel</option>
        {#each $channels as channel}
          <option value={channel.id}>{channel.name}</option>
        {/each}
      </select>
    </div>
    
    <div class="form-group">
      <label for="processingMethod">Processing Method</label>
      <select id="processingMethod" bind:value={selectedMethod}>
        {#each processingMethods as method}
          <option value={method}>{method.name}</option>
        {/each}
      </select>
    </div>
    
    <div class="form-group">
      <label for="newChannelName">New Channel Name</label>
      <input id="newChannelName" type="text" bind:value={newChannelName} required />
    </div>
    
    {#if selectedMethod && selectedMethod.params.includes('windowSize')}
      <div class="form-group">
        <label for="windowSize">Window Size</label>
        <input id="windowSize" type="number" bind:value={windowSize} min="1" required />
      </div>
    {/if}
    
    {#if selectedMethod && selectedMethod.params.includes('cutoffFrequency')}
      <div class="form-group">
        <label for="cutoffFrequency">Cutoff Frequency (Hz)</label>
        <input id="cutoffFrequency" type="number" bind:value={cutoffFrequency} min="0.1" step="0.1" required />
      </div>
    {/if}
    
    <button type="submit" disabled={!selectedChannelId}>Process Signal</button>
  </form>
</div>

<style>
  .signal-processor {
    background-color: #f0f8ff;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 0.75rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  button:hover {
    background-color: #0b7dda;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
</style>