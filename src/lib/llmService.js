import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatDeepSeek } from '@langchain/deepseek';
import { get } from 'svelte/store';
import { addMessage, chatHistory, llmConfig } from './llmStore';
import { signalTools } from './signalTools';
import { HumanMessage } from '@langchain/core/messages';

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
  }).bindTools(signalTools);
  
  return llm;
}

/**
 * Send a message to the LLM and get a response
 * @param {string} message - User message
 * @returns {Promise<void>} LLM response
 */
export async function sendMessage(message) {
  try {
    const llm = createLLMInstance();

    addMessage(new HumanMessage(message));
    
    // Get response from LLM
    const response = await llm.invoke(get(chatHistory));
    
    // Check if the response contains tool calls
    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        const { name } = toolCall;
        const tool = signalTools.find(t => t.name === name);
        const result = await tool.invoke(toolCall);
        addMessage(result);
      }
    }
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
