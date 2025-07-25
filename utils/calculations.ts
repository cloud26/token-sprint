import { log } from 'console'
import { MODELS, MODEL_ARCHITECTURES, GPU_FP16_TFLOPS, GPU_MEMORY_BANDWIDTH, PRECISION_MULTIPLIERS, PRECISION_BYTES } from './constants'

interface MemoryCalculationResult {
  modelMemory: number // 模型本身
  kvCacheMemory: number // KV Cache (与并发量和上下文长度相关)
  activationMemory: number // 激活值 (与并发量相关)
  computationMemory: number // 临时计算缓存 (与并发量相关)
  totalMemory: number
  requiredGPUs: number // 实际使用的GPU数量（可能是手动设置的）
  kvCacheSizePerToken: number // KV Cache每个token的大小
  architectureInfo: {
    d_model: number
    n_layers: number
    activeParams: number
    isMoE: boolean
    source: string
    verificationUrl?: string
  }
  throughputInfo: {
    tokensPerSecond: number // 总吞吐量 (tokens/s)
    tokensPerSecondPerUser: number // 每用户吞吐量 (tokens/s/user)
    estimatedLatency: number // 估算延迟 (ms)
    maxQPS: number // 最大QPS (queries/s)
    avgOutputTokens: number // 平均输出长度 (tokens)
  }
  performanceAnalysis?: {
    expectedTokensPerSecond: number // 期望的每用户体验
    meetsExpectation: boolean // 是否满足期望
    minRequiredGPUs: number // 满足期望体验的最少GPU数量
    recommendedAction: string // 推荐操作
  }
  gpuAnalysis: {
    baseRequiredGPUs: number // 基于内存需求的最少GPU数量
    isManuallySet: boolean // 是否手动设置了GPU数量
    isMemorySufficient: boolean // 内存是否充足
    memoryWarning?: string // 内存警告信息
  }
}

// 根据参数估算模型架构
function estimateModelArchitecture(parameters: number): {
  d_model: number;
  n_layers: number;
  activeParams: number;
  isMoE: boolean;
} {
  const paramStr = parameters.toString()

  // 首先尝试精确匹配
  if (MODEL_ARCHITECTURES[paramStr]) {
    const arch = MODEL_ARCHITECTURES[paramStr]
    return {
      d_model: arch.d_model,
      n_layers: arch.n_layers,
      activeParams: arch.activeParams || parameters, // 如果没有指定激活参数，默认等于总参数
      isMoE: arch.isMoE || false
    }
  }

  // 如果没有精确匹配，使用经验公式估算
  // 基于已知模型的线性插值和经验规律
  let n_layers: number
  let d_model: number

  if (parameters <= 10) {
    // 小模型：基于7B-8B模型的比例缩放
    n_layers = 32
    d_model = Math.round((parameters / 7) * 4096)
  } else if (parameters <= 20) {
    // 中小模型：基于13B-14B模型的比例缩放
    n_layers = 40
    d_model = Math.round((parameters / 13) * 5120)
  } else if (parameters <= 80) {
    // 中大模型：基于70B模型的比例缩放
    n_layers = 80
    d_model = Math.round((parameters / 70) * 8192)
  } else if (parameters <= 200) {
    // 大模型：基于已知架构线性插值
    // 70B: d_model=8192, n_layers=80
    // 405B: d_model=16384, n_layers=126
    const ratio = (parameters - 70) / (405 - 70)
    n_layers = Math.round(80 + ratio * (126 - 80))
    d_model = Math.round(8192 + ratio * (16384 - 8192))
  } else {
    // 超大模型：基于671B模型的比例缩放
    n_layers = Math.min(144, Math.max(80, Math.round((parameters / 671) * 144)))
    d_model = Math.round((parameters / 671) * 18432)
  }

  return {
    d_model,
    n_layers,
    activeParams: parameters, // 默认情况下激活参数等于总参数
    isMoE: false
  }
}

