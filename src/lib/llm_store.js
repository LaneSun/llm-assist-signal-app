import { BaseMessage, SystemMessage } from '@langchain/core/messages';
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

/**
 * @type {BaseMessage[]}
 */
export const defaultHistory = [
  // Add system prompt
  new SystemMessage(
    `You are a signal processing assistant that can help users generate and process signals. You can use the following tools:

1. generate_signal - Generate a new signal channel
2. process_signal - Process an existing signal and create a new channel
3. list_channels - List all available signal channels
4. get_channel_info - Get detailed information about a specific signal channel

When a user requests to generate or process signals, please use the appropriate tool instead of answering directly. For example, if a user asks to generate a sine wave, call the generate_signal tool.

You will be called repeatedly to complete tasks. Follow these rules:  

1. Perform tasks step-by-step. If unable to finish in one response, persist until done.  
2. After completing the task (or a subtask requiring user input), call \`await_user_input\` before ending.  
3. Stay aware of prior context—you may be recalled to continue.  

Always conclude with \`await_user_input\` when the task requires further user interaction.

Always call the await_user_input tool after completing a task or response. This signals the system to pause and wait for further user input before proceeding`
  ),
];

// Store for chat history
export const chatHistory = writable([...defaultHistory]);

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
