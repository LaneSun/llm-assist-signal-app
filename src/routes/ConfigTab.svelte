<script>
  import { defaultConfig, llmConfig } from "$lib/llm_store.svelte";
  import { getAvailableModels, getAvailableProviders } from "$lib/llm_service.svelte";
  import { Button } from "$lib/components/ui/button";
  import { RotateCcw } from "lucide-svelte";
    import Input from "$lib/components/ui/input/input.svelte";

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

<div class="box gap-4">
  <div class="box gap-2">
    <h2 class="text-xl font-semibold">LLM 配置</h2>
    <p class="text-sm text-muted-foreground">配置 LLM 提供商和模型设置</p>
  </div>

  <div class="box gap-4">
    <div class="box gap-2">
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

    <div class="box gap-2">
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

    <div class="box gap-2">
      <label for="apiKey" class="text-sm font-medium">API 密钥</label>
      <Input
        id="apiKey"
        type="password"
        bind:value={formData.apiKey}
        placeholder="输入 API 密钥"
      />
    </div>

    <div class="box gap-2">
      <label for="temperature" class="text-sm font-medium"
        >温度 ({formData.temperature})</label
      >
      <Input
        id="temperature"
        type="range"
        bind:value={formData.temperature}
        min="0"
        max="1"
        step="0.1"
      />
    </div>

    <div class="box gap-2">
      <label for="maxTokens" class="text-sm font-medium">最大 Token 数</label>
      <Input
        id="maxTokens"
        type="number"
        bind:value={formData.maxTokens}
        min="1"
        max="8000"
      />
    </div>

    <div class="box gap-2">
      <label for="baseUrl" class="text-sm font-medium"
        >自定义 API 端点 (可选)</label
      >
      <Input
        id="baseUrl"
        type="text"
        bind:value={formData.baseUrl}
        placeholder="https://api.example.com/v1"
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
