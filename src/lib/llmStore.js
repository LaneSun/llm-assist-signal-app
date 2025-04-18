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
export const llmConfig = writable(defaultConfig);

// Store for chat history
export const chatHistory = writable([]);

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
  chatHistory.set([]);
}