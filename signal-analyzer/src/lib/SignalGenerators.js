/**
 * Generate a sine wave signal
 * @param {number} length - Number of samples
 * @param {number} frequency - Frequency in Hz
 * @param {number} amplitude - Amplitude of the sine wave
 * @param {number} sampleRate - Sample rate in Hz
 * @param {number} phase - Phase offset in radians
 * @returns {number[]} - Array of signal values
 */
export function generateSineWave(length, frequency, amplitude = 1, sampleRate = 1000, phase = 0) {
  const signal = [];
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    signal.push(amplitude * Math.sin(2 * Math.PI * frequency * t + phase));
  }
  return signal;
}

/**
 * Generate a square wave signal
 * @param {number} length - Number of samples
 * @param {number} frequency - Frequency in Hz
 * @param {number} amplitude - Amplitude of the square wave
 * @param {number} sampleRate - Sample rate in Hz
 * @param {number} dutyCycle - Duty cycle (0-1)
 * @returns {number[]} - Array of signal values
 */
export function generateSquareWave(length, frequency, amplitude = 1, sampleRate = 1000, dutyCycle = 0.5) {
  const signal = [];
  const period = sampleRate / frequency;
  
  for (let i = 0; i < length; i++) {
    const t = i % period;
    signal.push(t < period * dutyCycle ? amplitude : -amplitude);
  }
  
  return signal;
}

/**
 * Generate a triangle wave signal
 * @param {number} length - Number of samples
 * @param {number} frequency - Frequency in Hz
 * @param {number} amplitude - Amplitude of the triangle wave
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {number[]} - Array of signal values
 */
export function generateTriangleWave(length, frequency, amplitude = 1, sampleRate = 1000) {
  const signal = [];
  const period = sampleRate / frequency;
  
  for (let i = 0; i < length; i++) {
    const t = i % period;
    const normalized = t / period;
    
    // Generate triangle wave
    let value;
    if (normalized < 0.5) {
      value = 2 * normalized;
    } else {
      value = 2 * (1 - normalized);
    }
    
    signal.push(amplitude * (2 * value - 1));
  }
  
  return signal;
}

/**
 * Generate a sawtooth wave signal
 * @param {number} length - Number of samples
 * @param {number} frequency - Frequency in Hz
 * @param {number} amplitude - Amplitude of the sawtooth wave
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {number[]} - Array of signal values
 */
export function generateSawtoothWave(length, frequency, amplitude = 1, sampleRate = 1000) {
  const signal = [];
  const period = sampleRate / frequency;
  
  for (let i = 0; i < length; i++) {
    const t = i % period;
    const normalized = t / period;
    signal.push(amplitude * (2 * normalized - 1));
  }
  
  return signal;
}

/**
 * Generate white noise
 * @param {number} length - Number of samples
 * @param {number} amplitude - Amplitude of the noise
 * @returns {number[]} - Array of signal values
 */
export function generateWhiteNoise(length, amplitude = 1) {
  const signal = [];
  
  for (let i = 0; i < length; i++) {
    signal.push(amplitude * (2 * Math.random() - 1));
  }
  
  return signal;
}

/**
 * Generate a pulse signal
 * @param {number} length - Number of samples
 * @param {number} pulsePosition - Position of the pulse (sample index)
 * @param {number} pulseWidth - Width of the pulse in samples
 * @param {number} amplitude - Amplitude of the pulse
 * @returns {number[]} - Array of signal values
 */
export function generatePulse(length, pulsePosition, pulseWidth = 1, amplitude = 1) {
  const signal = new Array(length).fill(0);
  
  for (let i = 0; i < pulseWidth; i++) {
    const index = pulsePosition + i;
    if (index >= 0 && index < length) {
      signal[index] = amplitude;
    }
  }
  
  return signal;
}