import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

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

// Store for chat history
export const chatHistory = persisted('llm-assist-signal-app::chat_history', [
  // Add system prompt
  {
    role: 'system',
    content: `You are a signal processing assistant that can help users generate and process signals. You can use the following tools:

1. generate_signal - Generate a new signal channel
2. process_signal - Process an existing signal and create a new channel
3. list_channels - List all available signal channels
4. get_channel_info - Get detailed information about a specific signal channel

When a user requests to generate or process signals, please use the appropriate tool instead of answering directly. For example, if a user asks to generate a sine wave, call the generate_signal tool.`,
    timestamp: new Date()
  }
]);

/**
 * Add a message to the chat history
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 */
export function addMessage(role, content) {
  chatHistory.update(history => {
    return [...history, { role, content, timestamp: new Date() }];
  });
}

/**
 * Clear the chat history
 */
export function clearChatHistory() {
  chatHistory.set([
    // Restore system prompt when clearing
    {
      role: 'system',
      content: `You are a signal processing assistant that can help users generate and process signals. You can use the following tools:

1. generate_signal - Generate a new signal channel
2. process_signal - Process an existing signal and create a new channel
3. list_channels - List all available signal channels
4. get_channel_info - Get detailed information about a specific signal channel

When a user requests to generate or process signals, please use the appropriate tool instead of answering directly. For example, if a user asks to generate a sine wave, call the generate_signal tool.`,
      timestamp: new Date()
    }
  ]);
}

/**
 * Update the LLM configuration
 * @param {Object} newConfig - New configuration object
 */
export function updateLLMConfig(newConfig) {
  llmConfig.update(config => {
    return { ...config, ...newConfig };
  });
}

/**
 * Reset the LLM configuration to defaults
 */
export function resetLLMConfig() {
  llmConfig.set(defaultConfig);
}
