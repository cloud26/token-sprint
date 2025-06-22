import { MODELS, MODEL_ARCHITECTURES, GPU_PERFORMANCE, PRECISION_MULTIPLIERS, PRECISION_BYTES } from './constants'

interface MemoryCalculationResult {
  modelMemory: number // 模型本身
  kvCacheMemory: number // KV Cache (与并发量和上下文长度相关)
  activationMemory: number // 激活值 (与并发量相关)
  computationMemory: number // 临时计算缓存 (与并发量相关)
  totalMemory: number
  requiredGPUs: number
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
  // 简化公式：激活值内存主要取决于批次大小和模型大小
  // 经验数据：每B参数在推理时需要约 0.1-1GB 的激活内存
  
  const baseMemory = activeParams * 0.2 // 每B参数基础激活内存 200MB
  
  // 批次影响：线性增长，但考虑内存优化的递减效应
  // batch=1: 1x, batch=8: 6x, batch=32: 16x (而不是32x)
  const batchMultiplier = batchSize <= 8 
    ? batchSize 
    : 8 + Math.sqrt(batchSize - 8) * 2 // 大批次时增长放缓
  
  // 上下文影响：基本线性，但长上下文有优化空间
  // 4K: 1x, 16K: 3x, 64K: 8x, 128K: 12x (而不是32x)
  const contextFactor = contextLength <= 4096
    ? contextLength / 4096
    : 1 + Math.log2(contextLength / 4096) * 0.8 // 长上下文增长放缓
  
  const totalActivationMemory = baseMemory * batchMultiplier * contextFactor
  return Math.max(0.5, Math.min(totalActivationMemory, 500)) // 提高上限到500GB
}

// 简化的计算内存
function calcComputationMemory(
  activeParams: number,
  batchSize: number,
  contextLength: number
): number {
  // 简化公式：计算内存主要是临时张量和中间结果
  // 经验数据：通常是激活内存的30-50%
  const activationMemory = calcActivationMemory(activeParams, batchSize, contextLength)
  const computationMemory = activationMemory * 0.4 // 40%的激活内存
  
  return Math.max(0.2, Math.min(computationMemory, 200)) // 提高上限到200GB
}

