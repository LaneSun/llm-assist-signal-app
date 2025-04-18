import * as SignalGenerators from './SignalGenerators';
import * as SignalProcessors from './SignalProcessors';
import { addChannel, getChannelById, processChannel, channels } from './stores';
import { get } from 'svelte/store';

/**
 * 定义可供AI调用的工具函数
 */
export const signalTools = [
  {
    name: "generate_signal",
    description: "生成一个新的信号通道",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "信号通道的名称"
        },
        signal_type: {
          type: "string",
          enum: ["sine", "square", "triangle", "sawtooth", "noise", "pulse"],
          description: "信号类型：正弦波(sine)、方波(square)、三角波(triangle)、锯齿波(sawtooth)、噪声(noise)、脉冲(pulse)"
        },
        length: {
          type: "integer",
          description: "信号长度（样本数）",
          default: 1000
        },
        sample_rate: {
          type: "integer",
          description: "采样率（Hz）",
          default: 1000
        },
        amplitude: {
          type: "number",
          description: "信号幅度",
          default: 1
        },
        frequency: {
          type: "number",
          description: "信号频率（Hz），仅适用于周期性信号",
          default: 10
        },
        phase: {
          type: "number",
          description: "相位（弧度），仅适用于正弦波",
          default: 0
        },
        duty_cycle: {
          type: "number",
          description: "占空比（0-1），仅适用于方波",
          default: 0.5
        },
        pulse_position: {
          type: "integer",
          description: "脉冲位置（样本索引），仅适用于脉冲信号",
          default: 500
        },
        pulse_width: {
          type: "integer",
          description: "脉冲宽度（样本数），仅适用于脉冲信号",
          default: 10
        }
      },
      required: ["name", "signal_type"]
    },
    function: async (args) => {
      const { 
        name, 
        signal_type, 
        length = 1000, 
        sample_rate = 1000, 
        amplitude = 1, 
        frequency = 10, 
        phase = 0, 
        duty_cycle = 0.5,
        pulse_position = 500,
        pulse_width = 10
      } = args;
      
      let signalData = [];
      
      switch (signal_type) {
        case 'sine':
          signalData = SignalGenerators.generateSineWave(length, frequency, amplitude, sample_rate, phase);
          break;
        case 'square':
          signalData = SignalGenerators.generateSquareWave(length, frequency, amplitude, sample_rate, duty_cycle);
          break;
        case 'triangle':
          signalData = SignalGenerators.generateTriangleWave(length, frequency, amplitude, sample_rate);
          break;
        case 'sawtooth':
          signalData = SignalGenerators.generateSawtoothWave(length, frequency, amplitude, sample_rate);
          break;
        case 'noise':
          signalData = SignalGenerators.generateWhiteNoise(length, amplitude);
          break;
        case 'pulse':
          signalData = SignalGenerators.generatePulse(length, pulse_position, pulse_width, amplitude);
          break;
        default:
          throw new Error(`不支持的信号类型: ${signal_type}`);
      }
      
      const channel = addChannel(name, signalData, sample_rate);
      
      return {
        channel_id: channel.id,
        name: channel.name,
        length: signalData.length,
        sample_rate: sample_rate,
        signal_type: signal_type,
        message: `成功生成${name}信号通道，ID: ${channel.id}`
      };
    }
  },
  
  {
    name: "process_signal",
    description: "处理现有信号并创建新的信号通道",
    parameters: {
      type: "object",
      properties: {
        source_channel_id: {
          type: "string",
          description: "源信号通道的ID"
        },
        new_channel_name: {
          type: "string",
          description: "新信号通道的名称"
        },
        processor_type: {
          type: "string",
          enum: ["moving_average", "low_pass", "high_pass", "fft", "differentiate", "integrate"],
          description: "处理器类型：移动平均(moving_average)、低通滤波(low_pass)、高通滤波(high_pass)、FFT(fft)、微分(differentiate)、积分(integrate)"
        },
        window_size: {
          type: "integer",
          description: "移动平均窗口大小，仅适用于移动平均处理器",
          default: 10
        },
        cutoff_frequency: {
          type: "number",
          description: "截止频率（Hz），仅适用于低通和高通滤波器",
          default: 50
        }
      },
      required: ["source_channel_id", "new_channel_name", "processor_type"]
    },
    function: async (args) => {
      const { 
        source_channel_id, 
        new_channel_name, 
        processor_type, 
        window_size = 10, 
        cutoff_frequency = 50 
      } = args;
      
      const sourceChannel = getChannelById(source_channel_id);
      if (!sourceChannel) {
        throw new Error(`找不到ID为${source_channel_id}的信号通道`);
      }
      
      let processorFn;
      let processorParams = {};
      
      switch (processor_type) {
        case 'moving_average':
          processorFn = SignalProcessors.movingAverage;
          processorParams = { windowSize: window_size };
          break;
        case 'low_pass':
          processorFn = SignalProcessors.lowPassFilter;
          processorParams = { cutoffFrequency: cutoff_frequency, sampleRate: sourceChannel.sampleRate };
          break;
        case 'high_pass':
          processorFn = SignalProcessors.highPassFilter;
          processorParams = { cutoffFrequency: cutoff_frequency, sampleRate: sourceChannel.sampleRate };
          break;
        case 'fft':
          processorFn = SignalProcessors.calculateFFT;
          break;
        case 'differentiate':
          processorFn = SignalProcessors.differentiate;
          processorParams = { sampleRate: sourceChannel.sampleRate };
          break;
        case 'integrate':
          processorFn = SignalProcessors.integrate;
          processorParams = { sampleRate: sourceChannel.sampleRate };
          break;
        default:
          throw new Error(`不支持的处理器类型: ${processor_type}`);
      }
      
      const newChannel = processChannel(source_channel_id, processorFn, new_channel_name, processorParams);
      
      return {
        channel_id: newChannel.id,
        name: newChannel.name,
        source_channel_id: source_channel_id,
        processor_type: processor_type,
        length: newChannel.data.length,
        message: `成功处理信号并创建新通道${new_channel_name}，ID: ${newChannel.id}`
      };
    }
  },
  
  {
    name: "list_channels",
    description: "列出所有可用的信号通道",
    parameters: {
      type: "object",
      properties: {},
      required: []
    },
    function: async () => {
      // 获取当前所有通道
      const allChannels = get(channels);
      
      return {
        channels: allChannels.map(channel => ({
          id: channel.id,
          name: channel.name,
          length: channel.data.length,
          sample_rate: channel.sampleRate,
          created_at: channel.createdAt,
          processing_method: channel.processingMethod,
          stats: channel.getStats()
        })),
        count: allChannels.length,
        message: `找到${allChannels.length}个信号通道`
      };
    }
  },
  
  {
    name: "get_channel_info",
    description: "获取特定信号通道的详细信息",
    parameters: {
      type: "object",
      properties: {
        channel_id: {
          type: "string",
          description: "信号通道的ID"
        }
      },
      required: ["channel_id"]
    },
    function: async (args) => {
      const { channel_id } = args;
      
      const channel = getChannelById(channel_id);
      if (!channel) {
        throw new Error(`找不到ID为${channel_id}的信号通道`);
      }
      
      const stats = channel.getStats();
      
      return {
        id: channel.id,
        name: channel.name,
        length: channel.data.length,
        sample_rate: channel.sampleRate,
        created_at: channel.createdAt,
        updated_at: channel.updatedAt,
        processing_method: channel.processingMethod,
        source_channel_ids: channel.sourceChannelIds,
        stats: stats,
        message: `成功获取通道${channel.name}的信息`
      };
    }
  }
];

/**
 * 将工具函数转换为OpenAI工具格式
 */
export function getOpenAITools() {
  return signalTools.map(tool => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));
}

/**
 * 执行工具函数
 */
export async function executeToolFunction(name, args) {
  const tool = signalTools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`找不到名为${name}的工具函数`);
  }
  
  return await tool.function(args);
}