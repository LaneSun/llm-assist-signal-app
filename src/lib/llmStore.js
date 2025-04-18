import { BaseMessage, SystemMessage } from '@langchain/core/messages';
import { persisted } from 'svelte-persisted-store';

// Default LLM configuration
export const defaultConfig = {
  provider: 'openai', // 'openai', 'anthropic', 'local', etc.
  model: 'gpt-3.5-turbo',
  apiKey: '',
  temperature: 0.7,
  maxTokens: 1000,
  baseUrl: '', // For custom API endpoints
};

// Store for LLM configuration
export const llmConfig = persisted('llm-assist-signal-app::llm_config', defaultConfig);

export const defaultHistory = [
  // Add system prompt
  new SystemMessage(
    `You are a signal processing assistant that can help users generate and process signals. You can use the following tools:

1. generate_signal - Generate a new signal channel
2. process_signal - Process an existing signal and create a new channel
3. list_channels - List all available signal channels
4. get_channel_info - Get detailed information about a specific signal channel

When a user requests to generate or process signals, please use the appropriate tool instead of answering directly. For example, if a user asks to generate a sine wave, call the generate_signal tool.`
  ),
];

// Store for chat history
export const chatHistory = persisted('llm-assist-signal-app::chat_history', [...defaultHistory]);

/**
 * Add a message to the chat history
 * @param {BaseMessage} msg - Message
 */
export function addMessage(msg) {
  chatHistory.update(history => {
    return [...history, msg];
  });
}

/**
 * Clear the chat history
 */
export function clearChatHistory() {
  chatHistory.set([...defaultHistory]);
}

/**
 * Reset the LLM configuration to defaults
 */
export function resetLLMConfig() {
  llmConfig.set(defaultConfig);
}
