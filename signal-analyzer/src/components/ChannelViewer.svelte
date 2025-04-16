<script>
  import { onMount, afterUpdate } from 'svelte';
  import { channels, removeChannel } from '../lib/stores.js';
  import Chart from 'chart.js/auto';

  // Selected channel for detailed view
  let selectedChannelId = null;
  let charts = {};

  // Create and update charts when channels change or a channel is selected
  afterUpdate(() => {
    if ($channels.length > 0) {
      updateCharts();
    }
  });

  // Initialize charts when component mounts
  onMount(() => {
    return () => {
      // Destroy all charts on component unmount
      Object.values(charts).forEach(chart => chart.destroy());
    };
  });

  // Update all charts
  function updateCharts() {
    // Update overview charts for all channels
    $channels.forEach(channel => {
      const canvasId = `chart-${channel.id}`;
      const canvas = document.getElementById(canvasId);
      
      if (canvas) {
        // Destroy existing chart if it exists
        if (charts[canvasId]) {
          charts[canvasId].destroy();
        }
        
        // Create new chart
        const ctx = canvas.getContext('2d');
        charts[canvasId] = createSignalChart(ctx, channel, false);
      }
    });
    
    // Update detailed chart if a channel is selected
    if (selectedChannelId) {
      const channel = $channels.find(ch => ch.id === selectedChannelId);
      if (channel) {
        const detailCanvasId = 'detail-chart';
        const detailCanvas = document.getElementById(detailCanvasId);
        
        if (detailCanvas) {
          // Destroy existing chart if it exists
          if (charts[detailCanvasId]) {
            charts[detailCanvasId].destroy();
          }
          
          // Create new detailed chart
          const ctx = detailCanvas.getContext('2d');
          charts[detailCanvasId] = createSignalChart(ctx, channel, true);
        }
      }
    }
  }

  // Create a chart for a signal
  function createSignalChart(ctx, channel, detailed = false) {
    const data = channel.data;
    const labels = Array.from({ length: data.length }, (_, i) => i);
    
    // For FFT or power spectrum data, use different visualization
    const isFrequencyDomain = channel.processingMethod === 'calculateFFT' || 
                              channel.processingMethod === 'calculatePowerSpectrum';
    
    return new Chart(ctx, {
      type: isFrequencyDomain ? 'bar' : 'line',
      data: {
        labels: labels,
        datasets: [{
          label: channel.name,
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          pointRadius: detailed ? 1 : 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            title: {
              display: detailed,
              text: isFrequencyDomain ? 'Frequency (Hz)' : 'Sample'
            }
          },
          y: {
            title: {
              display: detailed,
              text: 'Amplitude'
            }
          }
        },
        plugins: {
          legend: {
            display: detailed
          },
          tooltip: {
            enabled: detailed
          }
        }
      }
    });
  }

  // Handle channel selection
  function selectChannel(channelId) {
    selectedChannelId = channelId;
    // Update charts on next tick to ensure DOM is updated
    setTimeout(updateCharts, 0);
  }

  // Handle channel deletion
  function handleRemoveChannel(channelId) {
    if (confirm('Are you sure you want to remove this channel?')) {
      removeChannel(channelId);
      if (selectedChannelId === channelId) {
        selectedChannelId = null;
      }
    }
  }

  // Format date for display
  function formatDate(date) {
    return new Date(date).toLocaleString();
  }
</script>

<div class="channel-viewer">
  <h2>Channels</h2>
  
  {#if $channels.length === 0}
    <p>No channels available. Generate a signal first.</p>
  {:else}
    <div class="channels-container">
      <div class="channels-list">
        {#each $channels as channel (channel.id)}
          <div 
            class="channel-card" 
            class:selected={selectedChannelId === channel.id} 
            on:click={() => selectChannel(channel.id)}
            on:keydown={e => e.key === 'Enter' && selectChannel(channel.id)}
            role="button"
            tabindex="0"
            aria-pressed={selectedChannelId === channel.id}
          >
            <div class="channel-header">
              <h3>{channel.name}</h3>
              <button 
                class="delete-btn" 
                on:click|stopPropagation={() => handleRemoveChannel(channel.id)}
                aria-label="Delete channel {channel.name}"
              >×</button>
            </div>
            
            <div class="channel-stats">
              <p><strong>Length:</strong> {channel.getStats().length} samples</p>
              <p><strong>Sample Rate:</strong> {channel.sampleRate} Hz</p>
              <p><strong>Duration:</strong> {channel.getStats().duration.toFixed(3)} s</p>
            </div>
            
            <div class="channel-preview">
              <canvas id={`chart-${channel.id}`} height="80"></canvas>
            </div>
          </div>
        {/each}
      </div>
      
      {#if selectedChannelId}
        {#each $channels as channel (channel.id)}
          {#if channel.id === selectedChannelId}
            <div class="channel-detail">
              <h3>{channel.name}</h3>
              
              <div class="detail-stats">
                <div class="stat-group">
                  <p><strong>ID:</strong> {channel.id}</p>
                  <p><strong>Created:</strong> {formatDate(channel.createdAt)}</p>
                  <p><strong>Updated:</strong> {formatDate(channel.updatedAt)}</p>
                </div>
                
                <div class="stat-group">
                  <p><strong>Length:</strong> {channel.getStats().length} samples</p>
                  <p><strong>Sample Rate:</strong> {channel.sampleRate} Hz</p>
                  <p><strong>Duration:</strong> {channel.getStats().duration.toFixed(3)} s</p>
                </div>
                
                <div class="stat-group">
                  <p><strong>Min:</strong> {channel.getStats().min.toFixed(3)}</p>
                  <p><strong>Max:</strong> {channel.getStats().max.toFixed(3)}</p>
                  <p><strong>Mean:</strong> {channel.getStats().mean.toFixed(3)}</p>
                  <p><strong>RMS:</strong> {channel.getStats().rms.toFixed(3)}</p>
                </div>
                
                {#if channel.processingMethod}
                  <div class="stat-group">
                    <p><strong>Processing:</strong> {channel.processingMethod}</p>
                    {#if channel.sourceChannelIds.length > 0}
                      <p><strong>Source:</strong> 
                        {#each channel.sourceChannelIds as sourceId}
                          {#each $channels as sourceChannel}
                            {#if sourceChannel.id === sourceId}
                              {sourceChannel.name}
                            {/if}
                          {/each}
                        {/each}
                      </p>
                    {/if}
                  </div>
                {/if}
              </div>
              
              <div class="detail-chart">
                <canvas id="detail-chart" height="300"></canvas>
              </div>
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .channel-viewer {
    margin-top: 2rem;
  }
  
  .channels-container {
    display: flex;
    gap: 1.5rem;
  }
  
  .channels-list {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .channel-card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .channel-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .channel-card.selected {
    border-color: #2196f3;
    background-color: #e3f2fd;
  }
  
  .channel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .channel-header h3 {
    margin: 0;
    font-size: 1rem;
  }
  
  .delete-btn {
    background: none;
    border: none;
    color: #f44336;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  
  .channel-stats {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
  
  .channel-stats p {
    margin: 0.25rem 0;
  }
  
  .channel-preview {
    height: 80px;
  }
  
  .channel-detail {
    flex: 2;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .detail-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .stat-group {
    flex: 1;
    min-width: 200px;
  }
  
  .stat-group p {
    margin: 0.25rem 0;
  }
  
  .detail-chart {
    height: 300px;
    margin-top: 1rem;
  }
</style>