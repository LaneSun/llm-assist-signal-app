import { writable } from 'svelte/store';
import { Channel } from './Channel';

// Store for all channels
export const channels = writable([]);

/**
 * Add a new channel
 * @param {string} name - Channel name
 * @param {number[]} data - Signal data
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {Channel} - The created channel
 */
export function addChannel(name, data = [], sampleRate = 1000) {
  const channel = new Channel(name, data, sampleRate);
  
  channels.update(currentChannels => {
    return [...currentChannels, channel];
  });
  
  return channel;
}

/**
 * Get a channel by ID
 * @param {string} id - Channel ID
 * @returns {Channel|null} - The channel or null if not found
 */
export function getChannelById(id) {
  let foundChannel = null;
  
  channels.subscribe(currentChannels => {
    foundChannel = currentChannels.find(channel => channel.id === id);
  })();
  
  return foundChannel;
}

/**
 * Update a channel
 * @param {string} id - Channel ID
 * @param {number[]} newData - New signal data
 * @param {string} processingMethod - Processing method used
 * @param {string[]} sourceChannelIds - IDs of source channels
 * @returns {boolean} - True if the channel was updated, false otherwise
 */
export function updateChannel(id, newData, processingMethod = null, sourceChannelIds = []) {
  let updated = false;
  
  channels.update(currentChannels => {
    return currentChannels.map(channel => {
      if (channel.id === id) {
        channel.updateData(newData, processingMethod, sourceChannelIds);
        updated = true;
      }
      return channel;
    });
  });
  
  return updated;
}

/**
 * Remove a channel
 * @param {string} id - Channel ID
 * @returns {boolean} - True if the channel was removed, false otherwise
 */
export function removeChannel(id) {
  let removed = false;
  
  channels.update(currentChannels => {
    const initialLength = currentChannels.length;
    const filteredChannels = currentChannels.filter(channel => channel.id !== id);
    removed = filteredChannels.length < initialLength;
    return filteredChannels;
  });
  
  return removed;
}

/**
 * Process a channel and create a new one with the result
 * @param {string} sourceChannelId - Source channel ID
 * @param {Function} processorFn - Processing function
 * @param {string} newChannelName - Name for the new channel
 * @param {Object} processorParams - Parameters for the processor function
 * @returns {Channel|null} - The created channel or null if the source channel was not found
 */
export function processChannel(sourceChannelId, processorFn, newChannelName, processorParams = {}) {
  const sourceChannel = getChannelById(sourceChannelId);
  
  if (!sourceChannel) {
    return null;
  }
  
  // Apply the processor function to the source channel data
  const processedData = processorFn(sourceChannel.data, ...Object.values(processorParams));
  
  // Create a new channel with the processed data
  const newChannel = addChannel(
    newChannelName, 
    processedData, 
    sourceChannel.sampleRate
  );
  
  // Update metadata
  newChannel.processingMethod = processorFn.name;
  newChannel.sourceChannelIds = [sourceChannelId];
  
  return newChannel;
}