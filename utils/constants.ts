// 精度配置
export const precisions = [
  { name: "FP32", value: "FP32", group: "standard" },
  { name: "FP16", value: "FP16", group: "standard" },
  { name: "FP8", value: "FP8", group: "standard" },
  { name: "MXFP4", value: "MXFP4", group: "standard" },
  { name: "INT8", value: "INT8", group: "standard" },
  { name: "INT4", value: "INT4", group: "standard" },
  // GGUF 量化格式 (llama.cpp)
  { name: "GGUF Q8_0", value: "GGUF_Q8_0", group: "gguf" },
  { name: "GGUF Q6_K", value: "GGUF_Q6_K", group: "gguf" },
  { name: "GGUF Q5_K_M", value: "GGUF_Q5_K_M", group: "gguf" },
  { name: "GGUF Q4_K_M", value: "GGUF_Q4_K_M", group: "gguf" },
  { name: "GGUF Q4_K_S", value: "GGUF_Q4_K_S", group: "gguf" },
  { name: "GGUF Q4_0", value: "GGUF_Q4_0", group: "gguf" },
  { name: "GGUF Q3_K_M", value: "GGUF_Q3_K_M", group: "gguf" },
  { name: "GGUF Q2_K", value: "GGUF_Q2_K", group: "gguf" },
];

// GPU数据结构接口
export interface GPUModel {
  name: string;
  memory: number;
  fp16Tflops: number;
  architecture: string;
  category?: string;
  releaseYear: number; // 发布年份
  memoryBandwidthInGB: number;
}