// 简化的激活值内存计算
function calcActivationMemory(
  activeParams: number,
  batchSize: number,
  contextLength: number
): number {
  // 基于实际测试数据调整激活内存计算
  // 参考：vLLM、Ollama等推理框架的实际内存使用
  // 推理时激活内存远小于训练时的需求

  // 基础激活内存：基于SGLang、vLLM等实际框架的内存使用
  // 现代推理框架有大量内存优化，激活内存远小于理论值
  // 参考SGLang在L20上运行Qwen3-32B的实际表现
  const baseMemory = activeParams * 0.04 // 每B参数基础激活内存 40MB

  // 批次影响：线性增长，但有内存复用优化
  // batch=1: 1x, batch=4: 2.5x, batch=8: 4x, batch=32: 8x
  const batchMultiplier = batchSize <= 8
    ? Math.sqrt(batchSize) * 1.4 // 平方根增长，体现内存复用
    : Math.sqrt(8) * 1.4 + Math.log2(batchSize / 8) * 1.5 // 大批次时对数增长

  // 上下文影响：对激活内存影响较小（主要影响KV Cache）
  // 1K: 1x, 4K: 1.2x, 16K: 1.5x, 64K: 2x
  const contextFactor = contextLength <= 4096
    ? 1 + (contextLength - 1024) / 16384 // 轻微线性增长
    : 1.2 + Math.log2(contextLength / 4096) * 0.3 // 长上下文时对数增长

  const totalActivationMemory = baseMemory * batchMultiplier * contextFactor
  return Math.max(0.2, Math.min(totalActivationMemory, 200)) // 合理的上限
}

// 简化的计算内存
function calcComputationMemory(
  activeParams: number,
  batchSize: number,
  contextLength: number
): number {
  // 计算内存主要用于临时张量、梯度缓存和中间结果
  // 推理时比训练时需求小很多
  const activationMemory = calcActivationMemory(activeParams, batchSize, contextLength)
  const computationMemory = activationMemory * 0.2 // 20%的激活内存，基于SGLang等框架的实际表现

  return Math.max(0.1, Math.min(computationMemory, 30)) // 更严格的上限，基于实际推理需求
}

// 计算KV Cache每个token的大小 (GB) - 精确公式
function calcKvCacheSizePerToken(n_layers: number, d_model: number, precision: string = "FP16"): number {
  const BYTES_IN_GB = 1_073_741_824

  // 根据模型精度确定KV Cache的字节数
  // 现代推理框架通常会对KV Cache使用与模型相同或更低的精度
  let kvCacheBytes = 2 // 默认FP16
  if (precision === "FP8" || precision === "INT8") {
    kvCacheBytes = 1 // FP8/INT8模型通常KV Cache也使用8位
  } else if (precision === "INT4") {
    kvCacheBytes = 0.5 // INT4模型可能KV Cache使用4位或8位，取中间值
  } else if (precision === "FP32") {
    kvCacheBytes = 4 // FP32模型
  }

  // 公式: 2 (key + value) * kvCacheBytes * n_layers * d_model
  const theoreticalSize = (2 * kvCacheBytes * n_layers * d_model) / BYTES_IN_GB

  // 应用实际推理框架的优化因子
  // 基于SGLang、vLLM等框架的实际表现，KV Cache有显著优化
  // 参考SGLang在L20上成功运行Qwen3-32B的表现
  const optimizationFactor = 0.6 // 40%的优化空间，包括压缩、量化、分页等

  return theoreticalSize * optimizationFactor
}

// 直接使用用户选择的上下文长度作为平均值
// 现在界面上显示的是"Average Context Length"，所以用户选择的就是平均使用长度
function getEffectiveContextLength(avgContextLength: number): number {
  // 用户选择的就是平均上下文长度，直接返回
  return avgContextLength
}

// 简化的KV Cache计算 - 基于参数数量的经验公式
function calcSimplifiedKvCache(parameters: number, contextLength: number, batchSize: number): number {
  // 简化公式：每B参数大约需要 X MB 的KV Cache per token
  // 基于常见模型的经验数据：
  // - 7B模型: ~0.01 GB/token
  // - 70B模型: ~0.1 GB/token  
  // - 671B模型: ~0.7 GB/token

  const kvCachePerTokenGB = parameters * 0.001 // 每B参数对应1MB/token的KV Cache
  return kvCachePerTokenGB * contextLength * batchSize
}

