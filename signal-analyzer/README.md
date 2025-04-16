# Signal Analyzer

A Svelte application for signal generation, processing, and analysis.

## Features

- **Signal Generation**: Create various types of signals including:
  - Sine waves
  - Square waves
  - Triangle waves
  - Sawtooth waves
  - White noise
  - Pulse signals

- **Signal Processing**: Apply various processing methods to signals:
  - Moving average filter
  - Low-pass filter
  - High-pass filter
  - Fast Fourier Transform (FFT)
  - Power spectrum analysis
  - Differentiation
  - Integration

- **Channel Management**: Organize signals in channels with:
  - Channel statistics (length, min, max, mean, RMS)
  - Signal visualization
  - Channel metadata (creation time, processing history)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:12000`

## Usage

### Generating Signals

1. Select a signal type from the dropdown menu
2. Configure the signal parameters (frequency, amplitude, etc.)
3. Enter a name for the channel
4. Click "Generate Signal"

### Processing Signals

1. Select a source channel from the dropdown menu
2. Choose a processing method
3. Configure the processing parameters
4. Enter a name for the new channel (or use the default)
5. Click "Process Signal"

### Viewing Channels

- All channels are displayed in the Channels section
- Click on a channel to view detailed information and a larger visualization
- Use the delete button (×) to remove a channel

## Technologies Used

- [Svelte](https://svelte.dev/) - Frontend framework
- [Chart.js](https://www.chartjs.org/) - Visualization library
- [FFT-JS](https://www.npmjs.com/package/fft-js) - Fast Fourier Transform implementation

## License

This project is licensed under the MIT License.
