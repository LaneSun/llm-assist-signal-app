import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatDeepSeek } from '@langchain/deepseek';
import { get } from 'svelte/store';
import { addMessage, chatHistory, llmConfig } from './llm_store.svelte';
import { signalTools } from './signal_tools';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

/**
 * Create an LLM instance based on the current configuration
 * @returns {BaseChatModel} LLM instance
 */
function createLLMInstance() {
  const config = get(llmConfig);

  const LLM_MAP = {
    "openai": ChatOpenAI,
    "anthropic": ChatAnthropic,
    "deepseek": ChatDeepSeek,
    "openrouter": ChatOpenAI,
  }

  const llm = new LLM_MAP[config.provider]({
    apiKey: config.apiKey,
    modelName: config.model,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    configuration: {
      ...provider_configs[config.provider] ?? (config.baseUrl ? { baseURL: config.baseUrl } : {}),
    },
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

    loop: while (true) {
      // Get response from LLM
      const stream = await llm.streamEvents(chatHistory.data, { version: 'v1' });

      let messages = [];
      addMessage(new AIMessage(""));
      let content = "";
      for await (const event of stream) {
        if (event.event === "on_llm_stream") {
          content += event.data.chunk?.content ?? "";
          chatHistory.data.pop();
          addMessage(new AIMessage(content));
        } else if (event.event === "on_llm_end") {
          chatHistory.data.pop();
          messages = event.data.output.generations.flat().map(g => g.message);
        }
      }

      addMessage(...messages);

      for (const response of messages) {
        // Check if the response contains tool calls
        if (response.tool_calls && response.tool_calls.length > 0) {
          for (const toolCall of response.tool_calls) {
            const { name } = toolCall;
            const tool = signalTools.find(t => t.name === name);
            const result = await tool.invoke(toolCall);
            addMessage(result);
            if (name === "await_user_input") break loop;
          }
        }
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

    case 'openrouter':
      return [
        'mistralai/mistral-small-3.1-24b-instruct:free',
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
    { id: 'deepseek', name: 'Deepseek' },
    { id: 'openrouter', name: 'Open Router' },
  ];
}

const provider_configs = {
  "openrouter": {
    baseURL: 'https://openrouter.ai/api/v1',
  },
};