// 计算KV Cache每个token的大小 (GB) - 精确公式
function calcKvCacheSizePerToken(n_layers: number, d_model: number): number {
  const BYTES_IN_GB = 1_073_741_824
  // 公式: 2 (key + value) * 2 (FP16字节数) * n_layers * d_model
  return (2 * 2 * n_layers * d_model) / BYTES_IN_GB
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
  // 获取GPU性能
  const basePerformance = GPU_PERFORMANCE[gpuModel] || 100
  const adjustedPerformance = basePerformance * (PRECISION_MULTIPLIERS[precision] || 1.0)
  
  // 模型计算量估算 (FLOPS per token)
  const flopsPerToken = 6 * activeParams * 1e9
  
  // 理论峰值吞吐量 (tokens/s)
  const theoreticalThroughput = (adjustedPerformance * 1e12) / flopsPerToken
  
  // 基于实际基准测试数据的效率因子
  let efficiencyFactor = getModelEfficiency(parameters, selectedModel)
  
  // 并发数对效率的影响 (基于实际测试数据调整)
  if (batchSize >= 32) {
    efficiencyFactor *= 1.15 // 高并发时效率提升更明显
  } else if (batchSize >= 8) {
    efficiencyFactor *= 1.1
  }
  
  // 上下文长度对效率的影响
  if (contextLength > 8192) {
    efficiencyFactor *= 0.92 // 长上下文影响较小
  }
  
  // 单GPU实际吞吐量
  const singleGpuThroughput = theoreticalThroughput * Math.min(efficiencyFactor, 1.0)
  
  // 多GPU并行效率
  let parallelEfficiency = 1.0
  if (requiredGPUs > 1) {
    parallelEfficiency = Math.max(0.75, 1.0 - (requiredGPUs - 1) * 0.04)
  }
  
  // 总吞吐量
  const totalThroughput = singleGpuThroughput * requiredGPUs * parallelEfficiency
  
  // 每用户吞吐量
  const throughputPerUser = totalThroughput / batchSize
  
  // 更准确的输出长度估算
  const avgOutputTokens = getRealisticOutputTokens(contextLength, parameters, selectedModel)
  const estimatedLatency = (avgOutputTokens / throughputPerUser) * 1000
  
  // QPS计算
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

// 基于实际基准测试数据的模型效率
function getModelEfficiency(parameters: number, selectedModel?: string): number {
  // 基于Database Mart A100 80GB基准测试的实际效率数据
  // 来源: https://www.databasemart.com/blog/vllm-gpu-benchmark-a100-80gb
  
  // DeepSeek蒸馏模型效率明显更高
  if (selectedModel && selectedModel.toLowerCase().includes('deepseek')) {
    if (parameters <= 10) return 0.23 // DeepSeek 7-8B: ~23%
    if (parameters <= 20) return 0.20 // DeepSeek 14B: ~20%
    if (parameters <= 40) return 0.18 // DeepSeek 32B: ~18%
    return 0.15
  }
  
  // Gemma模型效率
  if (selectedModel && selectedModel.toLowerCase().includes('gemma')) {
    if (parameters <= 15) return 0.16 // Gemma 9B: ~16%
    if (parameters <= 35) return 0.13 // Gemma 27B: ~13%
    return 0.12
  }
  
  // QwQ模型效率
  if (selectedModel && selectedModel.toLowerCase().includes('qwq')) {
    if (parameters <= 40) return 0.19 // QwQ 32B: ~19%
    return 0.16
  }
  
  // 通用模型效率（基于参数大小）
  if (parameters <= 10) {
    return 0.20 // 小模型: 20%
  } else if (parameters <= 20) {
    return 0.17 // 中型模型: 17%
  } else if (parameters <= 40) {
    return 0.15 // 大型模型: 15%
  } else if (parameters <= 100) {
    return 0.12 // 超大模型: 12%
  } else {
    return 0.08 // 极大模型: 8%
  }
}

// 更现实的输出长度估算 - 基于实际基准测试数据
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
): MemoryCalculationResult {
  // 计算每个参数占用的字节数 - 从constants.ts导入
  const bytesPerParameter = PRECISION_BYTES[precision] || 4 // 默认 FP32

  // 获取模型架构参数（包含验证信息）- 现在传入模型名称
  const architectureInfo = getModelArchitectureInfo(parameters, selectedModel)
  const { d_model, n_layers, activeParams, isMoE } = architectureInfo
  
  // 1. 模型权重内存 (GB) - 基于总参数
  const modelMemory = parameters * bytesPerParameter

  // 2. KV Cache 内存 (GB) - 使用精确公式
  const kvCacheSizePerToken = calcKvCacheSizePerToken(n_layers, d_model)
  const kvCacheMemory = kvCacheSizePerToken * contextLength * batchSize

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
  const requiredGPUs = Math.ceil(totalMemory / gpuMemory)

  // 5. 吞吐量信息
  const throughputInfo = calcThroughputInfo(
    parameters, activeParams, batchSize, contextLength, gpuModel, precision, requiredGPUs, selectedModel
  )

  return {
    modelMemory: Number(modelMemory.toFixed(2)),
    kvCacheMemory: Number(kvCacheMemory.toFixed(2)),
    activationMemory: Number(activationMemory.toFixed(2)),
    computationMemory: Number(computationMemory.toFixed(2)),
    totalMemory: Number(totalMemory.toFixed(2)),
    requiredGPUs: requiredGPUs,
    kvCacheSizePerToken: Number(kvCacheSizePerToken.toFixed(6)),
    architectureInfo: architectureInfo,
    throughputInfo: throughputInfo,
  }
}

