<script>
  import SignalGenerator from './components/SignalGenerator.svelte';
  import SignalProcessor from './components/SignalProcessor.svelte';
  import ChannelViewer from './components/ChannelViewer.svelte';
  import ChatTab from './components/ChatTab.svelte';
  import ConfigTab from './components/ConfigTab.svelte';
  import Resizable from './components/ui/Resizable.svelte';
  import { Tabs, TabsList, TabsTrigger, TabsContent } from './lib/components/ui/tabs';

  let selectedChannelId = $state();
</script>

<div class="h-screen bg-background box-fill">
  <header class="border-b flex-none">
    <div class="container py-4">
      <h1 class="text-3xl font-bold tracking-tight">信号分析器</h1>
      <p class="text-muted-foreground">生成、处理和分析信号</p>
    </div>
  </header>

  <main class="box-fill">
    <div class="box-fill">
      <Resizable initialLeftWidth={65} minLeftWidth={30} maxLeftWidth={80}>
        <div slot="left" class="h-full box-fill">
          <div class="border-b p-4 flex-none">
            <h2 class="text-xl font-semibold">通道</h2>
            <p class="text-sm text-muted-foreground">查看和管理信号通道</p>
          </div>
          <div class="flex-1 min-h-0 overflow-hidden flex">
            <ChannelViewer bind:selectedChannelId />
          </div>
        </div>

        <div slot="right" class="h-full box-fill">
          <div class="border-b p-4 flex-none">
            <h2 class="text-xl font-semibold">信号操作</h2>
            <p class="text-sm text-muted-foreground">生成和处理信号</p>
          </div>
          <div class="p-4 box-fill">
            <Tabs defaultValue="generate" class="box-fill">
              <TabsList class="grid grid-cols-4">
                <TabsTrigger value="generate">生成信号</TabsTrigger>
                <TabsTrigger value="process">处理信号</TabsTrigger>
                <TabsTrigger value="chat">AI 助手</TabsTrigger>
                <TabsTrigger value="config">LLM 配置</TabsTrigger>
              </TabsList>
              <TabsContent value="generate" class="mt-2 box-scroll">
                <SignalGenerator />
              </TabsContent>
              <TabsContent value="process" class="mt-2 box-scroll">
                <SignalProcessor bind:selectedChannelId />
              </TabsContent>
              <TabsContent value="chat" class="mt-2 box-fill">
                <ChatTab />
              </TabsContent>
              <TabsContent value="config" class="mt-2 box-scroll">
                <ConfigTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Resizable>
    </div>
  </main>
</div>
