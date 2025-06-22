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
  d_model: number; // 模型维度，如4096、5120、8192等，影响模型的表达能力和计算量
  n_layers: number; // 模型层数，如32、40、64等，影响模型的表达能力和计算量
  activeParams?: number; // MoE模型的激活参数数量
  isMoE?: boolean;
  source: string;
  verificationUrl?: string;
  series: string; // 模型系列，如 "DeepSeek", "Llama 4", "Qwen 3"
  category: string; // 模型类别，如 "原始模型", "蒸馏模型", "代码专用"
}

// 统一的模型数据 - 包含架构信息的完整模型列表
export const MODELS: ModelInfo[] = [
  // DeepSeek 系列 (开源可私有化部署)
  {
    name: "DeepSeek-R1",
    parameters: "671B",
    parametersNum: 671,
    value: "deepseek-r1",
    d_model: 7168,
    n_layers: 61,
    activeParams: 37,
    isMoE: true,
    source: 'DeepSeek-R1 official configuration',
    verificationUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1/blob/main/configuration_deepseek.py',
    series: "DeepSeek",
    category: "原始模型"
  },
  {
    name: "DeepSeek-V3",
    parameters: "671B",
    parametersNum: 671,
    value: "deepseek-v3",
    d_model: 7168,
    n_layers: 61,
    activeParams: 37,
    isMoE: true,
    source: 'DeepSeek-V3 technical report',
    verificationUrl: 'https://github.com/deepseek-ai/DeepSeek-V3',
    series: "DeepSeek",
    category: "原始模型"
  },

  // DeepSeek-R1 蒸馏系列 (基于Qwen)
  {
    name: "DeepSeek-R1-Distill-Qwen-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "deepseek-r1-distill-qwen-32b",
    d_model: 5120,
    n_layers: 64,
    source: 'DeepSeek-R1 distilled from Qwen2.5-32B',
    verificationUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
    series: "DeepSeek",
    category: "蒸馏模型"
  },
  {
    name: "DeepSeek-R1-Distill-Qwen-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "deepseek-r1-distill-qwen-14b",
    d_model: 5120,
    n_layers: 40,
    source: 'DeepSeek-R1 distilled from Qwen2.5-14B',
    verificationUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B',
    series: "DeepSeek",
    category: "蒸馏模型"
  },
  {
    name: "DeepSeek-R1-Distill-Qwen-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "deepseek-r1-distill-qwen-7b",
    d_model: 3584,
    n_layers: 28,
    source: 'DeepSeek-R1 distilled from Qwen2.5-Math-7B',
    verificationUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    series: "DeepSeek",
    category: "蒸馏模型"
  },
  {
    name: "DeepSeek-R1-Distill-Qwen-1.5B",
    parameters: "1.5B",
    parametersNum: 1.5,
    value: "deepseek-r1-distill-qwen-1.5b",
    d_model: 1536,
    n_layers: 28,
    source: 'DeepSeek-R1 distilled from Qwen2.5-Math-1.5B',
    verificationUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
    series: "DeepSeek",
    category: "蒸馏模型"
  },

  // DeepSeek-R1 蒸馏系列 (基于Llama)
  {
    name: "DeepSeek-R1-Distill-Llama-70B",
    parameters: "70B",
    parametersNum: 70,
    value: "deepseek-r1-distill-llama-70b",
    d_model: 8192,
    n_layers: 80,
    source: 'DeepSeek-R1 distilled from Llama-3.3-70B-Instruct',
    verificationUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
    series: "DeepSeek",
    category: "蒸馏模型"
  },
  {
    name: "DeepSeek-R1-Distill-Llama-8B",
    parameters: "8B",
    parametersNum: 8,
    value: "deepseek-r1-distill-llama-8b",
    d_model: 4096,
    n_layers: 32,
    source: 'DeepSeek-R1 distilled from Llama-3.1-8B',
    verificationUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B',
    series: "DeepSeek",
    category: "蒸馏模型"
  },

  // Llama 4 系列 (已发布，可私有化部署)
  {
    name: "Llama 4 Scout",
    parameters: "109B",
    parametersNum: 109,
    value: "llama-4-scout",
    d_model: 4096,
    n_layers: 32,
    activeParams: 17,
    isMoE: true,
    source: 'Meta AI official release - available on HuggingFace',
    verificationUrl: 'https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct',
    series: "Llama 4",
    category: "原始模型"
  },
  {
    name: "Llama 4 Maverick",
    parameters: "400B",
    parametersNum: 400,
    value: "llama-4-maverick",
    d_model: 4096,
    n_layers: 32,
    activeParams: 17,
    isMoE: true,
    source: 'Meta AI official release - available on HuggingFace',
    verificationUrl: 'https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct',
    series: "Llama 4",
    category: "原始模型"
  },

  // Llama 3 系列 (开源可私有化部署)
  {
    name: "Llama 3 8B",
    parameters: "8B",
    parametersNum: 8,
    value: "llama-3-8b",
    d_model: 4096,
    n_layers: 32,
    source: 'Llama 3 technical specifications',
    verificationUrl: 'https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md',
    series: "Llama 3",
    category: "原始模型"
  },
  {
    name: "Llama 3 70B",
    parameters: "70B",
    parametersNum: 70,
    value: "llama-3-70b",
    d_model: 8192,
    n_layers: 80,
    source: 'Llama 3 technical specifications',
    verificationUrl: 'https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md',
    series: "Llama 3",
    category: "原始模型"
  },
  {
    name: "Llama 3.1 8B",
    parameters: "8B",
    parametersNum: 8,
    value: "llama-3.1-8b",
    d_model: 4096,
    n_layers: 32,
    source: 'Llama 3.1 technical specifications',
    verificationUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md',
    series: "Llama 3.1",
    category: "原始模型"
  },
  {
    name: "Llama 3.1 70B",
    parameters: "70B",
    parametersNum: 70,
    value: "llama-3.1-70b",
    d_model: 8192,
    n_layers: 80,
    source: 'Llama 3.1 official model card',
    verificationUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md',
    series: "Llama 3.1",
    category: "原始模型"
  },
  {
    name: "Llama 3.1 405B",
    parameters: "405B",
    parametersNum: 405,
    value: "llama-3.1-405b",
    d_model: 16384,
    n_layers: 126,
    source: 'Llama 3.1 official model card',
    verificationUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md',
    series: "Llama 3.1",
    category: "原始模型"
  },
  {
    name: "Llama 3.2 1B",
    parameters: "1B",
    parametersNum: 1,
    value: "llama-3.2-1b",
    d_model: 2048,
    n_layers: 16,
    source: 'Llama 3.2 official model card',
    verificationUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md',
    series: "Llama 3.2",
    category: "原始模型"
  },
  {
    name: "Llama 3.2 3B",
    parameters: "3B",
    parametersNum: 3,
    value: "llama-3.2-3b",
    d_model: 3072,
    n_layers: 28,
    source: 'Llama 3.2 official model card',
    verificationUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md',
    series: "Llama 3.2",
    category: "原始模型"
  },
  {
    name: "Llama 3.2 11B",
    parameters: "11B",
    parametersNum: 11,
    value: "llama-3.2-11b",
    d_model: 4096,
    n_layers: 32,
    source: 'Llama 3.2 official model card',
    verificationUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md',
    series: "Llama 3.2",
    category: "原始模型"
  },
  {
    name: "Llama 3.2 90B",
    parameters: "90B",
    parametersNum: 90,
    value: "llama-3.2-90b",
    d_model: 8192,
    n_layers: 80,
    source: 'Llama 3.2 official model card',
    verificationUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md',
    series: "Llama 3.2",
    category: "原始模型"
  },

  // Qwen 系列 (开源可私有化部署)
  {
    name: "Qwen3-235B-A22B",
    parameters: "235B",
    parametersNum: 235,
    value: "qwen3-235b-a22b",
    d_model: 6144,
    n_layers: 94,
    activeParams: 22,
    isMoE: true,
    source: 'Qwen3 technical report - flagship MoE model',
    verificationUrl: 'https://huggingface.co/Qwen/Qwen3-235B-A22B',
    series: "Qwen 3",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-Math-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2.5-math-72b",
    d_model: 8192,
    n_layers: 80,
    source: 'Qwen2.5-72B official configuration',
    verificationUrl: 'https://huggingface.co/Qwen/Qwen2.5-72B',
    series: "Qwen 2.5",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2.5-72b",
    d_model: 8192,
    n_layers: 80,
    source: 'Qwen2.5-72B HuggingFace model card',
    verificationUrl: 'https://huggingface.co/Qwen/Qwen2.5-72B',
    series: "Qwen 2.5",
    category: "原始模型"
  },
  {
    name: "Qwen2-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2-72b",
    d_model: 8192,
    n_layers: 80,
    source: 'Estimated based on 70B architecture',
    series: "Qwen 2",
    category: "原始模型"
  },
  {
    name: "Qwen QwQ-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen-qwq-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws',
    series: "Qwen QwQ",
    category: "推理专用"
  },
  {
    name: "Qwen2.5-Coder-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2.5-coder-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws',
    series: "Qwen 2.5",
    category: "代码专用"
  },
  {
    name: "Qwen3-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen3-32b",
    d_model: 5120,
    n_layers: 64,
    source: 'Qwen3 technical report',
    verificationUrl: 'https://qwenlm.github.io/blog/qwen3/',
    series: "Qwen 3",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2.5-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws',
    series: "Qwen 2.5",
    category: "原始模型"
  },
  {
    name: "Qwen2-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2-32b",
    d_model: 6656,
    n_layers: 60,
    source: 'Estimated based on scaling laws',
    series: "Qwen 2",
    category: "原始模型"
  },
  {
    name: "Qwen3-30B-A3B",
    parameters: "30B",
    parametersNum: 30,
    value: "qwen3-30b-a3b",
    d_model: 3072,
    n_layers: 48,
    activeParams: 3,
    isMoE: true,
    source: 'Qwen3 technical report - MoE model',
    verificationUrl: 'https://huggingface.co/Qwen/Qwen3-30B-A3B',
    series: "Qwen 3",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen2.5-14b",
    d_model: 5120,
    n_layers: 40,
    source: 'Estimated based on 13B architecture',
    series: "Qwen 2.5",
    category: "原始模型"
  },
  {
    name: "Qwen3-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen3-14b",
    d_model: 4096,
    n_layers: 40,
    source: 'Qwen3 technical report',
    verificationUrl: 'https://qwenlm.github.io/blog/qwen3/',
    series: "Qwen 3",
    category: "原始模型"
  },
  {
    name: "Qwen2-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen2-14b",
    d_model: 5120,
    n_layers: 40,
    source: 'Estimated based on 13B architecture',
    series: "Qwen 2",
    category: "原始模型"
  },
  {
    name: "Qwen3-8B",
    parameters: "8B",
    parametersNum: 8,
    value: "qwen3-8b",
    d_model: 3584,
    n_layers: 36,
    source: 'Qwen3 technical report',
    verificationUrl: 'https://qwenlm.github.io/blog/qwen3/',
    series: "Qwen 3",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "qwen2.5-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Estimated based on 7B architecture',
    series: "Qwen 2.5",
    category: "原始模型"
  },
  {
    name: "Qwen2-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "qwen2-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Estimated based on 7B architecture',
    series: "Qwen 2",
    category: "原始模型"
  },
  {
    name: "Qwen3-4B",
    parameters: "4B",
    parametersNum: 4,
    value: "qwen3-4b",
    d_model: 2560,
    n_layers: 36,
    source: 'Qwen3 technical report',
    verificationUrl: 'https://qwenlm.github.io/blog/qwen3/',
    series: "Qwen 3",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-3B",
    parameters: "3B",
    parametersNum: 3,
    value: "qwen2.5-3b",
    d_model: 2048,
    n_layers: 28,
    source: 'Estimated for 3B model',
    series: "Qwen 2.5",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-1.5B",
    parameters: "1.5B",
    parametersNum: 1.5,
    value: "qwen2.5-1.5b",
    d_model: 1536,
    n_layers: 24,
    source: 'Estimated for 1.5B model',
    series: "Qwen 2.5",
    category: "原始模型"
  },
  {
    name: "Qwen2.5-0.5B",
    parameters: "0.5B",
    parametersNum: 0.5,
    value: "qwen2.5-0.5b",
    d_model: 1024,
    n_layers: 16,
    source: 'Estimated for 0.5B model',
    series: "Qwen 2.5",
    category: "原始模型"
  },

  // 其他开源模型 (可私有化部署)
  {
    name: "ChatGLM-6B",
    parameters: "6B",
    parametersNum: 6,
    value: "chatglm-6b",
    d_model: 4096,
    n_layers: 28,
    source: 'Estimated for 6B model',
    series: "ChatGLM",
    category: "原始模型"
  },
  {
    name: "Baichuan2-13B",
    parameters: "13B",
    parametersNum: 13,
    value: "baichuan2-13b",
    d_model: 5120,
    n_layers: 40,
    source: 'Estimated based on 13B architecture',
    series: "Baichuan 2",
    category: "原始模型"
  },
  {
    name: "Baichuan2-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "baichuan2-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Estimated based on 7B architecture',
    series: "Baichuan 2",
    category: "原始模型"
  },
  {
    name: "Qwen3-0.6B",
    parameters: "0.6B",
    parametersNum: 0.6,
    value: "qwen3-0.6b",
    d_model: 896,
    n_layers: 28,
    source: 'Qwen3 technical report',
    verificationUrl: 'https://qwenlm.github.io/blog/qwen3/',
    series: "Qwen 3",
    category: "原始模型"
  },
  {
    name: "Qwen3-1.7B",
    parameters: "1.7B",
    parametersNum: 1.7,
    value: "qwen3-1.7b",
    d_model: 1536,
    n_layers: 28,
    source: 'Qwen3 technical report',
    verificationUrl: 'https://qwenlm.github.io/blog/qwen3/',
    series: "Qwen 3",
    category: "原始模型"
  },

  // Mistral 系列 (开源可私有化部署)
  {
    name: "Mistral-Large-Instruct-2407",
    parameters: "123B",
    parametersNum: 123,
    value: "mistral-large-instruct-2407",
    d_model: 6144,
    n_layers: 88,
    source: 'Mistral AI official release',
    verificationUrl: 'https://huggingface.co/mistralai/Mistral-Large-Instruct-2407',
    series: "Mistral",
    category: "原始模型"
  },
  {
    name: "Mistral-Nemo-12B",
    parameters: "12B",
    parametersNum: 12,
    value: "mistral-nemo-12b",
    d_model: 5120,
    n_layers: 40,
    source: 'NVIDIA & Mistral AI collaboration',
    verificationUrl: 'https://huggingface.co/nvidia/Mistral-NeMo-12B-Base',
    series: "Mistral",
    category: "原始模型"
  },
  {
    name: "Mistral-7B-v0.3",
    parameters: "7B",
    parametersNum: 7,
    value: "mistral-7b-v0.3",
    d_model: 4096,
    n_layers: 32,
    source: 'Mistral AI official release',
    verificationUrl: 'https://huggingface.co/mistralai/Mistral-7B-v0.3',
    series: "Mistral",
    category: "原始模型"
  },
  {
    name: "Mixtral-8x7B",
    parameters: "46.7B",
    parametersNum: 46.7,
    value: "mixtral-8x7b",
    d_model: 4096,
    n_layers: 32,
    activeParams: 12.9,
    isMoE: true,
    source: 'Mistral AI MoE model',
    verificationUrl: 'https://huggingface.co/mistralai/Mixtral-8x7B-v0.1',
    series: "Mixtral",
    category: "原始模型"
  },
  {
    name: "Mixtral-8x22B",
    parameters: "141B",
    parametersNum: 141,
    value: "mixtral-8x22b",
    d_model: 6144,
    n_layers: 56,
    activeParams: 39,
    isMoE: true,
    source: 'Mistral AI large MoE model',
    verificationUrl: 'https://huggingface.co/mistralai/Mixtral-8x22B-v0.1',
    series: "Mixtral",
    category: "原始模型"
  },

  // Gemma 系列 (Google开源)
  {
    name: "Gemma-2-27B",
    parameters: "27B",
    parametersNum: 27,
    value: "gemma-2-27b",
    d_model: 4608,
    n_layers: 46,
    source: 'Google Gemma 2 series',
    verificationUrl: 'https://huggingface.co/google/gemma-2-27b',
    series: "Gemma",
    category: "原始模型"
  },
  {
    name: "Gemma-2-9B",
    parameters: "9B",
    parametersNum: 9,
    value: "gemma-2-9b",
    d_model: 3584,
    n_layers: 42,
    source: 'Google Gemma 2 series',
    verificationUrl: 'https://huggingface.co/google/gemma-2-9b',
    series: "Gemma",
    category: "原始模型"
  },
  {
    name: "Gemma-2-2B",
    parameters: "2B",
    parametersNum: 2,
    value: "gemma-2-2b",
    d_model: 2304,
    n_layers: 26,
    source: 'Google Gemma 2 series',
    verificationUrl: 'https://huggingface.co/google/gemma-2-2b',
    series: "Gemma",
    category: "原始模型"
  },

  // Yi 系列 (01.AI开源)
  {
    name: "Yi-34B",
    parameters: "34B",
    parametersNum: 34,
    value: "yi-34b",
    d_model: 7168,
    n_layers: 60,
    source: '01.AI Yi series - bilingual model',
    verificationUrl: 'https://huggingface.co/01-ai/Yi-34B',
    series: "Yi",
    category: "原始模型"
  },
  {
    name: "Yi-6B",
    parameters: "6B",
    parametersNum: 6,
    value: "yi-6b",
    d_model: 4096,
    n_layers: 32,
    source: '01.AI Yi series - bilingual model',
    verificationUrl: 'https://huggingface.co/01-ai/Yi-6B',
    series: "Yi",
    category: "原始模型"
  },

  // Phi 系列 (Microsoft开源)
  {
    name: "Phi-3.5-MoE",
    parameters: "42B",
    parametersNum: 42,
    value: "phi-3.5-moe",
    d_model: 3072,
    n_layers: 32,
    activeParams: 6.6,
    isMoE: true,
    source: 'Microsoft Phi-3.5 MoE model',
    verificationUrl: 'https://huggingface.co/microsoft/Phi-3.5-MoE-instruct',
    series: "Phi",
    category: "原始模型"
  },
  {
    name: "Phi-3-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "phi-3-14b",
    d_model: 5120,
    n_layers: 40,
    source: 'Microsoft Phi-3 series',
    verificationUrl: 'https://huggingface.co/microsoft/Phi-3-medium-14b',
    series: "Phi",
    category: "原始模型"
  },
  {
    name: "Phi-3-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "phi-3-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Microsoft Phi-3 series',
    verificationUrl: 'https://huggingface.co/microsoft/Phi-3-small-7b',
    series: "Phi",
    category: "原始模型"
  },
  {
    name: "Phi-3-3.8B",
    parameters: "3.8B",
    parametersNum: 3.8,
    value: "phi-3-3.8b",
    d_model: 3072,
    n_layers: 32,
    source: 'Microsoft Phi-3 mini series',
    verificationUrl: 'https://huggingface.co/microsoft/Phi-3-mini-3.8b',
    series: "Phi",
    category: "原始模型"
  },

  // CodeLlama 系列 (Meta代码专用)
  {
    name: "CodeLlama-34B",
    parameters: "34B",
    parametersNum: 34,
    value: "codellama-34b",
    d_model: 8192,
    n_layers: 48,
    source: 'Meta CodeLlama for code generation',
    verificationUrl: 'https://huggingface.co/codellama/CodeLlama-34b-hf',
    series: "CodeLlama",
    category: "代码专用"
  },
  {
    name: "CodeLlama-13B",
    parameters: "13B",
    parametersNum: 13,
    value: "codellama-13b",
    d_model: 5120,
    n_layers: 40,
    source: 'Meta CodeLlama for code generation',
    verificationUrl: 'https://huggingface.co/codellama/CodeLlama-13b-hf',
    series: "CodeLlama",
    category: "代码专用"
  },
  {
    name: "CodeLlama-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "codellama-7b",
    d_model: 4096,
    n_layers: 32,
    source: 'Meta CodeLlama for code generation',
    verificationUrl: 'https://huggingface.co/codellama/CodeLlama-7b-hf',
    series: "CodeLlama",
    category: "代码专用"
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

// 根据系列和类别对模型进行分组的辅助函数
export const getModelsByGroup = () => {
  const groups: Record<string, ModelInfo[]> = {};
  
  MODELS.forEach(model => {
    const groupKey = model.series;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(model);
  });

  // 按系列名称排序，优先显示热门系列
  const seriesOrder = [
    "DeepSeek",
    "Llama 4", 
    "Llama 3.2",
    "Llama 3.1", 
    "Llama 3",
    "Qwen 3",
    "Qwen 2.5",
    "Qwen 2",
    "Qwen QwQ",
    "Mixtral",
    "Mistral",
    "Gemma",
    "Yi",
    "Phi",
    "CodeLlama",
    "ChatGLM",
    "Baichuan 2"
  ];

  const sortedGroups: Record<string, ModelInfo[]> = {};
  
  // 按预定义顺序添加系列
  seriesOrder.forEach(series => {
    if (groups[series]) {
      // 在每个系列内按参数大小排序（从大到小）
      sortedGroups[series] = groups[series].sort((a, b) => b.parametersNum - a.parametersNum);
    }
  });

  // 添加任何未在预定义顺序中的系列
  Object.keys(groups).forEach(series => {
    if (!seriesOrder.includes(series)) {
      sortedGroups[series] = groups[series].sort((a, b) => b.parametersNum - a.parametersNum);
    }
  });

  return sortedGroups;
};

// 根据类别获取模型
export const getModelsByCategory = () => {
  const categories: Record<string, ModelInfo[]> = {};
  
  MODELS.forEach(model => {
    const categoryKey = model.category;
    if (!categories[categoryKey]) {
      categories[categoryKey] = [];
    }
    categories[categoryKey].push(model);
  });

  return categories;
};

