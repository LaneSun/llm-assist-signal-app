<script>
  import { defaultConfig, llmConfig } from "$lib/llm_store";
  import { getAvailableModels, getAvailableProviders } from "$lib/llm_service";
  import { Button } from "$lib/components/ui/button";
  import { RotateCcw } from "lucide-svelte";

  let formData = $state($llmConfig);
  const providers = getAvailableProviders();
  let models = $derived(getAvailableModels(formData));

  function handleReset() {
    formData = defaultConfig;
  }

  $effect(() => {
    $llmConfig = formData;
    if (!models.includes(formData.model)) {
      formData.model = models[0];
    }
  })
</script>

<div class="box space-y-4 py-4">
  <div class="space-y-2">
    <h2 class="text-xl font-semibold">LLM 配置</h2>
    <p class="text-sm text-muted-foreground">配置 LLM 提供商和模型设置</p>
  </div>

  <div class="box space-y-4">
    <div class="space-y-2">
      <label for="provider" class="text-sm font-medium">提供商</label>
      <select
        id="provider"
        bind:value={formData.provider}
        class="w-full p-2 border rounded-md"
      >
        {#each providers as provider}
          <option value={provider.id}>{provider.name}</option>
        {/each}
      </select>
    </div>

    <div class="space-y-2">
      <label for="model" class="text-sm font-medium">模型</label>
      <select
        id="model"
        bind:value={formData.model}
        class="w-full p-2 border rounded-md"
      >
        {#each models as model}
          <option value={model}>{model}</option>
        {/each}
      </select>
    </div>

    <div class="space-y-2">
      <label for="apiKey" class="text-sm font-medium">API 密钥</label>
      <input
        id="apiKey"
        type="password"
        bind:value={formData.apiKey}
        placeholder="输入 API 密钥"
        class="w-full p-2 border rounded-md"
      />
    </div>

    <div class="space-y-2">
      <label for="temperature" class="text-sm font-medium"
        >温度 ({formData.temperature})</label
      >
      <input
        id="temperature"
        type="range"
        bind:value={formData.temperature}
        min="0"
        max="1"
        step="0.1"
        class="w-full"
      />
    </div>

    <div class="space-y-2">
      <label for="maxTokens" class="text-sm font-medium">最大 Token 数</label>
      <input
        id="maxTokens"
        type="number"
        bind:value={formData.maxTokens}
        min="1"
        max="4000"
        class="w-full p-2 border rounded-md"
      />
    </div>

    <div class="space-y-2">
      <label for="baseUrl" class="text-sm font-medium"
        >自定义 API 端点 (可选)</label
      >
      <input
        id="baseUrl"
        type="text"
        bind:value={formData.baseUrl}
        placeholder="https://api.example.com/v1"
        class="w-full p-2 border rounded-md"
      />
    </div>
  </div>

  <div class="flex justify-between">
    <Button variant="outline" on:click={handleReset}>
      <RotateCcw class="h-4 w-4 mr-2" />
      重置
    </Button>
  </div>
</div>