// 获取模型架构的可验证信息
function getModelArchitectureInfo(parameters: number, selectedModel?: string): {
  d_model: number;
  n_layers: number;
  activeParams: number;
  isMoE: boolean;
  source: string; // 信息来源，帮助用户验证
  verificationUrl?: string; // 验证链接
} {
  // 如果提供了具体的模型名称，优先根据模型名称查找
  if (selectedModel) {
    // 在MODELS中查找匹配的模型
    const foundModel = MODELS.find(model =>
      model.value === selectedModel ||
      model.name.toLowerCase().includes(selectedModel.toLowerCase()) ||
      selectedModel.toLowerCase().includes(model.name.toLowerCase())
    );

    if (foundModel) {
      return {
        d_model: foundModel.d_model,
        n_layers: foundModel.n_layers,
        activeParams: foundModel.activeParams || foundModel.parametersNum,
        isMoE: foundModel.isMoE || false,
        source: foundModel.source,
        verificationUrl: foundModel.verificationUrl
      }
    }
  }

  // 如果没有找到匹配的模型名称，回退到参数量查找
  const paramStr = parameters.toString()
  if (MODEL_ARCHITECTURES[paramStr]) {
    const model = MODEL_ARCHITECTURES[paramStr]
    return {
      d_model: model.d_model,
      n_layers: model.n_layers,
      activeParams: model.activeParams || parameters,
      isMoE: model.isMoE || false,
      source: model.source,
      verificationUrl: model.verificationUrl
    }
  }

  // 估算的架构（标注为估算）
  const estimated = estimateModelArchitecture(parameters)
  return {
    ...estimated,
    source: 'Estimated based on parameter count (not verified)',
  }
}

// 根据context length估算平均输出长度
function getAvgOutputTokens(contextLength: number): number {
  // 基于实际使用场景的更合理估算
  // 原则：输出长度通常不会线性增长，而是对数增长

  if (contextLength <= 2048) {
    // 2K: 简单问答、代码补全 - 短回答
    return 100
  } else if (contextLength <= 4096) {
    // 4K: 标准对话、文档分析 - 中等回答
    return 150
  } else if (contextLength <= 8192) {
    // 8K: 长文档、复杂推理 - 稍长回答
    return 150  // 从200降到150，增长更平缓
  } else if (contextLength <= 16384) {
    // 16K: 书籍章节、深度分析 - 长回答
    return 300  // 适合章节级推理/总结任务，真实输出多为 200–400
  } else if (contextLength <= 32768) {
    // 32K: 整本书籍、代码库 - 很长回答
    return 400  // 从800降到400
  } else if (contextLength <= 65536) {
    // 64K: 超长上下文、多文档 - 超长回答
    return 600  // 从1200降到600
  } else if (contextLength <= 131072) {
    // 128K: 海量文档、全景分析 - 极长回答
    return 800  // 固定值，避免过度增长
  } else {
    // 256K+: 超大规模处理 - 但输出通常仍有限制
    return Math.min(1000, 800 + Math.log2(contextLength / 131072) * 100) // 对数增长，最多1000
  }
}

// 计算吞吐量性能 - 基于实际基准测试数据优化
function calcThroughputInfo(
  parameters: number,
  activeParams: number,
  batchSize: number,
  contextLength: number,
  gpuModel: string,
  precision: string,
  requiredGPUs: number,
  selectedModel?: string // 新增：具体模型名称用于精确匹配
): {
  tokensPerSecond: number;
  tokensPerSecondPerUser: number;
  estimatedLatency: number;
  maxQPS: number;
  avgOutputTokens: number;
} {
  // 使用新的多GPU吞吐量计算函数
  const totalThroughput = calculateMultiGpuThroughput(
    parameters, activeParams, batchSize, contextLength, gpuModel, precision, requiredGPUs, selectedModel
  )

  // 每用户吞吐量
  const throughputPerUser = totalThroughput / batchSize

  // 使用标准化的输出长度进行性能计算，确保不同模型间的可比性
  const avgOutputTokens = getAvgOutputTokens(contextLength)
  const estimatedLatency = (avgOutputTokens / throughputPerUser) * 1000

  // QPS计算 - 基于标准输出长度
  const maxQPSByThroughput = totalThroughput / avgOutputTokens
  const avgResponseTimeSeconds = avgOutputTokens / throughputPerUser
  const maxQPSByConcurrency = batchSize / avgResponseTimeSeconds
  const maxQPS = Math.min(maxQPSByThroughput, maxQPSByConcurrency)

  return {
    tokensPerSecond: Math.round(totalThroughput),
    tokensPerSecondPerUser: Math.round(throughputPerUser),
    estimatedLatency: Math.round(estimatedLatency),
    maxQPS: Math.round(maxQPS * 10) / 10,
    avgOutputTokens: avgOutputTokens,
  }
}