// GPU完整规格信息 - 包含内存、性能和发布年份
export const gpuModels: GPUModel[] = [
  // NVIDIA 最新架构 - Blackwell
  {
    name: "NVIDIA B200",
    memory: 192,
    memoryBandwidthInGB: 5000,
    fp16Tflops: 2250,
    architecture: "Blackwell",
    category: "数据中心",
    releaseYear: 2024,
  }, // FP16 dense with sparsity
  {
    name: "NVIDIA B100",
    memory: 192, // GB
    memoryBandwidthInGB: 4500, // GB/s，估计值
    fp16Tflops: 1750, // dense FP16，不含 sparsity
    architecture: "Blackwell",
    category: "数据中心",
    releaseYear: 2024,
  },

  // NVIDIA Hopper架构
  {
    name: "NVIDIA H200",
    memory: 141,
    memoryBandwidthInGB: 4800,
    fp16Tflops: 1000,
    architecture: "Hopper",
    category: "数据中心",
    releaseYear: 2023,
  }, // 141 GB HBM3e，4.8 TB/s → 4800 GB/s :contentReference[oaicite:0]{index=0}
  {
    name: "NVIDIA H100",
    memory: 80,
    memoryBandwidthInGB: 3300,
    fp16Tflops: 989,
    architecture: "Hopper",
    category: "数据中心",
    releaseYear: 2022,
  }, // 80 GB HBM3，3.35 TB/s → 3350 GB/s :contentReference[oaicite:1]{index=1}
  {
    name: "NVIDIA H20",
    memory: 96,
    memoryBandwidthInGB: 4000,
    fp16Tflops: 148,
    architecture: "Hopper",
    category: "数据中心",
    releaseYear: 2024,
  }, // 中国特供版，96 GB HBM3，4.0 TB/s → 4000 GB/s :contentReference[oaicite:2]{index=2}
  // NVIDIA Ada Lovelace架构
  {
    name: "NVIDIA L40",
    memory: 48,
    memoryBandwidthInGB: 864,
    fp16Tflops: 181,
    architecture: "Ada Lovelace",
    releaseYear: 2022,
  },
  {
    name: "NVIDIA L20",
    memory: 48,
    memoryBandwidthInGB: 864,
    fp16Tflops: 120,
    architecture: "Ada Lovelace",
    releaseYear: 2023,
  },
  {
    name: "NVIDIA L2",
    memory: 24,
    memoryBandwidthInGB: 432,
    fp16Tflops: 96,
    architecture: "Ada Lovelace",
    releaseYear: 2023,
  },
  {
    "name": "NVIDIA RTX 6000 Ada",
    "memory": 48,
    "memoryBandwidthInGB": 960,
    "fp16Tflops": 91.06,
    "architecture": "Ada Lovelace",
    "releaseYear": 2022
  },
  {
    "name": "NVIDIA RTX 5000 Ada",
    "memory": 32,
    "memoryBandwidthInGB": 576,
    "fp16Tflops": 65.28,
    "architecture": "Ada Lovelace",
    "releaseYear": 2023
  },
  {
    "name": "NVIDIA RTX 4000 Ada",
    "memory": 20,
    "memoryBandwidthInGB": 360,
    "fp16Tflops": 26.73,
    "architecture": "Ada Lovelace",
    "releaseYear": 2023
  },
  {
    "name": "NVIDIA RTX 3000 Ada",
    "memory": 8,
    "memoryBandwidthInGB": 256,
    "fp16Tflops": 15.6,
    "architecture": "Ada Lovelace",
    "releaseYear": 2023
  },

  // NVIDIA RTX 5000系列 (Blackwell消费级)
  {
    name: "NVIDIA RTX 5090",
    memory: 32,
    memoryBandwidthInGB: 1790,
    fp16Tflops: 104.8,
    architecture: "Blackwell",
    category: "消费级",
    releaseYear: 2025,
  }, // TechPowerUp verified: 21760 CUDA cores, 32GB GDDR7, 1.79 TB/s
  {
    name: "NVIDIA RTX 5080",
    memory: 16,
    memoryBandwidthInGB: 960,
    fp16Tflops: 56.28,
    architecture: "Blackwell",
    category: "消费级",
    releaseYear: 2025,
  }, // TechPowerUp verified: 10752 CUDA cores, 16GB GDDR7, 960 GB/s
  {
    name: "NVIDIA RTX 5070 Ti",
    memory: 16,
    memoryBandwidthInGB: 896,
    fp16Tflops: 43.94,
    architecture: "Blackwell",
    category: "消费级",
    releaseYear: 2025,
  }, // TechPowerUp verified: 8960 CUDA cores, 16GB GDDR7, 896 GB/s
  {
    name: "NVIDIA RTX 5080 SUPER",
    memory: 24,
    memoryBandwidthInGB: 1020,
    fp16Tflops: 56.28,
    architecture: "Blackwell",
    category: "消费级",
    releaseYear: 2025,
  }, // TechPowerUp specs: same cores as 5080 but 24GB GDDR7, 32 Gbps


  // NVIDIA RTX 4000系列
  {
    name: "NVIDIA RTX 4090",
    memory: 24,
    memoryBandwidthInGB: 1008,
    fp16Tflops: 82.58,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2022,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 4080 SUPER",
    memory: 16,
    memoryBandwidthInGB: 736.3,
    fp16Tflops: 52.2,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2024,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 4080",
    memory: 16,
    memoryBandwidthInGB: 716.8,
    fp16Tflops: 49.9,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2022,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 4070 Ti Super",
    memory: 16,
    memoryBandwidthInGB: 672.3,
    fp16Tflops: 40.1,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2024,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 4070 Ti",
    memory: 12,
    memoryBandwidthInGB: 504,
    fp16Tflops: 40.1,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2023,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 4070",
    memory: 12,
    memoryBandwidthInGB: 504,
    fp16Tflops: 29.2,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2023,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 4060 Ti (16GB)",
    memory: 16,
    memoryBandwidthInGB: 288,
    fp16Tflops: 38,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2023,
  },
  {
    name: "NVIDIA RTX 4060 Ti (8GB)",
    memory: 8,
    memoryBandwidthInGB: 288,
    fp16Tflops: 38,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2023,
  },
  {
    name: "NVIDIA RTX 4060",
    memory: 8,
    memoryBandwidthInGB: 288,
    fp16Tflops: 35,
    architecture: "Ada Lovelace",
    category: "消费级",
    releaseYear: 2023,
  },
  // NVIDIA RTX 3000系列
  {
    name: "NVIDIA RTX 3090 Ti",
    memory: 24,
    memoryBandwidthInGB: 1008,
    fp16Tflops: 78.0,
    architecture: "Ampere",
    category: "消费级",
    releaseYear: 2022,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 3090",
    memory: 24,
    memoryBandwidthInGB: 936.2,
    fp16Tflops: 71.0,
    architecture: "Ampere",
    category: "消费级",
    releaseYear: 2020,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 3080 Ti",
    memory: 12,
    memoryBandwidthInGB: 912.4,
    fp16Tflops: 67.0,
    architecture: "Ampere",
    category: "消费级",
    releaseYear: 2021,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 3080",
    memory: 10,
    memoryBandwidthInGB: 760,
    fp16Tflops: 58.0,
    architecture: "Ampere",
    category: "消费级",
    releaseYear: 2020,
  }, // FP16 performance from TechPowerUp
  {
    name: "NVIDIA RTX 3070 Ti",
    memory: 8,
    memoryBandwidthInGB: 608,
    fp16Tflops: 40.0,
    architecture: "Ampere",
    category: "消费级",
    releaseYear: 2021,
  }, // FP16 performance from TechPowerUp

  // NVIDIA Tesla/数据中心系列
  {
    name: "NVIDIA A100 (80GB)",
    memory: 80,
    memoryBandwidthInGB: 1940,
    fp16Tflops: 77.97,
    architecture: "Ampere",
    category: "数据中心",
    releaseYear: 2021,
  }, // TechPowerUp verified: GA100, 6912 CUDA cores, 80GB HBM2e, 1.94 TB/s
  {
    name: "NVIDIA A100 (40GB)",
    memory: 40,
    memoryBandwidthInGB: 1560,
    fp16Tflops: 77.97,
    architecture: "Ampere",
    category: "数据中心",
    releaseYear: 2020,
  }, // TechPowerUp verified: GA100, 6912 CUDA cores, 40GB HBM2e, 1.56 TB/s
  {
    name: "NVIDIA A40",
    memory: 48,
    memoryBandwidthInGB: 696,
    fp16Tflops: 37.42,
    architecture: "Ampere",
    category: "数据中心",
    releaseYear: 2020,
  }, // TechPowerUp verified: GA102, 10752 CUDA cores, 48GB GDDR6, 695.8 GB/s
  {
    name: "NVIDIA A30",
    memory: 24,
    memoryBandwidthInGB: 933,
    fp16Tflops: 10.32,
    architecture: "Ampere",
    category: "数据中心",
    releaseYear: 2021,
  }, // TechPowerUp verified: GA100, 3584 CUDA cores, 24GB HBM2e, 933.1 GB/s
  {
    name: "NVIDIA A10",
    memory: 24,
    memoryBandwidthInGB: 600,
    fp16Tflops: 31.52,
    architecture: "Ampere",
    category: "数据中心",
    releaseYear: 2021,
  }, // TechPowerUp verified: GA102, 9216 CUDA cores, 24GB GDDR6, 600.2 GB/s
  {
    name: "NVIDIA V100S",
    memory: 32,
    memoryBandwidthInGB: 900,
    fp16Tflops: 130,
    architecture: "Volta",
    category: "数据中心",
    releaseYear: 2018,
  },
  {
    name: "NVIDIA V100 (32GB)",
    memory: 32,
    memoryBandwidthInGB: 900,
    fp16Tflops: 125,
    architecture: "Volta",
    category: "数据中心",
    releaseYear: 2017,
  },
  {
    name: "NVIDIA V100 (16GB)",
    memory: 16,
    memoryBandwidthInGB: 900,
    fp16Tflops: 125,
    architecture: "Volta",
    category: "数据中心",
    releaseYear: 2017,
  },
  {
    name: "NVIDIA T4",
    memory: 16,
    memoryBandwidthInGB: 300,
    fp16Tflops: 65,
    architecture: "Turing",
    category: "推理专用",
    releaseYear: 2018,
  },
  {
    name: "NVIDIA P100 (16GB)",
    memory: 16,
    memoryBandwidthInGB: 720,
    fp16Tflops: 21,
    architecture: "Pascal",
    category: "数据中心",
    releaseYear: 2016,
  },
  {
    name: "NVIDIA P40",
    memory: 24,
    memoryBandwidthInGB: 347,
    fp16Tflops: 0.18,
    architecture: "Pascal",
    category: "数据中心",
    releaseYear: 2016,
  }, // TechPowerUp verified: GP102, 3840 CUDA cores, 347.1 GB/s GDDR5
  // NVIDIA 经典显卡
  {
    name: "NVIDIA TITAN RTX",
    memory: 24,
    memoryBandwidthInGB: 672,
    fp16Tflops: 32.62,
    architecture: "Turing",
    category: "消费级",
    releaseYear: 2018,
  }, // TechPowerUp verified: TU102, 4608 CUDA cores, 576 Tensor cores, 672 GB/s GDDR6

  // AMD 数据中心/专业卡
  // CDNA 4 架构 (2025年)
  {
    name: "AMD Instinct MI355X",
    memory: 288,
    memoryBandwidthInGB: 8192,
    fp16Tflops: 5000,
    architecture: "CDNA 4",
    category: "数据中心",
    releaseYear: 2025,
  }, // Liquid-cooled, up to 1400W TBP
  {
    name: "AMD Instinct MI350X",
    memory: 288,
    memoryBandwidthInGB: 8192,
    fp16Tflops: 4600,
    architecture: "CDNA 4",
    category: "数据中心",
    releaseYear: 2025,
  }, // Air-cooled version

  // CDNA 3 架构 (2023-2024年)
  {
    name: "AMD Instinct MI325X",
    memory: 256,
    memoryBandwidthInGB: 6000,
    fp16Tflops: 2610,
    architecture: "CDNA 3",
    category: "数据中心",
    releaseYear: 2024,
  }, // HBM3E, 6TB/s bandwidth
  {
    name: "AMD Instinct MI300X",
    memory: 192,
    memoryBandwidthInGB: 5300,
    fp16Tflops: 1300,
    architecture: "CDNA 3",
    category: "数据中心",
    releaseYear: 2023,
  }, // Original MI300X
  {
    name: "AMD Instinct MI300A",
    memory: 128,
    memoryBandwidthInGB: 5300,
    fp16Tflops: 1000,
    architecture: "CDNA 3",
    category: "数据中心",
    releaseYear: 2023,
  }, // APU with CPU+GPU
  {
    name: "AMD Instinct MI250X",
    memory: 128,
    memoryBandwidthInGB: 2048,
    fp16Tflops: 380,
    architecture: "CDNA 2",
    category: "数据中心",
    releaseYear: 2021,
  },
  {
    name: "AMD Instinct MI250",
    memory: 128,
    memoryBandwidthInGB: 2048,
    fp16Tflops: 360,
    architecture: "CDNA 2",
    category: "数据中心",
    releaseYear: 2021,
  },
  {
    name: "AMD Instinct MI210",
    memory: 64,
    memoryBandwidthInGB: 1024,
    fp16Tflops: 180,
    architecture: "CDNA 2",
    category: "数据中心",
    releaseYear: 2021,
  },
  {
    name: "AMD Instinct MI100",
    memory: 32,
    memoryBandwidthInGB: 1024,
    fp16Tflops: 150,
    architecture: "CDNA 1",
    category: "数据中心",
    releaseYear: 2020,
  },
  {
    name: "AMD Instinct MI60",
    memory: 32,
    memoryBandwidthInGB: 900,
    fp16Tflops: 120,
    architecture: "Vega",
    category: "数据中心",
    releaseYear: 2018,
  },
  {
    name: "AMD Instinct MI50",
    memory: 32,
    memoryBandwidthInGB: 900,
    fp16Tflops: 100,
    architecture: "Vega",
    category: "数据中心",
    releaseYear: 2018,
  },
  {
    name: "AMD Instinct MI25",
    memory: 16,
    memoryBandwidthInGB: 512,
    fp16Tflops: 50,
    architecture: "Vega",
    category: "数据中心",
    releaseYear: 2017,
  },
  // AMD 专业卡

  {
    name: "AMD Radeon PRO VII",
    memory: 16,
    fp16Tflops: 60,
    architecture: "Vega",
    memoryBandwidthInGB: 1024,
    releaseYear: 2019,
  },
  {
    name: "AMD Radeon PRO W7900",
    memory: 48,
    fp16Tflops: 120,
    architecture: "RDNA 3",
    memoryBandwidthInGB: 864,
    releaseYear: 2023,
  },
  {
    name: "AMD Radeon PRO W7800",
    memory: 32,
    fp16Tflops: 90,
    architecture: "RDNA 3",
    memoryBandwidthInGB: 576,
    releaseYear: 2023,
  },
  {
    name: "AMD Radeon PRO W6900X",
    memory: 32,
    fp16Tflops: 80,
    architecture: "RDNA 2",
    memoryBandwidthInGB: 512,
    releaseYear: 2021,
  },
  {
    name: "AMD Radeon PRO W6800",
    memory: 32,
    fp16Tflops: 70,
    architecture: "RDNA 2",
    memoryBandwidthInGB: 512,
    releaseYear: 2021,
  },

  // AMD RDNA 4架构消费级 (RX 9000系列)

  {
    name: "AMD Radeon RX 9070 XT",
    memory: 16,
    fp16Tflops: 95,
    architecture: "RDNA 4",
    category: "消费级",
    releaseYear: 2025,
    memoryBandwidthInGB: 640,
  },
  {
    name: "AMD Radeon RX 9070",
    memory: 16,
    fp16Tflops: 85,
    architecture: "RDNA 4",
    category: "消费级",
    releaseYear: 2025,
    memoryBandwidthInGB: 640,
  },
  {
    name: "AMD Radeon RX 9060 XT (16GB)",
    memory: 16,
    fp16Tflops: 65,
    architecture: "RDNA 4",
    category: "消费级",
    releaseYear: 2025,
    memoryBandwidthInGB: 320,
  },
  {
    name: "AMD Radeon RX 9060 XT (8GB)",
    memory: 8,
    fp16Tflops: 65,
    architecture: "RDNA 4",
    category: "消费级",
    releaseYear: 2025,
    memoryBandwidthInGB: 320,
  },

  {
    name: "AMD Radeon RX 7900 XTX",
    memory: 24,
    fp16Tflops: 61.4,
    architecture: "RDNA 3",
    category: "消费级",
    releaseYear: 2022,
    memoryBandwidthInGB: 960,
  }, // FP16 performance from TechPowerUp
  {
    name: "AMD Radeon RX 7900 XT",
    memory: 20,
    fp16Tflops: 52.0,
    architecture: "RDNA 3",
    category: "消费级",
    releaseYear: 2022,
    memoryBandwidthInGB: 800,
  }, // FP16 performance from TechPowerUp
  {
    name: "AMD Radeon RX 7800 XT",
    memory: 16,
    fp16Tflops: 37.4,
    architecture: "RDNA 3",
    category: "消费级",
    releaseYear: 2023,
    memoryBandwidthInGB: 624,
  }, // FP16 performance from TechPowerUp
  {
    name: "AMD Radeon RX 7600 XT",
    memory: 16,
    fp16Tflops: 50,
    architecture: "RDNA 3",
    category: "消费级",
    releaseYear: 2024,
    memoryBandwidthInGB: 288,
  },
  {
    name: "AMD Radeon RX 6950 XT",
    memory: 16,
    fp16Tflops: 50,
    architecture: "RDNA 2",
    category: "消费级",
    releaseYear: 2022,
    memoryBandwidthInGB: 576,
  },
  {
    name: "AMD Radeon RX 6900 XT",
    memory: 16,
    fp16Tflops: 23.0,
    architecture: "RDNA 2",
    category: "消费级",
    releaseYear: 2020,
    memoryBandwidthInGB: 512,
  }, // FP16 performance from TechPowerUp
  {
    name: "AMD Radeon RX 6800 XT",
    memory: 16,
    fp16Tflops: 20.7,
    architecture: "RDNA 2",
    category: "消费级",
    releaseYear: 2020,
    memoryBandwidthInGB: 512,
  }, // FP16 performance from TechPowerUp
  {
    name: "AMD Radeon RX 6800",
    memory: 16,
    fp16Tflops: 38,
    architecture: "RDNA 2",
    category: "消费级",
    releaseYear: 2020,
    memoryBandwidthInGB: 512,
  },
  // AMD 经典显卡
  {
    name: "AMD Radeon VII",
    memory: 16,
    fp16Tflops: 25,
    architecture: "Vega",
    category: "消费级",
    releaseYear: 2019,
    memoryBandwidthInGB: 1024,
  },

  {
    name: "Apple M4 Max (128GB)",
    memory: 128,
    fp16Tflops: 150,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 410,
  },
  {
    name: "Apple M4 Max (64GB)",
    memory: 64,
    fp16Tflops: 140,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 410,
  },
  {
    name: "Apple M4 Max (36GB)",
    memory: 36,
    fp16Tflops: 130,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 410,
  },
  {
    name: "Apple M4 Pro (64GB)",
    memory: 64,
    fp16Tflops: 100,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 273,
  },
  {
    name: "Apple M4 Pro (48GB)",
    memory: 48,
    fp16Tflops: 90,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 273,
  },
  {
    name: "Apple M4 Pro (24GB)",
    memory: 24,
    fp16Tflops: 80,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 273,
  },
  {
    name: "Apple M4 (32GB)",
    memory: 32,
    fp16Tflops: 60,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 100,
  },
  {
    name: "Apple M4 (24GB)",
    memory: 24,
    fp16Tflops: 55,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 100,
  },
  {
    name: "Apple M4 (16GB)",
    memory: 16,
    fp16Tflops: 50,
    architecture: "M4",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 100,
  },
  {
    name: "Apple M3 Ultra (192GB)",
    memory: 192,
    fp16Tflops: 140,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 819,
  },
  {
    name: "Apple M3 Ultra (128GB)",
    memory: 128,
    fp16Tflops: 130,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2024,
    memoryBandwidthInGB: 819,
  },
  {
    name: "Apple M3 Max (128GB)",
    memory: 128,
    fp16Tflops: 120,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 400,
  },
  {
    name: "Apple M3 Max (96GB)",
    memory: 96,
    fp16Tflops: 110,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 400,
  },
  {
    name: "Apple M3 Pro (36GB)",
    memory: 36,
    fp16Tflops: 80,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 150,
  },
  {
    name: "Apple M3 Pro (18GB)",
    memory: 18,
    fp16Tflops: 70,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 150,
  },
  {
    name: "Apple M3 (24GB)",
    memory: 24,
    fp16Tflops: 50,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 100,
  },
  {
    name: "Apple M3 (16GB)",
    memory: 16,
    fp16Tflops: 45,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 100,
  },
  {
    name: "Apple M3 (8GB)",
    memory: 8,
    fp16Tflops: 40,
    architecture: "M3",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 100,
  },

  {
    name: "Apple M2 Ultra (192GB)",
    memory: 192,
    fp16Tflops: 120,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 800,
  },
  {
    name: "Apple M2 Ultra (128GB)",
    memory: 128,
    fp16Tflops: 110,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 800,
  },
  {
    name: "Apple M2 Max (96GB)",
    memory: 96,
    fp16Tflops: 100,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 400,
  },
  {
    name: "Apple M2 Max (64GB)",
    memory: 64,
    fp16Tflops: 90,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 400,
  },
  {
    name: "Apple M2 Pro (32GB)",
    memory: 32,
    fp16Tflops: 70,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 200,
  },
  {
    name: "Apple M2 Pro (16GB)",
    memory: 16,
    fp16Tflops: 60,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2023,
    memoryBandwidthInGB: 200,
  },
  {
    name: "Apple M2 (24GB)",
    memory: 24,
    fp16Tflops: 45,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2022,
    memoryBandwidthInGB: 100,
  },
  {
    name: "Apple M2 (16GB)",
    memory: 16,
    fp16Tflops: 40,
    architecture: "M2",
    category: "Apple Silicon",
    releaseYear: 2022,
    memoryBandwidthInGB: 100,
  },

  {
    name: "Apple M1 Ultra (128GB)",
    memory: 128,
    fp16Tflops: 90,
    architecture: "M1",
    category: "Apple Silicon",
    releaseYear: 2022,
    memoryBandwidthInGB: 800,
  },
  {
    name: "Apple M1 Max (64GB)",
    memory: 64,
    fp16Tflops: 80,
    architecture: "M1",
    category: "Apple Silicon",
    releaseYear: 2021,
    memoryBandwidthInGB: 400,
  },
  {
    name: "Apple M1 Max (32GB)",
    memory: 32,
    fp16Tflops: 70,
    architecture: "M1",
    category: "Apple Silicon",
    releaseYear: 2021,
    memoryBandwidthInGB: 400,
  },
  {
    name: "Apple M1 Pro (32GB)",
    memory: 32,
    fp16Tflops: 50,
    architecture: "M1",
    category: "Apple Silicon",
    releaseYear: 2021,
    memoryBandwidthInGB: 200,
  },
  {
    name: "Apple M1 Pro (16GB)",
    memory: 16,
    fp16Tflops: 45,
    architecture: "M1",
    category: "Apple Silicon",
    releaseYear: 2021,
    memoryBandwidthInGB: 200,
  },
  {
    name: "Apple M1 (16GB)",
    memory: 16,
    fp16Tflops: 35,
    architecture: "M1",
    category: "Apple Silicon",
    releaseYear: 2020,
    memoryBandwidthInGB: 68.3,
  },

  {
    name: "Intel Arc A770 (16GB)",
    memory: 16,
    fp16Tflops: 45,
    architecture: "Alchemist",
    category: "消费级",
    releaseYear: 2022,
    memoryBandwidthInGB: 560,
  },
  {
    name: "Intel Arc A770 (8GB)",
    memory: 8,
    fp16Tflops: 45,
    architecture: "Alchemist",
    category: "消费级",
    releaseYear: 2022,
    memoryBandwidthInGB: 512,
  },
  {
    name: "Intel Arc A750",
    memory: 8,
    fp16Tflops: 40,
    architecture: "Alchemist",
    category: "消费级",
    releaseYear: 2022,
    memoryBandwidthInGB: 512,
  },
  {
    name: "Huawei Ascend 910B",
    memory: 64,
    fp16Tflops: 320,
    architecture: "昇腾",
    category: "数据中心",
    releaseYear: 2023,
    memoryBandwidthInGB: 1200,
  },
  {
    name: "Huawei Ascend 910A",
    memory: 32,
    fp16Tflops: 280,
    architecture: "昇腾",
    category: "数据中心",
    releaseYear: 2022,
    memoryBandwidthInGB: 1024,
  },
  {
    name: "Huawei Ascend 910",
    memory: 32,
    fp16Tflops: 256,
    architecture: "昇腾",
    category: "数据中心",
    releaseYear: 2019,
    memoryBandwidthInGB: 1024,
  },
  {
    name: "Huawei Ascend 710",
    memory: 32,
    fp16Tflops: 128,
    architecture: "昇腾",
    category: "推理专用",
    releaseYear: 2019,
    memoryBandwidthInGB: 512,
  },
  {
    name: "Huawei Ascend 310P",
    memory: 16,
    fp16Tflops: 64,
    architecture: "昇腾",
    category: "推理专用",
    releaseYear: 2021,
    memoryBandwidthInGB: 51.2,
  },
  {
    name: "Huawei Ascend 310",
    memory: 8,
    fp16Tflops: 32,
    architecture: "昇腾",
    category: "推理专用",
    releaseYear: 2018,
    memoryBandwidthInGB: 51.2,
  },
].sort((a, b) => b.memory - a.memory); // 按显存大小排序

