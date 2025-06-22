// 精度配置
export const precisions = [
  { name: "FP32", value: "FP32" },
  { name: "FP16", value: "FP16" },
  { name: "FP8", value: "FP8" },
  { name: "INT8", value: "INT8" },
  { name: "INT4", value: "INT4" },
]

// GPU完整规格信息 - 包含内存和性能数据
export const gpuModels = [
  // NVIDIA 最新架构 - Blackwell
  { name: "NVIDIA GB200", memory: 192, performance: 2500, architecture: "Grace Blackwell", category: "数据中心" },
  { name: "NVIDIA HGX B200 8 GPU", memory: 1536, performance: 20000, architecture: "Blackwell", category: "集群" }, // 8x192GB
  { name: "NVIDIA HGX B200 4 GPU", memory: 768, performance: 10000, architecture: "Blackwell", category: "集群" }, // 4x192GB
  { name: "NVIDIA HGX B100 8 GPU", memory: 1536, performance: 16000, architecture: "Blackwell", category: "集群" }, // 8x192GB
  { name: "NVIDIA HGX B100 4 GPU", memory: 768, performance: 8000, architecture: "Blackwell", category: "集群" }, // 4x192GB
  { name: "NVIDIA B200", memory: 192, performance: 2500, architecture: "Blackwell", category: "数据中心" },
  { name: "NVIDIA B100", memory: 192, performance: 2000, architecture: "Blackwell", category: "数据中心" },
  
  // NVIDIA Hopper架构
  { name: "NVIDIA HGX H200 8 GPU", memory: 1128, performance: 8000, architecture: "Hopper", category: "集群" }, // 8x141GB
  { name: "NVIDIA HGX H200 4 GPU", memory: 564, performance: 4000, architecture: "Hopper", category: "集群" }, // 4x141GB
  { name: "NVIDIA HGX H100 8 GPU", memory: 640, performance: 8000, architecture: "Hopper", category: "集群" }, // 8x80GB
  { name: "NVIDIA HGX H100 4 GPU", memory: 320, performance: 4000, architecture: "Hopper", category: "集群" }, // 4x80GB
  { name: "NVIDIA H200", memory: 141, performance: 1000, architecture: "Hopper", category: "数据中心" },
  { name: "NVIDIA H100", memory: 80, performance: 1000, architecture: "Hopper", category: "数据中心" },
  { name: "NVIDIA H20", memory: 96, performance: 296, architecture: "Hopper", category: "数据中心" }, // 中国特供版

  // NVIDIA Ada Lovelace架构
  { name: "NVIDIA L40", memory: 48, performance: 362, architecture: "Ada Lovelace"},
  { name: "NVIDIA L20", memory: 48, performance: 240, architecture: "Ada Lovelace"},
  { name: "NVIDIA L2", memory: 24, performance: 120, architecture: "Ada Lovelace"},
  { name: "NVIDIA RTX 6000 Ada", memory: 48, performance: 362, architecture: "Ada Lovelace"},
  { name: "NVIDIA RTX 5000 Ada", memory: 32, performance: 240, architecture: "Ada Lovelace"},
  { name: "NVIDIA RTX 4000 Ada", memory: 20, performance: 120, architecture: "Ada Lovelace"},
  { name: "NVIDIA RTX 3000 Ada", memory: 12, performance: 80, architecture: "Ada Lovelace"},

  // NVIDIA RTX 5000系列 (Blackwell消费级)
  { name: "NVIDIA RTX 5090", memory: 32, performance: 280, architecture: "Blackwell", category: "消费级" },
  { name: "NVIDIA RTX 5080", memory: 16, performance: 180, architecture: "Blackwell", category: "消费级" },
  { name: "NVIDIA RTX 5070 Ti", memory: 16, performance: 140, architecture: "Blackwell", category: "消费级" },
  { name: "NVIDIA RTX 5070", memory: 12, performance: 120, architecture: "Blackwell", category: "消费级" },

  // NVIDIA RTX 4000系列
  { name: "NVIDIA RTX 4090", memory: 24, performance: 165, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4080 SUPER", memory: 16, performance: 130, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4080", memory: 16, performance: 125, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4070 Ti Super", memory: 16, performance: 110, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4070 Ti", memory: 12, performance: 100, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4070", memory: 12, performance: 90, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4060 Ti (16GB)", memory: 16, performance: 70, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4060 Ti (8GB)", memory: 8, performance: 70, architecture: "Ada Lovelace", category: "消费级" },
  { name: "NVIDIA RTX 4060", memory: 8, performance: 60, architecture: "Ada Lovelace", category: "消费级" },

  // NVIDIA RTX 3000系列
  { name: "NVIDIA RTX 3090 Ti", memory: 24, performance: 80, architecture: "Ampere", category: "消费级" },
  { name: "NVIDIA RTX 3090", memory: 24, performance: 71, architecture: "Ampere", category: "消费级" },
  { name: "NVIDIA RTX 3080 Ti", memory: 12, performance: 65, architecture: "Ampere", category: "消费级" },
  { name: "NVIDIA RTX 3080", memory: 10, performance: 60, architecture: "Ampere", category: "消费级" },
  { name: "NVIDIA RTX 3070 Ti", memory: 8, performance: 50, architecture: "Ampere", category: "消费级" },

  // NVIDIA Tesla/数据中心系列
  { name: "NVIDIA A100 (80GB)", memory: 80, performance: 312, architecture: "Ampere", category: "数据中心" },
  { name: "NVIDIA A100 (40GB)", memory: 40, performance: 312, architecture: "Ampere", category: "数据中心" },
  { name: "NVIDIA A40", memory: 48, performance: 150, architecture: "Ampere"},
  { name: "NVIDIA A30", memory: 24, performance: 130, architecture: "Ampere", category: "数据中心" },
  { name: "NVIDIA A10", memory: 24, performance: 125, architecture: "Ampere", category: "数据中心" },
  { name: "NVIDIA V100S", memory: 32, performance: 130, architecture: "Volta", category: "数据中心" },
  { name: "NVIDIA V100 (32GB)", memory: 32, performance: 125, architecture: "Volta", category: "数据中心" },
  { name: "NVIDIA V100 (16GB)", memory: 16, performance: 125, architecture: "Volta", category: "数据中心" },
  { name: "NVIDIA T4", memory: 16, performance: 65, architecture: "Turing", category: "推理专用" },
  { name: "NVIDIA P100 (16GB)", memory: 16, performance: 21, architecture: "Pascal", category: "数据中心" },
  { name: "NVIDIA P40", memory: 24, performance: 12, architecture: "Pascal", category: "数据中心" },
  { name: "NVIDIA M60", memory: 16, performance: 9, architecture: "Maxwell", category: "数据中心" },
  { name: "NVIDIA M40 (24GB)", memory: 24, performance: 7, architecture: "Maxwell", category: "数据中心" },
  { name: "NVIDIA K80", memory: 24, performance: 5, architecture: "Kepler", category: "数据中心" },

  // NVIDIA 经典显卡
  { name: "NVIDIA TITAN V", memory: 12, performance: 110, architecture: "Volta", category: "消费级" },
  { name: "NVIDIA GTX 1080 Ti", memory: 11, performance: 35, architecture: "Pascal", category: "消费级" },
  { name: "NVIDIA TITAN RTX", memory: 24, performance: 130, architecture: "Turing", category: "消费级" },

  // AMD 数据中心/专业卡
  { name: "AMD Instinct MI300X", memory: 192, performance: 1300, architecture: "CDNA 3", category: "数据中心" },
  { name: "AMD Instinct MI300A", memory: 128, performance: 1000, architecture: "CDNA 3", category: "数据中心" },
  { name: "AMD Instinct MI250X", memory: 128, performance: 380, architecture: "CDNA 2", category: "数据中心" },
  { name: "AMD Instinct MI250", memory: 128, performance: 360, architecture: "CDNA 2", category: "数据中心" },
  { name: "AMD Instinct MI210", memory: 64, performance: 180, architecture: "CDNA 2", category: "数据中心" },
  { name: "AMD Instinct MI100", memory: 32, performance: 150, architecture: "CDNA 1", category: "数据中心" },
  { name: "AMD Instinct MI60", memory: 32, performance: 120, architecture: "Vega", category: "数据中心" },
  { name: "AMD Instinct MI50", memory: 32, performance: 100, architecture: "Vega", category: "数据中心" },
  { name: "AMD Instinct MI25", memory: 16, performance: 50, architecture: "Vega", category: "数据中心" },

  // AMD 专业卡
  { name: "AMD Radeon PRO VII", memory: 16, performance: 60, architecture: "Vega"},
  { name: "AMD Radeon PRO W7900", memory: 48, performance: 120, architecture: "RDNA 3"},
  { name: "AMD Radeon PRO W7800", memory: 32, performance: 90, architecture: "RDNA 3"},
  { name: "AMD Radeon PRO W6900X", memory: 32, performance: 80, architecture: "RDNA 2"},
  { name: "AMD Radeon PRO W6800", memory: 32, performance: 70, architecture: "RDNA 2"},
  { name: "AMD Radeon PRO W6600", memory: 8, performance: 50, architecture: "RDNA 2"},
  { name: "AMD Radeon PRO W5700", memory: 8, performance: 45, architecture: "RDNA 1"},
  { name: "AMD Radeon PRO W5500", memory: 8, performance: 40, architecture: "RDNA 1"},

  // AMD RDNA 3架构消费级
  { name: "AMD Radeon RX 7900 XTX", memory: 24, performance: 100, architecture: "RDNA 3", category: "消费级" },
  { name: "AMD Radeon RX 7900 XT", memory: 20, performance: 85, architecture: "RDNA 3", category: "消费级" },
  { name: "AMD Radeon RX 7800 XT", memory: 16, performance: 70, architecture: "RDNA 3", category: "消费级" },
  { name: "AMD Radeon RX 7700 XT", memory: 12, performance: 60, architecture: "RDNA 3", category: "消费级" },
  { name: "AMD Radeon RX 7600 XT", memory: 16, performance: 50, architecture: "RDNA 3", category: "消费级" },
  { name: "AMD Radeon RX 7600", memory: 8, performance: 45, architecture: "RDNA 3", category: "消费级" },

  // AMD RDNA 2架构消费级
  { name: "AMD Radeon RX 6950 XT", memory: 16, performance: 50, architecture: "RDNA 2", category: "消费级" },
  { name: "AMD Radeon RX 6900 XT", memory: 16, performance: 45, architecture: "RDNA 2", category: "消费级" },
  { name: "AMD Radeon RX 6800 XT", memory: 16, performance: 40, architecture: "RDNA 2", category: "消费级" },
  { name: "AMD Radeon RX 6800", memory: 16, performance: 38, architecture: "RDNA 2", category: "消费级" },
  { name: "AMD Radeon RX 6750 XT", memory: 12, performance: 35, architecture: "RDNA 2", category: "消费级" },
  { name: "AMD Radeon RX 6700 XT", memory: 12, performance: 32, architecture: "RDNA 2", category: "消费级" },
  { name: "AMD Radeon RX 6650 XT", memory: 8, performance: 30, architecture: "RDNA 2", category: "消费级" },
  { name: "AMD Radeon RX 6600 XT", memory: 8, performance: 28, architecture: "RDNA 2", category: "消费级" },

  // AMD 经典显卡
  { name: "AMD Radeon VII", memory: 16, performance: 25, architecture: "Vega", category: "消费级" },
  { name: "AMD Radeon RX 5700 XT", memory: 8, performance: 20, architecture: "RDNA 1", category: "消费级" },
  { name: "AMD Radeon RX 5700", memory: 8, performance: 18, architecture: "RDNA 1", category: "消费级" },

  // Apple Silicon (统一内存架构)
  { name: "Apple M4 Max (128GB)", memory: 128, performance: 150, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 Max (64GB)", memory: 64, performance: 140, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 Max (36GB)", memory: 36, performance: 130, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 Pro (64GB)", memory: 64, performance: 100, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 Pro (48GB)", memory: 48, performance: 90, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 Pro (24GB)", memory: 24, performance: 80, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 (32GB)", memory: 32, performance: 60, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 (24GB)", memory: 24, performance: 55, architecture: "M4", category: "Apple Silicon" },
  { name: "Apple M4 (16GB)", memory: 16, performance: 50, architecture: "M4", category: "Apple Silicon" },

  { name: "Apple M3 Ultra (192GB)", memory: 192, performance: 140, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 Ultra (128GB)", memory: 128, performance: 130, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 Max (128GB)", memory: 128, performance: 120, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 Max (96GB)", memory: 96, performance: 110, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 Pro (36GB)", memory: 36, performance: 80, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 Pro (18GB)", memory: 18, performance: 70, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 (24GB)", memory: 24, performance: 50, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 (16GB)", memory: 16, performance: 45, architecture: "M3", category: "Apple Silicon" },
  { name: "Apple M3 (8GB)", memory: 8, performance: 40, architecture: "M3", category: "Apple Silicon" },

  { name: "Apple M2 Ultra (192GB)", memory: 192, performance: 120, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 Ultra (128GB)", memory: 128, performance: 110, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 Max (96GB)", memory: 96, performance: 100, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 Max (64GB)", memory: 64, performance: 90, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 Pro (32GB)", memory: 32, performance: 70, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 Pro (16GB)", memory: 16, performance: 60, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 (24GB)", memory: 24, performance: 45, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 (16GB)", memory: 16, performance: 40, architecture: "M2", category: "Apple Silicon" },
  { name: "Apple M2 (8GB)", memory: 8, performance: 35, architecture: "M2", category: "Apple Silicon" },

  { name: "Apple M1 Ultra (128GB)", memory: 128, performance: 90, architecture: "M1", category: "Apple Silicon" },
  { name: "Apple M1 Max (64GB)", memory: 64, performance: 80, architecture: "M1", category: "Apple Silicon" },
  { name: "Apple M1 Max (32GB)", memory: 32, performance: 70, architecture: "M1", category: "Apple Silicon" },
  { name: "Apple M1 Pro (32GB)", memory: 32, performance: 50, architecture: "M1", category: "Apple Silicon" },
  { name: "Apple M1 Pro (16GB)", memory: 16, performance: 45, architecture: "M1", category: "Apple Silicon" },
  { name: "Apple M1 (16GB)", memory: 16, performance: 35, architecture: "M1", category: "Apple Silicon" },
  { name: "Apple M1 (8GB)", memory: 8, performance: 30, architecture: "M1", category: "Apple Silicon" },

  // Huawei Ascend系列
  { name: "Huawei Ascend 910B", memory: 64, performance: 320, architecture: "昇腾", category: "数据中心" },
  { name: "Huawei Ascend 910A", memory: 32, performance: 280, architecture: "昇腾", category: "数据中心" },
  { name: "Huawei Ascend 910", memory: 32, performance: 256, architecture: "昇腾", category: "数据中心" },
  { name: "Huawei Ascend 710", memory: 32, performance: 128, architecture: "昇腾", category: "推理专用" },
  { name: "Huawei Ascend 310P", memory: 16, performance: 64, architecture: "昇腾", category: "推理专用" },
  { name: "Huawei Ascend 310", memory: 8, performance: 32, architecture: "昇腾", category: "推理专用" }
].sort((a, b) => b.memory - a.memory) // 按显存大小排序

// 统一的模型数据结构
export interface ModelInfo {
  name: string;
  parameters: string; // 显示用的参数量字符串，如 "7B"
  parametersNum: number; // 用于计算的数值，如 7
  value: string; // 用于选择器的值
  d_model: number;
  n_layers: number;
  activeParams?: number; // MoE模型的激活参数数量
  isMoE?: boolean;
  source: string;
  verificationUrl?: string;
}

// 统一的模型数据 - 包含架构信息的完整模型列表
export const MODELS: ModelInfo[] = [
  // DeepSeek 系列
  {
    name: "DeepSeek-R1",
    parameters: "671B",
    parametersNum: 671,
    value: "deepseek-r1",
    d_model: 18432,
    n_layers: 144,
    activeParams: 37,
    isMoE: true,
    source: 'DeepSeek-R1 technical report',
    verificationUrl: 'https://github.com/deepseek-ai/DeepSeek-R1'
  },
  {
    name: "DeepSeek-V3",
    parameters: "671B",
    parametersNum: 671,
    value: "deepseek-v3",
    d_model: 18432,
    n_layers: 144,
    activeParams: 37,
    isMoE: true,
    source: 'DeepSeek-V3 technical report',
    verificationUrl: 'https://github.com/deepseek-ai/DeepSeek-V3'
  },

  // Llama 4 系列
  {
    name: "Llama 4 Maverick",
    parameters: "400B",
    parametersNum: 400,
    value: "llama-4-maverick",
    d_model: 16384,
    n_layers: 120,
    source: 'Llama-4-Maverick estimated architecture'
  },

  // Llama 3 系列
  {
    name: "Llama 3.1 405B",
    parameters: "405B",
    parametersNum: 405,
    value: "llama-3.1-405b",
    d_model: 16384,
    n_layers: 126,
    source: 'Llama-3.1-405B official config',
    verificationUrl: 'https://huggingface.co/meta-llama/Llama-3.1-405B/blob/main/config.json'
  },
  {
    name: "Llama 4 Scout",
    parameters: "109B",
    parametersNum: 109,
    value: "llama-4-scout",
    d_model: 9216,
    n_layers: 80,
    source: 'Llama-4-Scout estimated architecture'
  },
  {
    name: "Llama 3.1 70B",
    parameters: "70B",
    parametersNum: 70,
    value: "llama-3.1-70b",
    d_model: 8192,
    n_layers: 80,
    source: 'Llama-2-70B official config',
    verificationUrl: 'https://huggingface.co/meta-llama/Llama-2-70b-hf/blob/main/config.json'
  },
  {
    name: "Llama-65B",
    parameters: "65B",
    parametersNum: 65,
    value: "llama-65b",
    d_model: 8192,
    n_layers: 80,
    source: 'Estimated based on 70B architecture'
  },
  {
    name: "Llama-33B",
    parameters: "33B",
    parametersNum: 33,
    value: "llama-33b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "Llama-13B",
    parameters: "13B",
    parametersNum: 13,
    value: "llama-13b",
    d_model: 5120,
    n_layers: 40,
    source: 'Llama-2-13B official config',
    verificationUrl: 'https://huggingface.co/meta-llama/Llama-2-13b-hf/blob/main/config.json'
  },
  {
    name: "Llama 3.1 8B",
    parameters: "8B",
    parametersNum: 8,
    value: "llama-3.1-8b",
    d_model: 4096,
    n_layers: 32,
    source: 'Llama-3-8B official config',
    verificationUrl: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B/blob/main/config.json'
  },
  {
    name: "Llama-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "llama-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Llama-2-7B official config',
    verificationUrl: 'https://huggingface.co/meta-llama/Llama-2-7b-hf/blob/main/config.json'
  },

  // Qwen 系列
  {
    name: "Qwen3-235B-A22B",
    parameters: "235B",
    parametersNum: 235,
    value: "qwen3-235b-a22b",
    d_model: 14848,
    n_layers: 80,
    activeParams: 22,
    isMoE: true,
    source: 'Qwen3-235B-A22B technical report',
    verificationUrl: 'https://qwenlm.github.io/blog/qwen3/'
  },
  {
    name: "Qwen2.5-Math-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2.5-math-72b",
    d_model: 8192,
    n_layers: 80,
    source: 'Estimated based on 70B architecture'
  },
  {
    name: "Qwen2.5-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2.5-72b",
    d_model: 8192,
    n_layers: 80,
    source: 'Estimated based on 70B architecture'
  },
  {
    name: "Qwen2-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2-72b",
    d_model: 8192,
    n_layers: 80,
    source: 'Estimated based on 70B architecture'
  },
  {
    name: "Qwen QwQ-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen-qwq-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "Qwen2.5-Coder-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2.5-coder-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "Qwen3-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen3-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "Qwen2.5-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2.5-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "Qwen2-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "Qwen3-30B-A3B",
    parameters: "30B",
    parametersNum: 30,
    value: "qwen3-30b-a3b",
    d_model: 6656,
    n_layers: 60,
    activeParams: 3,
    isMoE: true,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "Qwen2.5-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen2.5-14b",
    d_model: 5120,
    n_layers: 40,
    source: 'Estimated based on 13B architecture'
  },
  {
    name: "Qwen3-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen3-14b",
    d_model: 5120,
    n_layers: 40,
    source: 'Estimated based on 13B architecture'
  },
  {
    name: "Qwen2-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen2-14b",
    d_model: 5120,
    n_layers: 40,
    source: 'Estimated based on 13B architecture'
  },
  {
    name: "Qwen3-8B",
    parameters: "8B",
    parametersNum: 8,
    value: "qwen3-8b",
    d_model: 4096,
    n_layers: 32,
    source: 'Estimated based on 8B architecture'
  },
  {
    name: "Qwen2.5-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "qwen2.5-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Estimated based on 7B architecture'
  },
  {
    name: "Qwen2-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "qwen2-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Estimated based on 7B architecture'
  },
  {
    name: "Qwen3-4B",
    parameters: "4B",
    parametersNum: 4,
    value: "qwen3-4b",
    d_model: 2560,
    n_layers: 28,
    source: 'Estimated for 4B model'
  },
  {
    name: "Qwen2.5-3B",
    parameters: "3B",
    parametersNum: 3,
    value: "qwen2.5-3b",
    d_model: 2048,
    n_layers: 28,
    source: 'Estimated for 3B model'
  },
  {
    name: "Qwen2.5-1.5B",
    parameters: "1.5B",
    parametersNum: 1.5,
    value: "qwen2.5-1.5b",
    d_model: 1536,
    n_layers: 24,
    source: 'Estimated for 1.5B model'
  },
  {
    name: "Qwen2.5-0.5B",
    parameters: "0.5B",
    parametersNum: 0.5,
    value: "qwen2.5-0.5b",
    d_model: 1024,
    n_layers: 16,
    source: 'Estimated for 0.5B model'
  },

  // 其他热门模型
  {
    name: "Claude-3.5-Sonnet",
    parameters: "200B",
    parametersNum: 200,
    value: "claude-3.5-sonnet",
    d_model: 14848,
    n_layers: 80,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "GPT-4",
    parameters: "180B",
    parametersNum: 180,
    value: "gpt-4",
    d_model: 14848,
    n_layers: 80,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "GPT-3.5",
    parameters: "175B",
    parametersNum: 175,
    value: "gpt-3.5",
    d_model: 12288,
    n_layers: 96,
    source: 'Estimated based on scaling laws'
  },
  {
    name: "ChatGLM-6B",
    parameters: "6B",
    parametersNum: 6,
    value: "chatglm-6b",
    d_model: 4096,
    n_layers: 28,
    source: 'Estimated for 6B model'
  },
  {
    name: "Baichuan2-13B",
    parameters: "13B",
    parametersNum: 13,
    value: "baichuan2-13b",
    d_model: 5120,
    n_layers: 40,
    source: 'Estimated based on 13B architecture'
  },
  {
    name: "Baichuan2-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "baichuan2-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Estimated based on 7B architecture'
  }
]

// 为了向后兼容，保留 modelExamples 导出
export const modelExamples = MODELS.map(model => ({
  name: model.name,
  parameters: model.parameters,
  value: model.value
}))

// 为了向后兼容，保留 MODEL_ARCHITECTURES 导出
export const MODEL_ARCHITECTURES: Record<string, { 
  d_model: number; 
  n_layers: number; 
  activeParams?: number;
  isMoE?: boolean;
  source: string;
  verificationUrl?: string;
}> = Object.fromEntries(
  MODELS.map(model => [
    model.parametersNum.toString(),
    {
      d_model: model.d_model,
      n_layers: model.n_layers,
      activeParams: model.activeParams,
      isMoE: model.isMoE,
      source: model.source,
      verificationUrl: model.verificationUrl
    }
  ])
)

// 精度对性能的影响倍数
export const PRECISION_MULTIPLIERS: Record<string, number> = {
  'FP32': 1.0,    // 32位浮点基准
  'FP16': 2.0,    // 16位浮点，2倍性能提升
  'BF16': 2.0,    // Brain Float 16，类似FP16
  'FP8': 4.0,     // 8位浮点，4倍性能提升
  'INT8': 4.0,    // 8位整数，4倍性能提升
  'INT4': 8.0,    // 4位整数，8倍性能提升
  'INT2': 16.0,   // 2位整数，16倍性能提升
  'INT1': 32.0,   // 1位整数，32倍性能提升
}

// 精度对内存的影响（每个参数占用字节数）
export const PRECISION_BYTES: Record<string, number> = {
  'FP32': 4,      // 32位 = 4字节
  'FP16': 2,      // 16位 = 2字节
  'BF16': 2,      // Brain Float 16 = 2字节
  'FP8': 1,       // 8位 = 1字节
  'INT8': 1,      // 8位整数 = 1字节
  'INT4': 0.5,    // 4位 = 0.5字节
  'INT2': 0.25,   // 2位 = 0.25字节
  'INT1': 0.125,  // 1位 = 0.125字节
}

// 创建GPU性能查找映射（向后兼容）
export const GPU_PERFORMANCE: Record<string, number> = Object.fromEntries(
  gpuModels.map(gpu => [gpu.name, gpu.performance])
)