// 计算系统效率因子 - 统一的效率计算逻辑
function calculateSystemEfficiency(
  batchSize: number,
  contextLength: number,
  precision: string
): number {
  // 基于实际基准测试数据校准
  // 参考: https://www.databasemart.com/blog/vllm-gpu-benchmark-dual-a100-40gb
  // vLLM在高并发下表现优异，移除过于保守的基础效率限制
  let systemEfficiency = 1.0 // 移除基础效率限制，从理论峰值开始计算

  // 批次大小对效率的影响
  if (batchSize >= 32) {
    systemEfficiency *= 1.2 // 大批次提高效率
  } else if (batchSize >= 8) {
    systemEfficiency *= 1.1
  } else if (batchSize === 1) {
    systemEfficiency *= 0.7 // 单用户时效率较低
  }

  // 上下文长度对效率的影响
  if (contextLength > 32768) {
    systemEfficiency *= 0.8 // 超长上下文降低效率
  } else if (contextLength > 8192) {
    systemEfficiency *= 0.9
  }

  // 精度对系统效率的影响 - 基于实际测试调整
  if (precision === 'INT4') {
    systemEfficiency *= 1.2 // INT4在实际测试中表现更好
  } else if (precision === 'INT8') {
    systemEfficiency *= 1.1 // INT8也有提升
  }

  // 推理框架开销（SGLang、vLLM等现代框架优化很好）
  systemEfficiency *= 0.85 // 推理框架开销15%，基于SGLang等高性能框架

  return systemEfficiency
}

// 计算多GPU聚合吞吐量 - 考虑模型并行和数据并行的区别
function calculateMultiGpuThroughput(
  parameters: number,
  activeParams: number,
  batchSize: number,
  contextLength: number,
  gpuModel: string,
  precision: string,
  requiredGPUs: number,
  selectedModel?: string
): number {
  // 获取GPU基础性能参数
  const computeTflops = GPU_FP16_TFLOPS[gpuModel] || 100
  const memoryBandwidthGB = GPU_MEMORY_BANDWIDTH[gpuModel] || 1000 // GB/s
  const precisionMultiplier = PRECISION_MULTIPLIERS[precision] || 1.0
  const bytesPerParam = PRECISION_BYTES[precision] || 2
  const effectiveParams = activeParams

  // 1. 计算限制：多GPU情况下计算能力线性叠加
  const flopsPerTokenInBillions = 2 * effectiveParams
  const totalComputeTflops = computeTflops * requiredGPUs * precisionMultiplier
  const computeBoundThroughput = (totalComputeTflops * 1000) / flopsPerTokenInBillions

  // 2. 内存带宽限制：考虑L2缓存命中率的影响
  const modelWeightBytesPerGpu = (effectiveParams * 1e9 * bytesPerParam) / requiredGPUs

  // L2缓存命中率计算 - 基于模型大小和访问模式
  // 参考：arXiv:2504.06319 "Accelerating LLM Inference Throughput via Asynchronous KV Cache Prefetching"
  // 以及实际GPU基准测试数据
  const l2CacheHitRate = calculateL2CacheHitRate(effectiveParams, batchSize, contextLength, gpuModel, requiredGPUs, precision)

  // 有效内存访问量 = 总访问量 × (1 - 缓存命中率)
  // 缓存命中的数据从L2缓存读取（速度更快），缓存未命中的数据从HBM读取
  const effectiveMemoryAccessRatio = 1 - l2CacheHitRate

  // 主要的内存带宽消耗：模型权重读取（考虑缓存命中率）
  // 只有缓存未命中的访问才会消耗HBM带宽
  const memoryAccessPerGpuPerToken = modelWeightBytesPerGpu * effectiveMemoryAccessRatio
  const memoryAccessGBPerGpuPerToken = memoryAccessPerGpuPerToken / 1e9

  // 单GPU的内存带宽限制吞吐量
  const singleGpuMemoryThroughput = memoryBandwidthGB / memoryAccessGBPerGpuPerToken

  // 多GPU的聚合内存带宽吞吐量（考虑GPU间通信开销）
  const interGpuCommEfficiency = calculateInterGpuCommEfficiency(requiredGPUs)
  const aggregateMemoryThroughput = singleGpuMemoryThroughput * requiredGPUs * interGpuCommEfficiency

  // 3. 实际吞吐量受限于计算和内存带宽的较小值
  const theoreticalThroughput = Math.min(computeBoundThroughput, aggregateMemoryThroughput)

  // 数值安全检查
  if (!Number.isFinite(theoreticalThroughput) || theoreticalThroughput <= 0) {
    console.warn(`多GPU计算异常: GPUs=${requiredGPUs}, activeParams=${activeParams}, theoreticalThroughput=${theoreticalThroughput}`)
    return requiredGPUs // 返回一个保守的默认值
  }

  // 4. 应用统一的系统效率因子
  const systemEfficiency = calculateSystemEfficiency(batchSize, contextLength, precision)

  return theoreticalThroughput * systemEfficiency
}

