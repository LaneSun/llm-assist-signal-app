<script>
  import { onMount, afterUpdate } from "svelte";
  import { channels, removeChannel } from "$lib/stores.js";
  import Chart from "chart.js/auto";
  import Resizable from "$lib/components/ui/Resizable.svelte";

  // Selected channel for detailed view
  export let selectedChannelId = null;
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
      Object.values(charts).forEach((chart) => chart.destroy());
    };
  });

  // Update all charts
  function updateCharts() {
    // Update overview charts for all channels
    $channels.forEach((channel) => {
      const canvasId = `chart-${channel.id}`;
      const canvas = document.getElementById(canvasId);

      if (canvas) {
        // Destroy existing chart if it exists
        if (charts[canvasId]) {
          charts[canvasId].destroy();
        }

        // Create new chart
        const ctx = canvas.getContext("2d");
        charts[canvasId] = createSignalChart(ctx, channel, false);
      }
    });

    // Update detailed chart if a channel is selected
    if (selectedChannelId) {
      const channel = $channels.find((ch) => ch.id === selectedChannelId);
      if (channel) {
        const detailCanvasId = "detail-chart";
        const detailCanvas = document.getElementById(detailCanvasId);

        if (detailCanvas) {
          // Destroy existing chart if it exists
          if (charts[detailCanvasId]) {
            charts[detailCanvasId].destroy();
          }

          // Create new detailed chart
          const ctx = detailCanvas.getContext("2d");
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
    const isFrequencyDomain =
      channel.processingMethod === "calculateFFT" ||
      channel.processingMethod === "calculatePowerSpectrum";

    return new Chart(ctx, {
      type: isFrequencyDomain ? "bar" : "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: channel.name,
            data: data,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
            pointRadius: detailed ? 1 : 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            title: {
              display: detailed,
              text: isFrequencyDomain ? "频率 (Hz)" : "样本",
            },
            display: detailed,
          },
          y: {
            title: {
              display: detailed,
              text: "幅度",
            },
            display: detailed,
          },
        },
        plugins: {
          legend: {
            display: detailed,
          },
          tooltip: {
            enabled: detailed,
          },
        },
      },
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
    if (confirm("您确定要删除此通道吗？")) {
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

<div class="box-fill">
  {#if $channels.length === 0}
    <div class="text-center py-8 text-muted-foreground">
      <p>没有可用的通道。请先生成一个信号。</p>
    </div>
  {:else}
    <Resizable initialLeftWidth={40} minLeftWidth={30} maxLeftWidth={70}>
      <div slot="left" class="box-scroll h-full">
        <div class="box">
          {#each $channels as channel (channel.id)}
            <div
              class="p-2 {selectedChannelId === channel.id
                ? 'bg-primary/5'
                : ''} cursor-pointer hover:bg-accent/50 transition-colors border-b"
              on:click={() => selectChannel(channel.id)}
              on:keydown={(e) => e.key === "Enter" && selectChannel(channel.id)}
              role="button"
              tabindex="0"
              aria-pressed={selectedChannelId === channel.id}
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-sm">{channel.name}</h3>
                <button
                  class="h-8 w-8 flex items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  on:click={(e) => {
                    e.stopPropagation();
                    handleRemoveChannel(channel.id);
                  }}
                  aria-label="Delete channel {channel.name}"
                >
                  <span class="text-xl">×</span>
                </button>
              </div>

              <div class="h-8">
                <canvas id={`chart-${channel.id}`}></canvas>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div slot="right" class="box-scroll h-full p-4">
        {#if selectedChannelId}
          {#each $channels as channel (channel.id)}
            {#if channel.id === selectedChannelId}
              <h3 class="text-lg font-semibold mb-4">{channel.name} 详情</h3>

              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
              >
                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">ID</div>
                  <div class="text-sm font-medium truncate">{channel.id}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">创建时间</div>
                  <div class="text-sm">{formatDate(channel.createdAt)}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">更新时间</div>
                  <div class="text-sm">{formatDate(channel.updatedAt)}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">采样率</div>
                  <div class="text-sm">{channel.sampleRate} Hz</div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">Length</div>
                  <div class="text-sm">{channel.getStats().length} 个样本</div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">Duration</div>
                  <div class="text-sm">
                    {channel.getStats().duration.toFixed(3)} s
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">最小值/最大值</div>
                  <div class="text-sm">
                    {channel.getStats().min.toFixed(3)} / {channel
                      .getStats()
                      .max.toFixed(3)}
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-muted-foreground">平均值/均方根</div>
                  <div class="text-sm">
                    {channel.getStats().mean.toFixed(3)} / {channel
                      .getStats()
                      .rms.toFixed(3)}
                  </div>
                </div>

                {#if channel.processingMethod}
                  <div class="space-y-1 col-span-2">
                    <div class="text-xs text-muted-foreground">处理方法</div>
                    <div class="text-sm">{channel.processingMethod}</div>
                  </div>

                  {#if channel.sourceChannelIds.length > 0}
                    <div class="space-y-1 col-span-2">
                      <div class="text-xs text-muted-foreground">源通道</div>
                      <div class="text-sm">
                        {#each channel.sourceChannelIds as sourceId}
                          {#each $channels as sourceChannel}
                            {#if sourceChannel.id === sourceId}
                              {sourceChannel.name}
                            {/if}
                          {/each}
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/if}
              </div>

              <div class="h-64 mt-4">
                <canvas id="detail-chart"></canvas>
              </div>
            {/if}
          {/each}
        {:else}
          <div class="text-center py-8 text-muted-foreground">
            <p>请选择一个通道以查看详情。</p>
          </div>
        {/if}
      </div>
    </Resizable>
  {/if}
</div>
