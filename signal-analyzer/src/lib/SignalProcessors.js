import FFT from 'fft-js';

/**
 * Apply a moving average filter to a signal
 * @param {number[]} signal - Input signal
 * @param {number} windowSize - Size of the moving average window
 * @returns {number[]} - Filtered signal
 */
export function movingAverage(signal, windowSize) {
  if (windowSize <= 1 || windowSize > signal.length) {
    return [...signal];
  }

  const result = [];
  let sum = 0;

  // Initialize the sum with the first window
  for (let i = 0; i < windowSize; i++) {
    if (i < signal.length) {
      sum += signal[i];
    }
  }

  // Calculate moving average
  for (let i = 0; i < signal.length; i++) {
    if (i >= windowSize) {
      sum = sum - signal[i - windowSize] + signal[i];
    }
    result.push(sum / Math.min(windowSize, i + 1));
  }

  return result;
}

/**
 * Apply a low-pass filter to a signal
 * @param {number[]} signal - Input signal
 * @param {number} cutoffFrequency - Cutoff frequency in Hz
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {number[]} - Filtered signal
 */
export function lowPassFilter(signal, cutoffFrequency, sampleRate) {
  // Simple first-order IIR filter
  const dt = 1 / sampleRate;
  const RC = 1 / (2 * Math.PI * cutoffFrequency);
  const alpha = dt / (RC + dt);

  const result = [];
  let y = signal[0] || 0;

  for (let i = 0; i < signal.length; i++) {
    y = y + alpha * (signal[i] - y);
    result.push(y);
  }

  return result;
}

/**
 * Apply a high-pass filter to a signal
 * @param {number[]} signal - Input signal
 * @param {number} cutoffFrequency - Cutoff frequency in Hz
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {number[]} - Filtered signal
 */
export function highPassFilter(signal, cutoffFrequency, sampleRate) {
  // Simple first-order IIR filter
  const dt = 1 / sampleRate;
  const RC = 1 / (2 * Math.PI * cutoffFrequency);
  const alpha = RC / (RC + dt);

  const result = [];
  let y_prev = 0;
  let x_prev = signal[0] || 0;

  for (let i = 0; i < signal.length; i++) {
    const x = signal[i];
    const y = alpha * (y_prev + x - x_prev);
    result.push(y);
    y_prev = y;
    x_prev = x;
  }

  return result;
}

/**
 * Calculate the Fast Fourier Transform (FFT) of a signal
 * @param {number[]} signal - Input signal
 * @returns {number[]} - Magnitude spectrum
 */
export function calculateFFT(signal) {
  // Ensure signal length is a power of 2
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(signal.length)));
  const paddedSignal = [...signal];
  
  // Zero-padding
  while (paddedSignal.length < nextPow2) {
    paddedSignal.push(0);
  }

  // Calculate FFT
  const fftResult = FFT.fft(paddedSignal);
  
  // Calculate magnitude spectrum
  const magnitudes = FFT.util.fftMag(fftResult);
  
  // Return only the first half (positive frequencies)
  return magnitudes.slice(0, Math.floor(magnitudes.length / 2));
}

/**
 * Calculate the power spectrum of a signal
 * @param {number[]} signal - Input signal
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {Object} - Object containing frequencies and power spectrum
 */
export function calculatePowerSpectrum(signal, sampleRate) {
  const magnitudes = calculateFFT(signal);
  const n = magnitudes.length;
  
  // Calculate frequencies
  const frequencies = Array.from({ length: n }, (_, i) => i * sampleRate / (2 * n));
  
  // Calculate power spectrum (magnitude squared)
  const powerSpectrum = magnitudes.map(mag => mag * mag);
  
  return { frequencies, powerSpectrum };
}

/**
 * Differentiate a signal
 * @param {number[]} signal - Input signal
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {number[]} - Differentiated signal
 */
export function differentiate(signal, sampleRate) {
  if (signal.length <= 1) {
    return new Array(signal.length).fill(0);
  }

  const result = [];
  const dt = 1 / sampleRate;

  // First point: forward difference
  result.push((signal[1] - signal[0]) / dt);

  // Middle points: central difference
  for (let i = 1; i < signal.length - 1; i++) {
    result.push((signal[i + 1] - signal[i - 1]) / (2 * dt));
  }

  // Last point: backward difference
  result.push((signal[signal.length - 1] - signal[signal.length - 2]) / dt);

  return result;
}

/**
 * Integrate a signal
 * @param {number[]} signal - Input signal
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {number[]} - Integrated signal
 */
export function integrate(signal, sampleRate) {
  const result = [];
  const dt = 1 / sampleRate;
  let sum = 0;

  for (let i = 0; i < signal.length; i++) {
    sum += signal[i] * dt;
    result.push(sum);
  }

  return result;
}