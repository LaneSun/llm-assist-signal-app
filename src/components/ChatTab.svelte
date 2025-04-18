<script>
  import { sendMessage } from "../lib/llmService";
  import { chatHistory, addMessage } from "../lib/llmStore";
  import { Button } from "../lib/components/ui/button";
  import { Card, CardContent } from "../lib/components/ui/card";
  import { Loader2, Send, Trash2 } from "lucide-svelte";
  import { marked } from "marked";
  import { AIMessage } from "@langchain/core/messages";

  let userMessage = $state("");
  let isLoading = $state(false);
  let chatContainer;

  // Scroll to bottom of chat when messages change
  $effect(() => {
    $chatHistory.length;
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  });

  async function handleSubmit() {
    if (!userMessage.trim() || isLoading) return;

    const message = userMessage.trim();
    userMessage = "";

    try {
      isLoading = true;

      // Send message to LLM
      await sendMessage(message);
    } catch (error) {
      console.error("Error in chat:", error);
      addMessage(new AIMessage(`Error: ${error.message}`));
    } finally {
      isLoading = false;
    }
  }

  function clearChat() {
    $chatHistory = [];
  }

  // 渲染Markdown内容
  function renderMarkdown(content) {
    try {
      // 配置marked选项
      marked.setOptions({
        gfm: true, // GitHub风格的Markdown
        breaks: true, // 将换行符转换为<br>
      });

      return marked.parse(content);
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return content;
    }
  }

  $inspect($chatHistory);
</script>

<div class="box-fill">
  <div
    class="box-scroll overflow-y-auto overflow-x-hidden py-4 border-t"
    bind:this={chatContainer}
  >
    {#if $chatHistory.length <= 1}
      <!-- 只有系统提示时 -->
      <div
        class="box items-center justify-center h-full text-muted-foreground space-y-4 p-4"
      >
        <p class="text-lg font-medium">开始与 AI 助手对话</p>
        <div class="max-w-md bg-teal-50 p-4 rounded-lg border border-teal-200">
          <p class="text-sm text-teal-800 font-medium mb-2">提示：</p>
          <p class="text-sm text-teal-700">
            你可以让AI助手帮你生成和处理信号，例如：
          </p>
          <ul class="list-disc pl-5 text-sm text-teal-700 mt-2 space-y-1">
            <li>生成一个频率为50Hz的正弦波信号</li>
            <li>对ID为xxx的信号进行低通滤波</li>
            <li>列出所有可用的信号通道</li>
            <li>获取ID为xxx的信号通道的详细信息</li>
          </ul>
        </div>
      </div>
    {:else}
      <div class="space-y-4">
        {#each $chatHistory as message}
          {@const type = message.getType()}
          {#if ["human", "ai", "tool"].includes(type)}
            <Card class={type === "human" ? "bg-muted" : "bg-card"}>
              <CardContent class="p-2">
                <div class="flex items-center gap-2">
                  <div
                    class="self-start shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm"
                  >
                    {type === "human" ? "我" : "AI"}
                  </div>
                  {#if type === "tool"}
                  <div class="flex-1 box justify-center">
                    <div
                      class="markdown-content break-words overflow-wrap-anywhere"
                    >
                      {message.content}
                    </div>
                  </div>
                    {:else}
                    <div class="flex-1 box justify-center">
                      <div
                        class="markdown-content break-words overflow-wrap-anywhere"
                      >
                        {@html renderMarkdown(message.content)}
                      </div>
                    </div>
                  {/if}
                </div>
              </CardContent>
            </Card>
          {/if}
        {/each}

        {#if isLoading}
          <Card>
            <CardContent class="p-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                >
                  AI
                </div>
                <Loader2 class="h-4 w-4 animate-spin" />
                <span>思考中...</span>
              </div>
            </CardContent>
          </Card>
        {/if}
      </div>
    {/if}
  </div>

  <div class="border-t pt-4">
    <form
      onsubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      class="flex gap-2"
    >
      <div class="flex-1 relative">
        <textarea
          bind:value={userMessage}
          placeholder="输入消息..."
          class="w-full p-2 border rounded-md resize-none h-full whitespace-pre-wrap break-words overflow-wrap-anywhere"
          onkeydown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        ></textarea>
      </div>
      <div class="box gap-2">
        <Button type="submit" disabled={isLoading || !userMessage.trim()}>
          <Send class="h-4 w-4 mr-2" />
          发送
        </Button>
        <Button type="button" variant="outline" on:click={clearChat}>
          <Trash2 class="h-4 w-4 mr-2" />
          清空
        </Button>
      </div>
    </form>
  </div>
</div>