// 计算L2缓存命中率 - 基于模型大小、批次大小和访问模式
function calculateL2CacheHitRate(
  activeParams: number,
  batchSize: number,
  contextLength: number,
  gpuModel: string,
  requiredGPUs: number = 1,
  precision: string = "FP16"
): number {
  // 基于并发数的缓存命中率：反映权重访问重叠概率
  // 逻辑：N个用户同时访问，权重复用的概率增加

  let cacheHitRate: number
  if (batchSize === 1) {
    cacheHitRate = 0.0  // 单用户没有缓存复用
  } else {
    // 多用户时，缓存命中率约等于 (N-1)/N，但考虑实际访问模式
    cacheHitRate = 1 - 1 / batchSize  // 2用户=50%, 4用户=75%, 10用户=90%
  }

  // 精度对缓存命中率影响不大，保持公式简洁

  // 确保命中率在合理范围内 [0.0, 0.95]
  return Math.max(0.0, Math.min(0.95, cacheHitRate))
}

// 获取GPU的L2缓存大小（MB）
function getGpuL2CacheSize(gpuModel: string): number {
  // 基于公开的GPU规格数据
  const l2CacheSizes: Record<string, number> = {
    // NVIDIA Hopper架构
    'NVIDIA H200': 114, // 114MB L2 cache
    'NVIDIA H100': 50,  // 50MB L2 cache  
    'NVIDIA H20': 48,   // 48MB L2 cache

    // NVIDIA Ampere架构
    'NVIDIA A100 (80GB)': 40, // 40MB L2 cache
    'NVIDIA A100 (40GB)': 40,
    'NVIDIA A40': 6,
    'NVIDIA A30': 24,
    'NVIDIA A10': 6,

    // NVIDIA Ada Lovelace架构
    'NVIDIA RTX 6000 Ada': 96,
    'NVIDIA RTX 5000 Ada': 64,
    'NVIDIA RTX 4000 Ada': 36,
    'NVIDIA RTX 3000 Ada': 24,

    // NVIDIA RTX 5000系列
    'NVIDIA RTX 5090': 128,
    'NVIDIA RTX 5080 SUPER': 96,
    'NVIDIA RTX 5080': 64,
    'NVIDIA RTX 5070 Ti SUPER': 64,
    'NVIDIA RTX 5070 Ti': 48,
    'NVIDIA RTX 5070 SUPER': 48,
    'NVIDIA RTX 5070': 36,

    // NVIDIA RTX 4000系列
    'NVIDIA RTX 4090': 72,
    'NVIDIA RTX 4080 SUPER': 64,
    'NVIDIA RTX 4080': 64,
    'NVIDIA RTX 4070 Ti Super': 48,
    'NVIDIA RTX 4070 Ti': 48,
    'NVIDIA RTX 4070': 36,
    'NVIDIA RTX 4060 Ti (16GB)': 32,
    'NVIDIA RTX 4060 Ti (8GB)': 32,
    'NVIDIA RTX 4060': 24,

    // NVIDIA RTX 3000系列
    'NVIDIA RTX 3090 Ti': 6,
    'NVIDIA RTX 3090': 6,
    'NVIDIA RTX 3080 Ti': 6,
    'NVIDIA RTX 3080': 5,
    'NVIDIA RTX 3070 Ti': 4,

    // AMD数据中心
    'AMD Instinct MI300X': 256, // 256MB L2 cache
    'AMD Instinct MI250X': 8,
    'AMD Instinct MI100': 8,

    // Apple Silicon
    'Apple M4 Max (128GB)': 32,
    'Apple M4 Max (64GB)': 32,
    'Apple M4 Max (36GB)': 32,

    // 默认值
    'default': 32
  }

  return l2CacheSizes[gpuModel] || l2CacheSizes['default']
}