// 统一的模型数据结构
export interface ModelInfo {
  name: string;
  parameters: string; // 显示用的参数量字符串，如 "7B"
  parametersNum: number; // 用于计算的数值，如 7
  value: string; // 用于选择器的值
  d_model: number; // 模型维度，如4096、5120、8192等，影响模型的表达能力和计算量
  n_layers: number; // 模型层数，如32、40、64等，影响模型的表达能力和计算量
  n_kv_heads?: number; // KV attention heads数量（用于GQA/MQA/MLA），影响KV Cache大小
  d_head?: number; // 每个attention head的维度
  activeParams?: number; // MoE模型的激活参数数量
  isMoE?: boolean;
  source: string;
  verificationUrl?: string;
  series: string; // 模型系列，如 "DeepSeek", "Llama 4", "Qwen 3"
  category: string; // 模型类别，如 "原始模型", "蒸馏模型", "代码专用"
  defaultPrecision?: string; // 模型原生量化精度，如 "INT4"，选中该模型时自动设置
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
    n_kv_heads: 1,
    d_head: 288,
    activeParams: 37,
    isMoE: true,
    source: "DeepSeek-R1 official configuration",
    verificationUrl:
      "https://huggingface.co/deepseek-ai/DeepSeek-R1/blob/main/configuration_deepseek.py",
    series: "DeepSeek",
    category: "原始模型",
  },
  {
    name: "DeepSeek-V3",
    parameters: "671B",
    parametersNum: 671,
    value: "deepseek-v3",
    d_model: 7168,
    n_layers: 61,
    n_kv_heads: 1,
    d_head: 288,
    activeParams: 37,
    isMoE: true,
    source: "DeepSeek-V3 technical report",
    verificationUrl: "https://github.com/deepseek-ai/DeepSeek-V3",
    series: "DeepSeek",
    category: "原始模型",
  },

  // DeepSeek-R1 蒸馏系列 (基于Qwen)
  {
    name: "DeepSeek-R1-Distill-Qwen-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "deepseek-r1-distill-qwen-32b",
    d_model: 5120,
    n_layers: 64,
    n_kv_heads: 8,
    d_head: 128,
    source: "DeepSeek-R1 distilled from Qwen2.5-32B",
    verificationUrl:
      "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    series: "DeepSeek",
    category: "蒸馏模型",
  },
  {
    name: "DeepSeek-R1-Distill-Qwen-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "deepseek-r1-distill-qwen-14b",
    d_model: 5120,
    n_layers: 40,
    n_kv_heads: 8,
    d_head: 128,
    source: "DeepSeek-R1 distilled from Qwen2.5-14B",
    verificationUrl:
      "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
    series: "DeepSeek",
    category: "蒸馏模型",
  },
  {
    name: "DeepSeek-R1-Distill-Qwen-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "deepseek-r1-distill-qwen-7b",
    d_model: 3584,
    n_layers: 28,
    n_kv_heads: 4,
    d_head: 128,
    source: "DeepSeek-R1 distilled from Qwen2.5-Math-7B",
    verificationUrl:
      "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    series: "DeepSeek",
    category: "蒸馏模型",
  },
  {
    name: "DeepSeek-R1-Distill-Qwen-1.5B",
    parameters: "1.5B",
    parametersNum: 1.5,
    value: "deepseek-r1-distill-qwen-1.5b",
    d_model: 1536,
    n_layers: 28,
    n_kv_heads: 2,
    d_head: 128,
    source: "DeepSeek-R1 distilled from Qwen2.5-Math-1.5B",
    verificationUrl:
      "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
    series: "DeepSeek",
    category: "蒸馏模型",
  },

  // DeepSeek-R1 蒸馏系列 (基于Llama)
  {
    name: "DeepSeek-R1-Distill-Llama-70B",
    parameters: "70B",
    parametersNum: 70,
    value: "deepseek-r1-distill-llama-70b",
    d_model: 8192,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "DeepSeek-R1 distilled from Llama-3.3-70B-Instruct",
    verificationUrl:
      "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
    series: "DeepSeek",
    category: "蒸馏模型",
  },
  {
    name: "DeepSeek-R1-Distill-Llama-8B",
    parameters: "8B",
    parametersNum: 8,
    value: "deepseek-r1-distill-llama-8b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    source: "DeepSeek-R1 distilled from Llama-3.1-8B",
    verificationUrl:
      "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
    series: "DeepSeek",
    category: "蒸馏模型",
  },

  // Llama 4 系列 (已发布，可私有化部署)
  {
    name: "Llama 4 Scout",
    parameters: "109B",
    parametersNum: 109,
    value: "llama-4-scout",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 17,
    isMoE: true,
    source: "Meta AI official release - available on HuggingFace",
    verificationUrl:
      "https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct",
    series: "Llama 4",
    category: "原始模型",
  },
  {
    name: "Llama 4 Maverick",
    parameters: "400B",
    parametersNum: 400,
    value: "llama-4-maverick",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 17,
    isMoE: true,
    source: "Meta AI official release - available on HuggingFace",
    verificationUrl:
      "https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct",
    series: "Llama 4",
    category: "原始模型",
  },

  // Llama 3 系列 (开源可私有化部署)
  {
    name: "Llama 3 8B",
    parameters: "8B",
    parametersNum: 8,
    value: "llama-3-8b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3 technical specifications",
    verificationUrl:
      "https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md",
    series: "Llama 3",
    category: "原始模型",
  },
  {
    name: "Llama 3 70B",
    parameters: "70B",
    parametersNum: 70,
    value: "llama-3-70b",
    d_model: 8192,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3 technical specifications",
    verificationUrl:
      "https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md",
    series: "Llama 3",
    category: "原始模型",
  },
  {
    name: "Llama 3.1 8B",
    parameters: "8B",
    parametersNum: 8,
    value: "llama-3.1-8b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3.1 technical specifications",
    verificationUrl:
      "https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md",
    series: "Llama 3.1",
    category: "原始模型",
  },
  {
    name: "Llama 3.1 70B",
    parameters: "70B",
    parametersNum: 70,
    value: "llama-3.1-70b",
    d_model: 8192,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3.1 official model card",
    verificationUrl:
      "https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md",
    series: "Llama 3.1",
    category: "原始模型",
  },
  {
    name: "Llama 3.1 405B",
    parameters: "405B",
    parametersNum: 405,
    value: "llama-3.1-405b",
    d_model: 16384,
    n_layers: 126,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3.1 official model card",
    verificationUrl:
      "https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md",
    series: "Llama 3.1",
    category: "原始模型",
  },
  {
    name: "Llama 3.2 1B",
    parameters: "1B",
    parametersNum: 1,
    value: "llama-3.2-1b",
    d_model: 2048,
    n_layers: 16,
    n_kv_heads: 8,
    d_head: 64,
    source: "Llama 3.2 official model card",
    verificationUrl:
      "https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md",
    series: "Llama 3.2",
    category: "原始模型",
  },
  {
    name: "Llama 3.2 3B",
    parameters: "3B",
    parametersNum: 3,
    value: "llama-3.2-3b",
    d_model: 3072,
    n_layers: 28,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3.2 official model card",
    verificationUrl:
      "https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md",
    series: "Llama 3.2",
    category: "原始模型",
  },
  {
    name: "Llama 3.2 11B",
    parameters: "11B",
    parametersNum: 11,
    value: "llama-3.2-11b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3.2 official model card",
    verificationUrl:
      "https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md",
    series: "Llama 3.2",
    category: "原始模型",
  },
  {
    name: "Llama 3.2 90B",
    parameters: "90B",
    parametersNum: 90,
    value: "llama-3.2-90b",
    d_model: 8192,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "Llama 3.2 official model card",
    verificationUrl:
      "https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md",
    series: "Llama 3.2",
    category: "原始模型",
  },

  // Qwen 系列 (开源可私有化部署)
  // Qwen3.5 系列
  {
    name: "Qwen3.5-397B-A17B",
    parameters: "397B",
    parametersNum: 397,
    value: "qwen3.5-397b-a17b",
    d_model: 4096,
    n_layers: 94,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 17,
    isMoE: true,
    source: "Qwen3.5 official release - flagship MoE model with hybrid GDN + MoE architecture",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3.5-397B-A17B",
    series: "Qwen 3.5",
    category: "原始模型",
  },
  {
    name: "Qwen3.5-122B-A10B",
    parameters: "122B",
    parametersNum: 122,
    value: "qwen3.5-122b-a10b",
    d_model: 3072,
    n_layers: 64,
    n_kv_heads: 4,
    d_head: 128,
    activeParams: 10,
    isMoE: true,
    source: "Qwen3.5 official release - mid-size MoE model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3.5-122B-A10B",
    series: "Qwen 3.5",
    category: "原始模型",
  },
  {
    name: "Qwen3.5-35B-A3B",
    parameters: "35B",
    parametersNum: 35,
    value: "qwen3.5-35b-a3b",
    d_model: 2048,
    n_layers: 40,
    n_kv_heads: 4,
    d_head: 128,
    activeParams: 3,
    isMoE: true,
    source: "Qwen3.5 official release - compact MoE model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3.5-35B-A3B",
    series: "Qwen 3.5",
    category: "原始模型",
  },
  {
    name: "Qwen3.5-27B",
    parameters: "27B",
    parametersNum: 27,
    value: "qwen3.5-27b",
    d_model: 5120,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "Qwen3.5 official release - dense model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3.5-27B",
    series: "Qwen 3.5",
    category: "原始模型",
  },
  // Qwen3-Next 系列
  {
    name: "Qwen3-Next-80B-A3B-Instruct",
    parameters: "81B",
    parametersNum: 81,
    value: "qwen3-next-80b-a3b-instruct",
    d_model: 5120,
    n_layers: 72,
    n_kv_heads: 4,
    d_head: 128,
    activeParams: 3,
    isMoE: true,
    source: "Qwen3-Next official release - instruction-tuned model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct",
    series: "Qwen 3-Next",
    category: "原始模型",
  },
  {
    name: "Qwen3-Next-80B-A3B-Thinking",
    parameters: "81B",
    parametersNum: 81,
    value: "qwen3-next-80b-a3b-thinking",
    d_model: 5120,
    n_layers: 72,
    n_kv_heads: 4,
    d_head: 128,
    activeParams: 3,
    isMoE: true,
    source: "Qwen3-Next official release - reasoning-focused model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Thinking",
    series: "Qwen 3-Next",
    category: "推理专用",
  },
  {
    name: "Qwen3-Coder-480B-A35B",
    parameters: "480B",
    parametersNum: 480,
    value: "qwen3-coder-480b-a35b",
    d_model: 6144,
    n_layers: 94,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 35,
    isMoE: true,
    source: "Qwen3-Coder technical report - most powerful agentic coding model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct",
    series: "Qwen 3",
    category: "代码专用",
  },
  {
    name: "Qwen3-235B-A22B",
    parameters: "235B",
    parametersNum: 235,
    value: "qwen3-235b-a22b",
    d_model: 6144,
    n_layers: 94,
    n_kv_heads: 4,
    d_head: 128,
    activeParams: 22,
    isMoE: true,
    source: "Qwen3 technical report - flagship MoE model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3-235B-A22B",
    series: "Qwen 3",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-Math-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2.5-math-72b",
    d_model: 8192,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "Qwen2.5-72B official configuration",
    verificationUrl: "https://huggingface.co/Qwen/Qwen2.5-72B",
    series: "Qwen 2.5",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2.5-72b",
    d_model: 8192,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "Qwen2.5-72B HuggingFace model card",
    verificationUrl: "https://huggingface.co/Qwen/Qwen2.5-72B",
    series: "Qwen 2.5",
    category: "原始模型",
  },
  {
    name: "Qwen2-72B",
    parameters: "72B",
    parametersNum: 72,
    value: "qwen2-72b",
    d_model: 8192,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    source: "Estimated based on 70B architecture",
    series: "Qwen 2",
    category: "原始模型",
  },
  {
    name: "Qwen QwQ-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen-qwq-32b",
    d_model: 6656,
    n_layers: 60,
    n_kv_heads: 8,
    d_head: 128,
    source: "Estimated based on scaling laws",
    series: "Qwen QwQ",
    category: "推理专用",
  },
  {
    name: "Qwen2.5-Coder-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2.5-coder-32b",
    d_model: 6656,
    n_layers: 60,
    n_kv_heads: 8,
    d_head: 128,
    source: "Estimated based on scaling laws",
    series: "Qwen 2.5",
    category: "代码专用",
  },
  {
    name: "Qwen3-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen3-32b",
    d_model: 5120,
    n_layers: 64,
    n_kv_heads: 8,
    d_head: 128,
    source: "Qwen3 technical report",
    verificationUrl: "https://qwenlm.github.io/blog/qwen3/",
    series: "Qwen 3",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2.5-32b",
    d_model: 6656,
    n_layers: 60,
    n_kv_heads: 8,
    d_head: 128,
    source: "Estimated based on scaling laws",
    series: "Qwen 2.5",
    category: "原始模型",
  },
  {
    name: "Qwen2-32B",
    parameters: "32B",
    parametersNum: 32,
    value: "qwen2-32b",
    d_model: 6656,
    n_layers: 60,
    n_kv_heads: 8,
    d_head: 128,
    source: "Estimated based on scaling laws",
    series: "Qwen 2",
    category: "原始模型",
  },
  {
    name: "Qwen3-30B-A3B",
    parameters: "30B",
    parametersNum: 30,
    value: "qwen3-30b-a3b",
    d_model: 3072,
    n_layers: 48,
    n_kv_heads: 4,
    d_head: 128,
    activeParams: 3,
    isMoE: true,
    source: "Qwen3 technical report - MoE model",
    verificationUrl: "https://huggingface.co/Qwen/Qwen3-30B-A3B",
    series: "Qwen 3",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen2.5-14b",
    d_model: 5120,
    n_layers: 40,
    n_kv_heads: 8,
    d_head: 128,
    source: "Estimated based on 13B architecture",
    series: "Qwen 2.5",
    category: "原始模型",
  },
  {
    name: "Qwen3-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen3-14b",
    d_model: 4096,
    n_layers: 40,
    n_kv_heads: 8,
    d_head: 128,
    source: "Qwen3 technical report",
    verificationUrl: "https://qwenlm.github.io/blog/qwen3/",
    series: "Qwen 3",
    category: "原始模型",
  },
  {
    name: "Qwen2-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "qwen2-14b",
    d_model: 5120,
    n_layers: 40,
    n_kv_heads: 8,
    d_head: 128,
    source: "Estimated based on 13B architecture",
    series: "Qwen 2",
    category: "原始模型",
  },
  {
    name: "Qwen3-8B",
    parameters: "8B",
    parametersNum: 8,
    value: "qwen3-8b",
    d_model: 3584,
    n_layers: 36,
    n_kv_heads: 8,
    d_head: 128,
    source: "Qwen3 technical report",
    verificationUrl: "https://qwenlm.github.io/blog/qwen3/",
    series: "Qwen 3",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "qwen2.5-7b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 4,
    d_head: 128,
    source: "Estimated based on 7B architecture",
    series: "Qwen 2.5",
    category: "原始模型",
  },
  {
    name: "Qwen2-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "qwen2-7b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 4,
    d_head: 128,
    source: "Estimated based on 7B architecture",
    series: "Qwen 2",
    category: "原始模型",
  },
  {
    name: "Qwen3-4B",
    parameters: "4B",
    parametersNum: 4,
    value: "qwen3-4b",
    d_model: 2560,
    n_layers: 36,
    n_kv_heads: 4,
    d_head: 128,
    source: "Qwen3 technical report",
    verificationUrl: "https://qwenlm.github.io/blog/qwen3/",
    series: "Qwen 3",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-3B",
    parameters: "3B",
    parametersNum: 3,
    value: "qwen2.5-3b",
    d_model: 2048,
    n_layers: 28,
    n_kv_heads: 2,
    d_head: 128,
    source: "Estimated for 3B model",
    series: "Qwen 2.5",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-1.5B",
    parameters: "1.5B",
    parametersNum: 1.5,
    value: "qwen2.5-1.5b",
    d_model: 1536,
    n_layers: 24,
    n_kv_heads: 2,
    d_head: 128,
    source: "Estimated for 1.5B model",
    series: "Qwen 2.5",
    category: "原始模型",
  },
  {
    name: "Qwen2.5-0.5B",
    parameters: "0.5B",
    parametersNum: 0.5,
    value: "qwen2.5-0.5b",
    d_model: 1024,
    n_layers: 16,
    n_kv_heads: 2,
    d_head: 64,
    source: "Estimated for 0.5B model",
    series: "Qwen 2.5",
    category: "原始模型",
  },

  {
    name: "Qwen3-0.6B",
    parameters: "0.6B",
    parametersNum: 0.6,
    value: "qwen3-0.6b",
    d_model: 896,
    n_layers: 28,
    n_kv_heads: 8,
    d_head: 64,
    source: "Qwen3 technical report",
    verificationUrl: "https://qwenlm.github.io/blog/qwen3/",
    series: "Qwen 3",
    category: "原始模型",
  },
  {
    name: "Qwen3-1.7B",
    parameters: "1.7B",
    parametersNum: 1.7,
    value: "qwen3-1.7b",
    d_model: 1536,
    n_layers: 28,
    n_kv_heads: 4,
    d_head: 128,
    source: "Qwen3 technical report",
    verificationUrl: "https://qwenlm.github.io/blog/qwen3/",
    series: "Qwen 3",
    category: "原始模型",
  },

  // Mistral 系列 (开源可私有化部署)
  {
    name: "Mistral-Large-Instruct-2407",
    parameters: "123B",
    parametersNum: 123,
    value: "mistral-large-instruct-2407",
    d_model: 6144,
    n_layers: 88,
    n_kv_heads: 8,
    d_head: 128,
    source: "Mistral AI official release",
    verificationUrl:
      "https://huggingface.co/mistralai/Mistral-Large-Instruct-2407",
    series: "Mistral",
    category: "原始模型",
  },
  {
    name: "Mistral-Nemo-12B",
    parameters: "12B",
    parametersNum: 12,
    value: "mistral-nemo-12b",
    d_model: 5120,
    n_layers: 40,
    n_kv_heads: 8,
    d_head: 128,
    source: "NVIDIA & Mistral AI collaboration",
    verificationUrl: "https://huggingface.co/nvidia/Mistral-NeMo-12B-Base",
    series: "Mistral",
    category: "原始模型",
  },
  {
    name: "Mistral-7B-v0.3",
    parameters: "7B",
    parametersNum: 7,
    value: "mistral-7b-v0.3",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    source: "Mistral AI official release",
    verificationUrl: "https://huggingface.co/mistralai/Mistral-7B-v0.3",
    series: "Mistral",
    category: "原始模型",
  },
  {
    name: "Mixtral-8x7B",
    parameters: "46.7B",
    parametersNum: 46.7,
    value: "mixtral-8x7b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 12.9,
    isMoE: true,
    source: "Mistral AI MoE model",
    verificationUrl: "https://huggingface.co/mistralai/Mixtral-8x7B-v0.1",
    series: "Mixtral",
    category: "原始模型",
  },
  {
    name: "Mixtral-8x22B",
    parameters: "141B",
    parametersNum: 141,
    value: "mixtral-8x22b",
    d_model: 6144,
    n_layers: 56,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 39,
    isMoE: true,
    source: "Mistral AI large MoE model",
    verificationUrl: "https://huggingface.co/mistralai/Mixtral-8x22B-v0.1",
    series: "Mixtral",
    category: "原始模型",
  },

  // Gemma 系列 (Google开源)
  {
    name: "Gemma-2-27B",
    parameters: "27B",
    parametersNum: 27,
    value: "gemma-2-27b",
    d_model: 4608,
    n_layers: 46,
    n_kv_heads: 16,
    d_head: 128,
    source: "Google Gemma 2 series",
    verificationUrl: "https://huggingface.co/google/gemma-2-27b",
    series: "Gemma",
    category: "原始模型",
  },
  {
    name: "Gemma-2-9B",
    parameters: "9B",
    parametersNum: 9,
    value: "gemma-2-9b",
    d_model: 3584,
    n_layers: 42,
    n_kv_heads: 8,
    d_head: 256,
    source: "Google Gemma 2 series",
    verificationUrl: "https://huggingface.co/google/gemma-2-9b",
    series: "Gemma",
    category: "原始模型",
  },
  {
    name: "Gemma-2-2B",
    parameters: "2B",
    parametersNum: 2,
    value: "gemma-2-2b",
    d_model: 2304,
    n_layers: 26,
    n_kv_heads: 4,
    d_head: 256,
    source: "Google Gemma 2 series",
    verificationUrl: "https://huggingface.co/google/gemma-2-2b",
    series: "Gemma",
    category: "原始模型",
  },

  // Phi 系列 (Microsoft开源)
  {
    name: "Phi-3.5-MoE",
    parameters: "42B",
    parametersNum: 42,
    value: "phi-3.5-moe",
    d_model: 3072,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 6.6,
    isMoE: true,
    source: "Microsoft Phi-3.5 MoE model",
    verificationUrl: "https://huggingface.co/microsoft/Phi-3.5-MoE-instruct",
    series: "Phi",
    category: "原始模型",
  },
  {
    name: "Phi-3-14B",
    parameters: "14B",
    parametersNum: 14,
    value: "phi-3-14b",
    d_model: 5120,
    n_layers: 40,
    n_kv_heads: 10,
    d_head: 128,
    source: "Microsoft Phi-3 series",
    verificationUrl: "https://huggingface.co/microsoft/Phi-3-medium-14b",
    series: "Phi",
    category: "原始模型",
  },
  {
    name: "Phi-3-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "phi-3-7b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 8,
    d_head: 128,
    source: "Microsoft Phi-3 series",
    verificationUrl: "https://huggingface.co/microsoft/Phi-3-small-7b",
    series: "Phi",
    category: "原始模型",
  },
  {
    name: "Phi-3-3.8B",
    parameters: "3.8B",
    parametersNum: 3.8,
    value: "phi-3-3.8b",
    d_model: 3072,
    n_layers: 32,
    n_kv_heads: 32,
    d_head: 96,
    source: "Microsoft Phi-3 mini series",
    verificationUrl: "https://huggingface.co/microsoft/Phi-3-mini-3.8b",
    series: "Phi",
    category: "原始模型",
  },

  // CodeLlama 系列 (Meta代码专用)
  {
    name: "CodeLlama-34B",
    parameters: "34B",
    parametersNum: 34,
    value: "codellama-34b",
    d_model: 8192,
    n_layers: 48,
    n_kv_heads: 8,
    d_head: 128,
    source: "Meta CodeLlama for code generation",
    verificationUrl: "https://huggingface.co/codellama/CodeLlama-34b-hf",
    series: "CodeLlama",
    category: "代码专用",
  },
  {
    name: "CodeLlama-13B",
    parameters: "13B",
    parametersNum: 13,
    value: "codellama-13b",
    d_model: 5120,
    n_layers: 40,
    n_kv_heads: 40,
    d_head: 128,
    source: "Meta CodeLlama for code generation",
    verificationUrl: "https://huggingface.co/codellama/CodeLlama-13b-hf",
    series: "CodeLlama",
    category: "代码专用",
  },
  {
    name: "CodeLlama-7B",
    parameters: "7B",
    parametersNum: 7,
    value: "codellama-7b",
    d_model: 4096,
    n_layers: 32,
    n_kv_heads: 32,
    d_head: 128,
    source: "Meta CodeLlama for code generation",
    verificationUrl: "https://huggingface.co/codellama/CodeLlama-7b-hf",
    series: "CodeLlama",
    category: "代码专用",
  },

  // GLM-4.5 系列 (Z.ai开源智能体模型)
  {
    name: "GLM-4.5",
    parameters: "355B",
    parametersNum: 355,
    value: "glm-4.5",
    d_model: 7168, // Based on typical scaling for 355B models
    n_layers: 80, // Estimated based on parameter count
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 32,
    isMoE: true,
    source: "GLM-4.5 foundation model designed for intelligent agents",
    verificationUrl: "https://huggingface.co/zai-org/GLM-4.5",
    series: "GLM-4.5",
    category: "原始模型",
  },
  {
    name: "GLM-4.5-Air",
    parameters: "106B",
    parametersNum: 106,
    value: "glm-4.5-air",
    d_model: 5120, // More compact design than GLM-4.5
    n_layers: 60, // Estimated based on parameter count
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 12,
    isMoE: true,
    source: "GLM-4.5-Air compact model with superior efficiency",
    verificationUrl: "https://huggingface.co/zai-org/GLM-4.5-Air",
    series: "GLM-4.5",
    category: "原始模型",
  },
  {
    name: "GLM-4.5-Base",
    parameters: "355B",
    parametersNum: 355,
    value: "glm-4.5-base",
    d_model: 7168,
    n_layers: 80,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 32,
    isMoE: true,
    source: "GLM-4.5 base model before instruction tuning",
    verificationUrl: "https://huggingface.co/zai-org/GLM-4.5-Base",
    series: "GLM-4.5",
    category: "原始模型",
  },
  {
    name: "GLM-4.5-Air-Base",
    parameters: "106B",
    parametersNum: 106,
    value: "glm-4.5-air-base",
    d_model: 5120,
    n_layers: 60,
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 12,
    isMoE: true,
    source: "GLM-4.5-Air base model before instruction tuning",
    verificationUrl: "https://huggingface.co/zai-org/GLM-4.5-Air-Base",
    series: "GLM-4.5",
    category: "原始模型",
  },

  // GLM-5 系列 (Z.ai智谱AI开源智能体模型)
  {
    name: "GLM-5",
    parameters: "744B",
    parametersNum: 744,
    value: "glm-5",
    d_model: 7168, // Estimated: consistent with GLM-4.x series (GLM-4.5 uses 7168)
    n_layers: 94, // Estimated based on scaling from GLM-4.5 (80 layers at 355B to ~94 layers at 744B)
    n_kv_heads: 8, // Estimated: consistent with GLM-4.5 series GQA configuration
    d_head: 128,
    activeParams: 40,
    isMoE: true,
    source: "GLM-5: 744B-A40B MoE model for complex systems engineering and long-horizon agentic tasks (architecture params estimated from GLM-4.5 scaling)",
    verificationUrl: "https://huggingface.co/zai-org/GLM-5",
    series: "GLM-5",
    category: "原始模型",
  },

  // Kimi-K2.5 系列 (Moonshot AI原生INT4量化多模态智能体模型)
  {
    name: "Kimi-K2.5",
    parameters: "1T",
    parametersNum: 1000,
    value: "kimi-k2.5",
    d_model: 7168, // From official model card: Attention Hidden Dimension = 7168
    n_layers: 61, // From official model card: Number of Layers = 61
    n_kv_heads: 1, // MLA (Multi-head Latent Attention) stores compressed KV latent per token
    d_head: 512, // Estimated MLA compressed latent dimension (c_kv); actual KV footprint may differ
    activeParams: 32,
    isMoE: true,
    source: "Kimi-K2.5: 1T-A32B native multimodal agentic model with MLA attention; natively INT4 quantized — use INT4 precision for accurate memory calculation",
    verificationUrl: "https://huggingface.co/moonshotai/Kimi-K2.5",
    series: "Kimi K2.5",
    category: "原始模型",
    defaultPrecision: "INT4",
  },

  // MiniMax-M2.5 系列 (MiniMax AI高效编程智能体模型)
  {
    name: "MiniMax-M2.5",
    parameters: "230B",
    parametersNum: 230,
    value: "minimax-m2.5",
    d_model: 3072, // From MiniMaxM2 architecture (hidden_size=3072)
    n_layers: 62, // From MiniMaxM2 architecture (num_hidden_layers=62)
    n_kv_heads: 8, // From MiniMaxM2 architecture (num_key_value_heads=8, GQA)
    d_head: 128, // From MiniMaxM2 architecture (head_dim=128)
    activeParams: 10,
    isMoE: true,
    source: "MiniMax-M2.5: 230B-A10B MoE model (256 experts, top-8 routing) for coding and agentic tasks; architecture based on MiniMax-M2 design",
    verificationUrl: "https://huggingface.co/MiniMaxAI/MiniMax-M2.5",
    series: "MiniMax M2.5",
    category: "原始模型",
  },

  // GPT-OSS 系列 (OpenAI开源权重模型)
  {
    name: "GPT-OSS-120B",
    parameters: "117B",
    parametersNum: 117,
    value: "gpt-oss-120b",
    d_model: 6144, // Based on official specifications
    n_layers: 36, // From official spec table
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 5.1,
    isMoE: true,
    source: "OpenAI open-weight model designed for powerful reasoning and agentic tasks",
    verificationUrl: "https://huggingface.co/openai/gpt-oss-120b",
    series: "GPT-OSS",
    category: "原始模型",
  },
  {
    name: "GPT-OSS-20B",
    parameters: "21B",
    parametersNum: 21,
    value: "gpt-oss-20b",
    d_model: 4096, // Based on official specifications
    n_layers: 24, // From official spec table
    n_kv_heads: 8,
    d_head: 128,
    activeParams: 3.6,
    isMoE: true,
    source: "OpenAI open-weight model for lower latency and local use cases",
    verificationUrl: "https://huggingface.co/openai/gpt-oss-20b",
    series: "GPT-OSS",
    category: "原始模型",
  },
];

