<script>
  import SignalGenerator from "./SignalGenerator.svelte";
  import SignalProcessor from "./SignalProcessor.svelte";
  import ChannelViewer from "./ChannelViewer.svelte";
  import ChatTab from "./ChatTab.svelte";
  import ConfigTab from "./ConfigTab.svelte";
  import {
    ResizablePaneGroup,
    ResizablePane,
    ResizableHandle,
  } from "$lib/components/ui/resizable";
  import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "$lib/components/ui/tabs";

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
      <ResizablePaneGroup direction="horizontal" class="box-fill">
        <ResizablePane class="h-full box-fill" minSize={50} defaultSize={65}>
          <div class="border-b p-4 flex-none">
            <h2 class="text-xl font-semibold">通道</h2>
            <p class="text-sm text-muted-foreground">查看和管理信号通道</p>
          </div>
          <div class="flex-1 min-h-0 overflow-hidden flex">
            <ChannelViewer bind:selectedChannelId />
          </div>
        </ResizablePane>

        <ResizableHandle withHandle />

        <ResizablePane class="h-full box-fill" minSize={20}>
          <div class="border-b p-4 flex-none">
            <h2 class="text-xl font-semibold">信号操作</h2>
            <p class="text-sm text-muted-foreground">生成和处理信号</p>
          </div>
          <div class="box-fill">
            <Tabs value="generate" class="box-fill">
              <TabsList class="m-4 mb-2 grid grid-cols-4">
                <TabsTrigger value="generate">生成信号</TabsTrigger>
                <TabsTrigger value="process">处理信号</TabsTrigger>
                <TabsTrigger value="chat">AI 助手</TabsTrigger>
                <TabsTrigger value="config">LLM 配置</TabsTrigger>
              </TabsList>
              <TabsContent value="generate" class="box-scroll border-t p-4">
                <SignalGenerator />
              </TabsContent>
              <TabsContent value="process" class="box-scroll border-t p-4">
                <SignalProcessor bind:selectedChannelId />
              </TabsContent>
              <TabsContent value="chat" class="box-fill border-t">
                <ChatTab />
              </TabsContent>
              <TabsContent value="config" class="box-scroll border-t p-4">
                <ConfigTab />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePane>
      </ResizablePaneGroup>
    </div>
  </main>
</div>