// 计算GPU间通信效率
function calculateInterGpuCommEfficiency(gpus: number): number {
  if (gpus === 1) return 1.0

  // 基于现代GPU互联技术（NVLink, InfiniBand等）的实际性能
  if (gpus <= 2) {
    return 0.95 // 2卡NVLink效率很高
  } else if (gpus <= 4) {
    return 0.90 // 4卡NVLink仍然很好
  } else if (gpus <= 8) {
    return 0.85 // 8卡需要更复杂的拓扑，效率下降
  } else if (gpus <= 16) {
    return 0.80 // 跨节点通信开始影响性能
  } else if (gpus <= 32) {
    return 0.75 // 大规模部署，通信开销显著
  } else {
    return Math.max(0.70, 0.75 - (gpus - 32) * 0.005) // 超大规模，效率进一步下降
  }
}

// 保留原有的并行效率函数作为备用（兼容性）
function calculateParallelEfficiency(gpus: number): number {
  return calculateInterGpuCommEfficiency(gpus)
}



// 计算KV Cache每个token的字节数
function calcKvCacheBytesPerToken(parameters: number, selectedModel?: string): number {
  // 获取模型架构信息
  const architectureInfo = getModelArchitectureInfo(parameters, selectedModel)
  const { d_model, n_layers } = architectureInfo

  // KV Cache: 2 (key + value) * 2 (FP16字节数) * n_layers * d_model
  return 2 * 2 * n_layers * d_model
}

