import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatDeepSeek } from '@langchain/deepseek';
import { get } from 'svelte/store';
import { llmConfig } from './llmStore';

/**
 * Create an LLM instance based on the current configuration
 * @returns {Object} LLM instance
 */
function createLLMInstance() {
  const config = get(llmConfig);
  
  switch (config.provider) {
    case 'openai':
      return new ChatOpenAI({
        openAIApiKey: config.apiKey,
        modelName: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        ...(config.baseUrl ? { baseURL: config.baseUrl } : {})
      });
    
    case 'anthropic':
      return new ChatAnthropic({
        anthropicApiKey: config.apiKey,
        modelName: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      });
    
    case 'deepseek':
      return new ChatDeepSeek({
        apiKey: config.apiKey,
        modelName: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        ...(config.baseUrl ? { baseURL: config.baseUrl } : {})
      });
    
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
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