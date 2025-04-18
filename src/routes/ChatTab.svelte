<script>
  import { sendMessage } from "$lib/llm_service";
  import { chatHistory, addMessage } from "$lib/llm_store";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Loader2, Send, Trash2 } from "lucide-svelte";
  import { marked } from "marked";
  import { AIMessage } from "@langchain/core/messages";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";

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
</script>

<div class="box-fill">
  <div
    class="box-scroll overflow-y-auto overflow-x-hidden p-4"
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
      <div class="box gap-4 text-sm">
        {#each $chatHistory as message}
          {@const type = message.getType()}
          {#if ["human", "ai"].includes(type)}
            <Card class={type === "human" ? "bg-muted" : "bg-card"}>
              <CardContent class="p-2">
                <div class="flex items-center gap-2">
                  <div
                    class="
                      self-start shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs text-primary-foreground
                      {type === 'human' ? 'bg-primary' : 'bg-blue-600'}"
                  >
                    {type === "human" ? "我" : "AI"}
                  </div>
                  <div class="box gap-2">
                    {#if message.content}
                      <div class="flex-1 box justify-center">
                        <div
                          class="markdown-content break-words overflow-wrap-anywhere"
                        >
                          {@html renderMarkdown(message.content)}
                        </div>
                      </div>
                    {/if}
                    {#if message.tool_calls && message.tool_calls.length > 0}
                      <div class="text-muted-foreground">{message.tool_calls[0].name === "await_user_input" ? "请求用户输入" : "请求调用工具"}</div>
                    {/if}
                  </div>
                </div>
              </CardContent>
            </Card>
          {:else if ["tool"].includes(type)}
            <div class="flex-1 self-center box justify-center">
              <div class="text-muted-foreground">{message.name === "await_user_input" ? "等待用户输入" : "工具调用结束"}</div>
            </div>
          {/if}
        {/each}

        {#if isLoading}
          <Card class="text-sm">
            <CardContent class="p-2">
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-primary-foreground text-xs"
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

  <div class="border-t p-2">
    <form
      onsubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      class="flex gap-2"
    >
      <div class="flex-1 relative">
        <Textarea
          class="h-full min-h-full whitespace-pre-wrap break-words overflow-wrap-anywhere"
          bind:value={userMessage}
          placeholder="输入消息..."
          onkeydown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
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