// 计算满足期望体验的最少GPU数量
function calculateMinRequiredGPUs(
  parameters: number,
  activeParams: number,
  batchSize: number,
  contextLength: number,
  gpuModel: string,
  precision: string,
  selectedModel: string | undefined,
  expectedTokensPerSecond: number,
  gpuMemory: number
): { minGPUs: number; actualPerformance: number; recommendation: string } {
  if (expectedTokensPerSecond <= 0) {
    return { minGPUs: 1, actualPerformance: 0, recommendation: "请设置期望体验值" }
  }

  // 需要的总吞吐量
  const requiredTotalThroughput = expectedTokensPerSecond * batchSize

  // 使用单GPU吞吐量作为基准来估算初始GPU数量
  const singleGpuThroughput = calculateMultiGpuThroughput(
    parameters, activeParams, batchSize, contextLength, gpuModel, precision, 1, selectedModel
  )

  // 计算基于性能需求的GPU数量（粗略估算）
  let performanceBasedGPUs = Math.ceil(requiredTotalThroughput / singleGpuThroughput)

  // 考虑多GPU并行效率损失，需要迭代计算
  let actualGPUs = performanceBasedGPUs
  let actualTotalThroughput = 0

  // 扩大搜索范围，最多搜索到200张卡或者performanceBasedGPUs*2的较大值
  const maxSearchGPUs = Math.min(200, Math.max(performanceBasedGPUs * 2, performanceBasedGPUs + 20))

  for (let gpus = 1; gpus <= maxSearchGPUs; gpus++) {
    // 使用新的多GPU吞吐量计算
    const totalThroughput = calculateMultiGpuThroughput(
      parameters, activeParams, batchSize, contextLength, gpuModel, precision, gpus, selectedModel
    )
    const throughputPerUser = totalThroughput / batchSize

    if (throughputPerUser >= expectedTokensPerSecond) {
      actualGPUs = gpus
      actualTotalThroughput = totalThroughput
      break
    }
  }

  // 检查内存是否足够（基于基础内存需求）
  const bytesPerParameter = PRECISION_BYTES[precision] || 4
  const modelMemory = parameters * bytesPerParameter
  const architectureInfo = getModelArchitectureInfo(parameters, selectedModel)
  const { d_model, n_layers } = architectureInfo
  const kvCacheSizePerToken = calcKvCacheSizePerToken(n_layers, d_model, precision)
  const effectiveContextLength = getEffectiveContextLength(contextLength)
  const kvCacheMemory = kvCacheSizePerToken * effectiveContextLength * batchSize
  const activationMemory = calcActivationMemory(activeParams, batchSize, contextLength)
  const computationMemory = calcComputationMemory(activeParams, batchSize, contextLength)
  const totalMemory = modelMemory + kvCacheMemory + activationMemory + computationMemory

  const memoryBasedGPUs = Math.ceil(totalMemory / gpuMemory)
  const finalGPUs = Math.max(actualGPUs, memoryBasedGPUs)

  // 计算最终性能
  const finalTotalThroughput = calculateMultiGpuThroughput(
    parameters, activeParams, batchSize, contextLength, gpuModel, precision, finalGPUs, selectedModel
  )
  const finalThroughputPerUser = finalTotalThroughput / batchSize

  // 生成推荐
  let recommendation = ""
  if (finalGPUs === memoryBasedGPUs && finalGPUs > actualGPUs) {
    recommendation = `受内存限制，需要${finalGPUs}张卡。实际体验将超出期望`
  } else if (finalThroughputPerUser >= expectedTokensPerSecond) {
    recommendation = `推荐配置：${finalGPUs}张${gpuModel.split(' (')[0]}`
  } else {
    // 如果还是不满足，继续搜索更多GPU
    let foundSolution = false
    for (let testGpus = finalGPUs + 1; testGpus <= 300; testGpus++) {
      const testTotalThroughput = calculateMultiGpuThroughput(
        parameters, activeParams, batchSize, contextLength, gpuModel, precision, testGpus, selectedModel
      )
      const testThroughputPerUser = testTotalThroughput / batchSize

      if (testThroughputPerUser >= expectedTokensPerSecond) {
        recommendation = `需要${testGpus}张${gpuModel.split(' (')[0]}才能满足期望体验`
        foundSolution = true
        break
      }
    }

    if (!foundSolution) {
      recommendation = `警告：即使使用大量GPU，可能仍难以满足${expectedTokensPerSecond} token/s的期望体验`
    }
  }

  return {
    minGPUs: finalGPUs,
    actualPerformance: Math.round(finalThroughputPerUser),
    recommendation
  }
}

// 实际输出长度估算 - 基于实际基准测试数据（用于展示信息）
function getRealisticOutputTokens(contextLength: number, parameters: number, selectedModel?: string): number {
  // 基于实际基准测试，大多数模型的输出长度远低于预期
  // 实际观察：Gemma输出很短(20-160)，DeepSeek输出较长(350-560)

  let baseOutputTokens: number

  // 根据模型类型调整基础输出长度
  if (selectedModel && selectedModel.toLowerCase().includes('gemma')) {
    // Gemma模型倾向于简洁回答
    baseOutputTokens = parameters <= 15 ? 50 : 120
  } else if (selectedModel && selectedModel.toLowerCase().includes('deepseek')) {
    // DeepSeek蒸馏模型倾向于详细回答
    baseOutputTokens = Math.min(400, 200 + parameters * 8)
  } else if (selectedModel && selectedModel.toLowerCase().includes('qwq')) {
    // QwQ推理模型输出较长
    baseOutputTokens = 450
  } else {
    // 通用模型
    baseOutputTokens = 150 + parameters * 3
  }

  // 根据上下文长度调整（但增长幅度有限）
  let contextMultiplier = 1.0
  if (contextLength <= 2048) {
    contextMultiplier = 0.8 // 短上下文，简短回答
  } else if (contextLength <= 4096) {
    contextMultiplier = 1.0 // 标准长度
  } else if (contextLength <= 8192) {
    contextMultiplier = 1.1 // 稍长
  } else if (contextLength <= 16384) {
    contextMultiplier = 1.3 // 中长
  } else if (contextLength <= 32768) {
    contextMultiplier = 1.5 // 长
  } else {
    contextMultiplier = 1.8 // 超长，但增长有限
  }

  const adjustedTokens = baseOutputTokens * contextMultiplier

  // 确保在合理范围内
  return Math.max(20, Math.min(800, Math.round(adjustedTokens)))
}