// 为了向后兼容，保留 modelExamples 导出
export const modelExamples = MODELS.map((model) => ({
  name: model.name,
  parameters: model.parameters,
  value: model.value,
}));

// 为了向后兼容，保留 MODEL_ARCHITECTURES 导出
export const MODEL_ARCHITECTURES: Record<
  string,
  {
    d_model: number;
    n_layers: number;
    n_kv_heads?: number;
    d_head?: number;
    activeParams?: number;
    isMoE?: boolean;
    source: string;
    verificationUrl?: string;
  }
> = Object.fromEntries(
  MODELS.map((model) => [
    model.parametersNum.toString(),
    {
      d_model: model.d_model,
      n_layers: model.n_layers,
      n_kv_heads: model.n_kv_heads,
      d_head: model.d_head,
      activeParams: model.activeParams,
      isMoE: model.isMoE,
      source: model.source,
      verificationUrl: model.verificationUrl,
    },
  ])
);

// 精度对性能的影响倍数
export const PRECISION_MULTIPLIERS: Record<string, number> = {
  FP32: 0.5, // 32位浮点，相比FP16性能减半
  FP16: 1.0, // 16位浮点基准
  BF16: 1.0, // Brain Float 16，类似FP16
  FP8: 2.0, // 8位浮点，2倍性能提升
  MXFP4: 4.0, // Microscaling FP4，4倍性能提升
  INT8: 2.0, // 8位整数，2倍性能提升
  INT4: 4.0, // 4位整数，4倍性能提升
  INT2: 8.0, // 2位整数，8倍性能提升
  INT1: 16.0, // 1位整数，16倍性能提升
  // GGUF 量化格式 (llama.cpp) - 基于内存带宽节省估算
  GGUF_Q8_0: 2.0, // ~8.5 bpw（内存带宽节省约1.9x，注意内存占用比INT8略高）
  GGUF_Q6_K: 2.4, // ~6.57 bpw
  GGUF_Q5_K_M: 2.8, // ~5.68 bpw
  GGUF_Q4_K_M: 3.3, // ~4.85 bpw，最常用
  GGUF_Q4_K_S: 3.7, // ~4.37 bpw
  GGUF_Q4_0: 3.5, // ~4.55 bpw（旧格式）
  GGUF_Q3_K_M: 4.8, // ~3.35 bpw
  GGUF_Q2_K: 6.0, // ~2.63 bpw，最高压缩率
};

