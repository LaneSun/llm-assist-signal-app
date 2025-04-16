/**
 * Channel class to store signal data and metadata
 */
export class Channel {
  constructor(name, data = [], sampleRate = 1000) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.data = data;
    this.sampleRate = sampleRate;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.sourceChannelIds = [];
    this.processingMethod = null;
  }

  /**
   * Get statistics about the channel
   */
  getStats() {
    if (this.data.length === 0) {
      return {
        length: 0,
        min: 0,
        max: 0,
        mean: 0,
        rms: 0,
        duration: 0
      };
    }

    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const sum = this.data.reduce((acc, val) => acc + val, 0);
    const mean = sum / this.data.length;
    const squareSum = this.data.reduce((acc, val) => acc + val * val, 0);
    const rms = Math.sqrt(squareSum / this.data.length);
    const duration = this.data.length / this.sampleRate;

    return {
      length: this.data.length,
      min,
      max,
      mean,
      rms,
      duration
    };
  }

  /**
   * Update the channel data
   */
  updateData(newData, processingMethod = null, sourceChannelIds = []) {
    this.data = newData;
    this.updatedAt = new Date();
    
    if (processingMethod) {
      this.processingMethod = processingMethod;
    }
    
    if (sourceChannelIds.length > 0) {
      this.sourceChannelIds = sourceChannelIds;
    }
  }
}