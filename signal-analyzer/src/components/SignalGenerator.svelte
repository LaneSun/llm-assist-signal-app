<script>
  import { addChannel } from '../lib/stores.js';
  import * as generators from '../lib/SignalGenerators.js';

  // Available signal types
  const signalTypes = [
    { id: 'sine', name: 'Sine Wave', generator: generators.generateSineWave },
    { id: 'square', name: 'Square Wave', generator: generators.generateSquareWave },
    { id: 'triangle', name: 'Triangle Wave', generator: generators.generateTriangleWave },
    { id: 'sawtooth', name: 'Sawtooth Wave', generator: generators.generateSawtoothWave },
    { id: 'noise', name: 'White Noise', generator: generators.generateWhiteNoise },
    { id: 'pulse', name: 'Pulse', generator: generators.generatePulse }
  ];

  // Form values
  let selectedSignalType = signalTypes[0];
  let channelName = 'New Signal';
  let sampleRate = 1000;
  let length = 1000;
  let frequency = 10;
  let amplitude = 1;
  let dutyCycle = 0.5;
  let pulsePosition = 500;
  let pulseWidth = 10;
  let phase = 0;

  // Generate signal and add to channels
  function generateSignal() {
    let signalData;
    
    switch (selectedSignalType.id) {
      case 'sine':
        signalData = generators.generateSineWave(length, frequency, amplitude, sampleRate, phase);
        break;
      case 'square':
        signalData = generators.generateSquareWave(length, frequency, amplitude, sampleRate, dutyCycle);
        break;
      case 'triangle':
        signalData = generators.generateTriangleWave(length, frequency, amplitude, sampleRate);
        break;
      case 'sawtooth':
        signalData = generators.generateSawtoothWave(length, frequency, amplitude, sampleRate);
        break;
      case 'noise':
        signalData = generators.generateWhiteNoise(length, amplitude);
        break;
      case 'pulse':
        signalData = generators.generatePulse(length, pulsePosition, pulseWidth, amplitude);
        break;
      default:
        signalData = [];
    }
    
    // Add the channel with generated data
    const channel = addChannel(channelName, signalData, sampleRate);
    
    // Reset form
    channelName = 'New Signal';
  }
</script>

<div class="signal-generator">
  <h2>Signal Generator</h2>
  
  <form on:submit|preventDefault={generateSignal}>
    <div class="form-group">
      <label for="channelName">Channel Name</label>
      <input id="channelName" type="text" bind:value={channelName} required />
    </div>
    
    <div class="form-group">
      <label for="signalType">Signal Type</label>
      <select id="signalType" bind:value={selectedSignalType}>
        {#each signalTypes as signalType}
          <option value={signalType}>{signalType.name}</option>
        {/each}
      </select>
    </div>
    
    <div class="form-group">
      <label for="sampleRate">Sample Rate (Hz)</label>
      <input id="sampleRate" type="number" bind:value={sampleRate} min="1" required />
    </div>
    
    <div class="form-group">
      <label for="length">Length (samples)</label>
      <input id="length" type="number" bind:value={length} min="1" required />
    </div>
    
    <div class="form-group">
      <label for="amplitude">Amplitude</label>
      <input id="amplitude" type="number" bind:value={amplitude} step="0.1" required />
    </div>
    
    {#if selectedSignalType.id === 'sine' || selectedSignalType.id === 'square' || 
         selectedSignalType.id === 'triangle' || selectedSignalType.id === 'sawtooth'}
      <div class="form-group">
        <label for="frequency">Frequency (Hz)</label>
        <input id="frequency" type="number" bind:value={frequency} min="0.1" step="0.1" required />
      </div>
    {/if}
    
    {#if selectedSignalType.id === 'sine'}
      <div class="form-group">
        <label for="phase">Phase (radians)</label>
        <input id="phase" type="number" bind:value={phase} step="0.1" />
      </div>
    {/if}
    
    {#if selectedSignalType.id === 'square'}
      <div class="form-group">
        <label for="dutyCycle">Duty Cycle (0-1)</label>
        <input id="dutyCycle" type="number" bind:value={dutyCycle} min="0" max="1" step="0.1" required />
      </div>
    {/if}
    
    {#if selectedSignalType.id === 'pulse'}
      <div class="form-group">
        <label for="pulsePosition">Pulse Position (sample)</label>
        <input id="pulsePosition" type="number" bind:value={pulsePosition} min="0" max={length-1} required />
      </div>
      
      <div class="form-group">
        <label for="pulseWidth">Pulse Width (samples)</label>
        <input id="pulseWidth" type="number" bind:value={pulseWidth} min="1" required />
      </div>
    {/if}
    
    <button type="submit">Generate Signal</button>
  </form>
</div>

<style>
  .signal-generator {
    background-color: #f5f5f5;
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
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  button:hover {
    background-color: #45a049;
  }
</style>