// 精度对内存的影响（每个参数占用字节数）
export const PRECISION_BYTES: Record<string, number> = {
  FP32: 4, // 32位 = 4字节
  FP16: 2, // 16位 = 2字节
  BF16: 2, // Brain Float 16 = 2字节
  FP8: 1, // 8位 = 1字节
  MXFP4: 0.5, // Microscaling FP4 = 0.5字节
  INT8: 1, // 8位整数 = 1字节
  INT4: 0.5, // 4位 = 0.5字节
  INT2: 0.25, // 2位 = 0.25字节
  INT1: 0.125, // 1位 = 0.125字节
  // GGUF 量化格式 (llama.cpp) - 基于实际 bits-per-weight 计算：bpw / 8
  GGUF_Q8_0: 1.0625, // ~8.5 bpw (8 bits/weight + 4-bit scale per 32 weights)
  GGUF_Q6_K: 0.8213, // ~6.57 bpw (k-quant混合量化)
  GGUF_Q5_K_M: 0.71, // ~5.68 bpw (k-quant混合量化)
  GGUF_Q4_K_M: 0.6063, // ~4.85 bpw（最常用，quality/size最佳平衡）
  GGUF_Q4_K_S: 0.5463, // ~4.37 bpw（Q4_K小版本）
  GGUF_Q4_0: 0.5688, // ~4.55 bpw（旧格式，不推荐新部署）
  GGUF_Q3_K_M: 0.4188, // ~3.35 bpw (k-quant混合量化)
  GGUF_Q2_K: 0.3288, // ~2.63 bpw（最高压缩率，质量损失最大）
};

