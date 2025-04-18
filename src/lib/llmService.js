import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatDeepSeek } from '@langchain/deepseek';
import { get } from 'svelte/store';
import { llmConfig } from './llmStore';
import { getOpenAITools, executeToolFunction } from './signalTools';

/**
 * Create an LLM instance based on the current configuration
 * @returns {Object} LLM instance
 */
function createLLMInstance() {
  const config = get(llmConfig);
  
  const LLM_MAP = {
    "openai": ChatOpenAI,
    "anthropic": ChatAnthropic,
    "deepseek": ChatDeepSeek,
  }

  const llm = new LLM_MAP[config.provider]({
    apiKey: config.apiKey,
    modelName: config.model,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    ...(config.baseUrl ? { baseURL: config.baseUrl } : {}),
  }).bindTools(getOpenAITools());
  
  return llm;
}

/**
 * Send a message to the LLM and get a response
 * @param {string} message - User message
 * @param {Array} history - Chat history (optional)
 * @returns {Promise<string>} LLM response
 */
export async function sendMessage(message, history = []) {
  try {
    const llm = createLLMInstance();
    const config = get(llmConfig);
    
    // Format history for LangChain
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the new message
    formattedHistory.push({
      role: 'user',
      content: message
    });
    
    // Get response from LLM
    const response = await llm.invoke(formattedHistory);
    
    // Check if the response contains tool calls
    if (response.tool_calls && response.tool_calls.length > 0) {
      // Process tool calls
      const toolResults = [];
      
      for (const toolCall of response.tool_calls) {
        try {
          const { name, arguments: args } = toolCall.function;
          const parsedArgs = JSON.parse(args);
          
          // Execute the tool function
          const result = await executeToolFunction(name, parsedArgs);
          toolResults.push({
            name,
            result
          });
        } catch (error) {
          toolResults.push({
            name: toolCall.function.name,
            error: error.message
          });
        }
      }
      
      // Format tool results as markdown
      let toolResultsMarkdown = "### 执行结果\n\n";
      toolResults.forEach(result => {
        if (result.error) {
          toolResultsMarkdown += `**${result.name}**: 执行失败 - ${result.error}\n\n`;
        } else {
          toolResultsMarkdown += `**${result.name}**: ${result.result.message}\n\n`;
          
          // Add additional details based on the tool
          if (result.name === 'generate_signal' || result.name === 'process_signal') {
            toolResultsMarkdown += `- 通道ID: \`${result.result.channel_id}\`\n`;
            toolResultsMarkdown += `- 通道名称: ${result.result.name}\n`;
            toolResultsMarkdown += `- 样本数: ${result.result.length}\n`;
          } else if (result.name === 'list_channels') {
            toolResultsMarkdown += "| ID | 名称 | 长度 | 采样率 |\n";
            toolResultsMarkdown += "|---|------|------|--------|\n";
            result.result.channels.forEach(channel => {
              toolResultsMarkdown += `| \`${channel.id}\` | ${channel.name} | ${channel.length} | ${channel.sample_rate} |\n`;
            });
          } else if (result.name === 'get_channel_info') {
            toolResultsMarkdown += `- 通道ID: \`${result.result.id}\`\n`;
            toolResultsMarkdown += `- 通道名称: ${result.result.name}\n`;
            toolResultsMarkdown += `- 样本数: ${result.result.length}\n`;
            toolResultsMarkdown += `- 采样率: ${result.result.sample_rate} Hz\n`;
            toolResultsMarkdown += `- 处理方法: ${result.result.processing_method || '无'}\n`;
            toolResultsMarkdown += `- 统计信息:\n`;
            toolResultsMarkdown += `  - 最小值: ${result.result.stats.min}\n`;
            toolResultsMarkdown += `  - 最大值: ${result.result.stats.max}\n`;
            toolResultsMarkdown += `  - 均值: ${result.result.stats.mean}\n`;
            toolResultsMarkdown += `  - RMS: ${result.result.stats.rms}\n`;
          }
          
          toolResultsMarkdown += "\n";
        }
      });
      
      // Return the original response content followed by tool results
      return response.content + "\n\n" + toolResultsMarkdown;
    }
    
    return response.content;
  } catch (error) {
    console.error('Error sending message to LLM:', error);
    throw error;
  }
}

/**
 * Get available models for the selected provider
 * @returns {Array} List of available models
 */
export function getAvailableModels(config) {
  
  switch (config.provider) {
    case 'openai':
      return [
        'gpt-3.5-turbo',
        'gpt-4',
        'gpt-4-turbo'
      ];
    
    case 'anthropic':
      return [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
      ];
    
    case 'deepseek':
      return [
        'deepseek-reasoner',
        'deepseek-chat',
        'deepseek-coder'
      ];
    
    default:
      return [];
  }
}

/**
 * Get available providers
 * @returns {Array} List of available providers
 */
export function getAvailableProviders() {
  return [
    { id: 'openai', name: 'OpenAI' },
    { id: 'anthropic', name: 'Anthropic' },
    { id: 'deepseek', name: 'Deepseek' }
  ];
}
