<script>
  import SignalGenerator from './components/SignalGenerator.svelte';
  import SignalProcessor from './components/SignalProcessor.svelte';
  import ChannelViewer from './components/ChannelViewer.svelte';
  import Resizable from './components/ui/Resizable.svelte';
  import { Tabs, TabsList, TabsTrigger, TabsContent } from './lib/components/ui/tabs';
</script>

<div class="h-screen bg-background flex flex-col overflow-hidden">
  <header class="border-b flex-none">
    <div class="container py-4">
      <h1 class="text-3xl font-bold tracking-tight">Signal Analyzer</h1>
      <p class="text-muted-foreground">Generate, process, and analyze signals</p>
    </div>
  </header>

  <main class="flex-1 flex flex-col overflow-hidden min-h-0">
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <Resizable initialLeftWidth={65} minLeftWidth={30} maxLeftWidth={80}>
        <div slot="left" class="h-full flex-1 flex flex-col min-h-0 overflow-hidden">
          <div class="border-b p-4 flex-none">
            <h2 class="text-xl font-semibold">Channels</h2>
            <p class="text-sm text-muted-foreground">View and manage signal channels</p>
          </div>
          <div class="flex-1 min-h-0 overflow-auto p-4">
            <ChannelViewer />
          </div>
        </div>
        
        <div slot="right" class="h-full flex-1 flex flex-col min-h-0">
          <div class="border-b p-4 flex-none">
            <h2 class="text-xl font-semibold">Signal Operations</h2>
            <p class="text-sm text-muted-foreground">Generate and process signals</p>
          </div>
          <div class="flex-1 overflow-auto p-4 min-h-0">
            <Tabs defaultValue="generate" class="w-full">
              <TabsList class="grid grid-cols-2 w-full sticky top-0 bg-background z-10">
                <TabsTrigger value="generate">Generate Signal</TabsTrigger>
                <TabsTrigger value="process">Process Signal</TabsTrigger>
              </TabsList>
              <TabsContent value="generate" class="mt-2">
                <SignalGenerator />
              </TabsContent>
              <TabsContent value="process" class="mt-2">
                <SignalProcessor />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Resizable>
    </div>
  </main>
</div>
