<script>
  import { onMount } from 'svelte';
  import { sendMessage } from '../lib/llmService';
  import { chatHistory, addMessage } from '../lib/llmStore';
  import { Button } from '../lib/components/ui/button';
  import { Card, CardContent } from '../lib/components/ui/card';
  import { Loader2, Send, Trash2 } from 'lucide-svelte';
  import { marked } from 'marked';

  let userMessage = $state('');
  let isLoading = $state(false);
  let chatContainer;

  // Scroll to bottom of chat when messages change
  $effect(() => {
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 0);
    }
  });

  async function handleSubmit() {
    if (!userMessage.trim() || isLoading) return;
    
    const message = userMessage.trim();
    userMessage = '';
    
    // Add user message to history
    addMessage('user', message);
    
    try {
      isLoading = true;
      
      // Send message to LLM
      const response = await sendMessage(message, $chatHistory);
      
      // Add assistant response to history
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error in chat:', error);
      addMessage('assistant', `Error: ${error.message}`);
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
        mangle: false, // 不转义标题中的HTML
        sanitize: false, // 不进行HTML净化（我们使用Svelte的@html，它会自动转义）
        smartLists: true, // 使用更智能的列表行为
        smartypants: true, // 使用更智能的标点符号
        xhtml: false // 不使用自闭合的XHTML标签
      });
      
      return marked.parse(content);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return content;
    }
  }
</script>

<div class="flex-1 flex flex-col min-h-0 overflow-hidden">
  <div class="flex-1 overflow-y-auto overflow-x-hidden py-4 min-h-0 border-t" bind:this={chatContainer}>
    {#if $chatHistory.length === 0}
      <div class="flex items-center justify-center text-muted-foreground">
        <p>开始与 AI 助手对话</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each $chatHistory as message}
          <Card class={message.role === 'user' ? 'bg-muted' : 'bg-card'}>
            <CardContent class="p-2">
              <div class="flex items-center gap-2">
                <div class="self-start shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                  {message.role === 'user' ? '我' : 'AI'}
                </div>
                <div class="flex-1 flex flex-col justify-center">
                  <div class="markdown-content break-words overflow-wrap-anywhere" 
                       style="--message-role: {message.role === 'user' ? 'user' : 'assistant'}"
                       >{@html renderMarkdown(message.content)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        {/each}
        
        {#if isLoading}
          <Card>
            <CardContent class="p-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
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
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex gap-2">
      <div class="flex-1 relative">
        <textarea
          bind:value={userMessage}
          placeholder="输入消息..."
          class="w-full p-2 border rounded-md resize-none h-full whitespace-pre-wrap break-words overflow-wrap-anywhere"
          onkeydown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        ></textarea>
      </div>
      <div class="flex flex-col gap-2">
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