export function calculateInferenceMemory(
  parameters: number,
  precision: string,
  gpuMemory: number,
  batchSize: number = 1, // 并发量
  contextLength: number = 4096, // 上下文长度
  gpuModel: string = "NVIDIA A100 (80GB)", // GPU型号
  selectedModel?: string, // 新增：选中的具体模型名称
  expectedTokensPerSecond?: number, // 新增：期望的每用户体验
  manualGpuCount?: number, // 新增：手动设置的GPU数量
): MemoryCalculationResult {
  // 计算每个参数占用的字节数 - 从constants.ts导入
  const bytesPerParameter = PRECISION_BYTES[precision] || 4 // 默认 FP32

  // 获取模型架构参数（包含验证信息）- 现在传入模型名称
  const architectureInfo = getModelArchitectureInfo(parameters, selectedModel)
  const { d_model, n_layers, activeParams, isMoE } = architectureInfo

  // 1. 模型权重内存 (GB) - 基于总参数
  const modelMemory = parameters * bytesPerParameter

  // 2. KV Cache 内存 (GB) - 考虑实际使用率
  const kvCacheSizePerToken = calcKvCacheSizePerToken(n_layers, d_model, precision)
  const effectiveContextLength = getEffectiveContextLength(contextLength)
  const kvCacheMemory = kvCacheSizePerToken * effectiveContextLength * batchSize

  // 3. 激活值内存 (GB) - 基于研究论文的科学公式
  const activationMemory = calcActivationMemory(
    activeParams, batchSize, contextLength
  )

  // 4. 临时计算缓存 (GB) - 基于实际计算需求
  const computationMemory = calcComputationMemory(
    activeParams, batchSize, contextLength
  )

  // 总内存
  const totalMemory = modelMemory + kvCacheMemory + activationMemory + computationMemory

  // 计算所需的 GPU 数量（向上取整）
  const baseRequiredGPUs = Math.ceil(totalMemory / gpuMemory)

  // 使用手动设置的GPU数量或计算出的数量
  const actualGPUs = manualGpuCount && manualGpuCount > 0 ? manualGpuCount : baseRequiredGPUs

  // 检查手动设置的GPU数量是否足够
  const isManualGpuSufficient = !manualGpuCount || manualGpuCount >= baseRequiredGPUs

  // 5. 吞吐量信息
  const throughputInfo = calcThroughputInfo(
    parameters, activeParams, batchSize, contextLength, gpuModel, precision, actualGPUs, selectedModel
  )

  // 6. 性能分析（如果提供了期望体验）
  let performanceAnalysis = undefined
  if (expectedTokensPerSecond && expectedTokensPerSecond > 0) {
    const minGPUAnalysis = calculateMinRequiredGPUs(
      parameters, activeParams, batchSize, contextLength, gpuModel, precision,
      selectedModel, expectedTokensPerSecond, gpuMemory
    )

    performanceAnalysis = {
      expectedTokensPerSecond,
      meetsExpectation: throughputInfo.tokensPerSecondPerUser >= expectedTokensPerSecond,
      minRequiredGPUs: minGPUAnalysis.minGPUs,
      recommendedAction: minGPUAnalysis.recommendation
    }
  }

  // GPU分析信息
  const gpuAnalysis = {
    baseRequiredGPUs,
    isManuallySet: !!(manualGpuCount && manualGpuCount > 0),
    isMemorySufficient: isManualGpuSufficient,
    memoryWarning: !isManualGpuSufficient ? `警告：设置的${actualGPUs}张GPU内存不足，至少需要${baseRequiredGPUs}张` : undefined
  }

  return {
    modelMemory: Number(modelMemory.toFixed(2)),
    kvCacheMemory: Number(kvCacheMemory.toFixed(2)),
    activationMemory: Number(activationMemory.toFixed(2)),
    computationMemory: Number(computationMemory.toFixed(2)),
    totalMemory: Number(totalMemory.toFixed(2)),
    requiredGPUs: actualGPUs,
    kvCacheSizePerToken: Number(kvCacheSizePerToken.toFixed(6)),
    architectureInfo: architectureInfo,
    throughputInfo: throughputInfo,
    performanceAnalysis: performanceAnalysis,
    gpuAnalysis: gpuAnalysis,
  }
}

