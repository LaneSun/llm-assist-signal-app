<script>
  import { addChannel } from '../lib/stores.js';
  import * as generators from '../lib/SignalGenerators.js';
  import { Button } from '../lib/components/ui/button';

  // Available signal types
  const signalTypes = [
    { id: 'sine', name: '正弦波', generator: generators.generateSineWave },
    { id: 'square', name: '方波', generator: generators.generateSquareWave },
    { id: 'triangle', name: '三角波', generator: generators.generateTriangleWave },
    { id: 'sawtooth', name: '锯齿波', generator: generators.generateSawtoothWave },
    { id: 'noise', name: '白噪声', generator: generators.generateWhiteNoise },
    { id: 'pulse', name: '脉冲', generator: generators.generatePulse }
  ];

  let s_index = 1;

  function getChannelName() {
    return '信号 ' + s_index++;
  }

  // Form values
  let selectedSignalType = signalTypes[0];
  let channelName = getChannelName();
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
    channelName = getChannelName();
  }
</script>

<div class="box space-y-4 py-4">
  <form onsubmit={(e) => { e.preventDefault(); generateSignal(); }} class="box space-y-4">
    <div class="grid gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="channelName" class="text-sm font-medium">通道名称</label>
          <input 
            id="channelName" 
            type="text" 
            bind:value={channelName} 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
        
        <div class="space-y-2">
          <label for="signalType" class="text-sm font-medium">信号类型</label>
          <select 
            id="signalType" 
            bind:value={selectedSignalType}
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          >
            {#each signalTypes as signalType}
              <option value={signalType}>{signalType.name}</option>
            {/each}
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <label for="sampleRate" class="text-sm font-medium">采样率 (Hz)</label>
          <input 
            id="sampleRate" 
            type="number" 
            bind:value={sampleRate} 
            min="1" 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
        
        <div class="space-y-2">
          <label for="length" class="text-sm font-medium">长度 (样本数)</label>
          <input 
            id="length" 
            type="number" 
            bind:value={length} 
            min="1" 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
        
        <div class="space-y-2">
          <label for="amplitude" class="text-sm font-medium">幅度</label>
          <input 
            id="amplitude" 
            type="number" 
            bind:value={amplitude} 
            step="0.1" 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
      </div>
      
      {#if selectedSignalType.id === 'sine' || selectedSignalType.id === 'square' || 
           selectedSignalType.id === 'triangle' || selectedSignalType.id === 'sawtooth'}
        <div class="space-y-2">
          <label for="frequency" class="text-sm font-medium">频率 (Hz)</label>
          <input 
            id="frequency" 
            type="number" 
            bind:value={frequency} 
            min="0.1" 
            step="0.1" 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
      {/if}
      
      {#if selectedSignalType.id === 'sine'}
        <div class="space-y-2">
          <label for="phase" class="text-sm font-medium">相位 (弧度)</label>
          <input 
            id="phase" 
            type="number" 
            bind:value={phase} 
            step="0.1" 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
      {/if}
      
      {#if selectedSignalType.id === 'square'}
        <div class="space-y-2">
          <label for="dutyCycle" class="text-sm font-medium">占空比 (0-1)</label>
          <input 
            id="dutyCycle" 
            type="number" 
            bind:value={dutyCycle} 
            min="0" 
            max="1" 
            step="0.1" 
            required 
            class="w-full px-3 py-2 border rounded-md border-input bg-background"
          />
        </div>
      {/if}
      
      {#if selectedSignalType.id === 'pulse'}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="pulsePosition" class="text-sm font-medium">脉冲 Position (sample)</label>
            <input 
              id="pulsePosition" 
              type="number" 
              bind:value={pulsePosition} 
              min="0" 
              max={length-1} 
              required 
              class="w-full px-3 py-2 border rounded-md border-input bg-background"
            />
          </div>
          
          <div class="space-y-2">
            <label for="pulseWidth" class="text-sm font-medium">脉冲 Width (samples)</label>
            <input 
              id="pulseWidth" 
              type="number" 
              bind:value={pulseWidth} 
              min="1" 
              required 
              class="w-full px-3 py-2 border rounded-md border-input bg-background"
            />
          </div>
        </div>
      {/if}
    </div>
    
    <Button type="submit" class="w-full">生成信号</Button>
  </form>
</div>