// 创建GPU性能查找映射（向后兼容）
export const GPU_FP16_TFLOPS: Record<string, number> = Object.fromEntries(
  gpuModels.map((gpu) => [gpu.name, gpu.fp16Tflops])
);

// 创建GPU内存带宽查找映射
export const GPU_MEMORY_BANDWIDTH: Record<string, number> = Object.fromEntries(
  gpuModels.map((gpu) => [gpu.name, gpu.memoryBandwidthInGB])
);

// 根据系列和类别对模型进行分组的辅助函数
export const getModelsByGroup = () => {
  const groups: Record<string, ModelInfo[]> = {};

  MODELS.forEach((model) => {
    const groupKey = model.series;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(model);
  });

  // 按系列名称排序，优先显示最新发布的系列
  const seriesOrder = [
    // 2026 年发布
    "Kimi K2.5",
    "GLM-5",
    "MiniMax M2.5",
    "Qwen 3.5",
    "Qwen 3-Next",
    // 2025 年发布
    "GPT-OSS",
    "GLM-4.5",
    "Qwen 3",
    "Llama 4",
    "DeepSeek",
    // 2024 年及更早
    "Qwen QwQ",
    "Llama 3.2",
    "Qwen 2.5",
    "Llama 3.1",
    "Qwen 2",
    "Llama 3",
    "Gemma",
    "Mixtral",
    "Mistral",
    "Phi",
    "CodeLlama",
  ];

  const sortedGroups: Record<string, ModelInfo[]> = {};

  // 按预定义顺序添加系列
  seriesOrder.forEach((series) => {
    if (groups[series]) {
      // 在每个系列内按参数大小排序（从大到小）
      sortedGroups[series] = groups[series].sort(
        (a, b) => b.parametersNum - a.parametersNum
      );
    }
  });

  // 添加任何未在预定义顺序中的系列
  Object.keys(groups).forEach((series) => {
    if (!seriesOrder.includes(series)) {
      sortedGroups[series] = groups[series].sort(
        (a, b) => b.parametersNum - a.parametersNum
      );
    }
  });

  return sortedGroups;
};

// 根据类别获取模型
export const getModelsByCategory = () => {
  const categories: Record<string, ModelInfo[]> = {};

  MODELS.forEach((model) => {
    const categoryKey = model.category;
    if (!categories[categoryKey]) {
      categories[categoryKey] = [];
    }
    categories[categoryKey].push(model);
  });

  return categories;
};
