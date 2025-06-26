import { MODELS, MODEL_ARCHITECTURES, GPU_FP16_TFLOPS, PRECISION_MULTIPLIERS, PRECISION_BYTES } from './constants'

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
  // 使用共享函数计算单GPU吞吐量
  const singleGpuThroughput = calculateSingleGpuThroughput(
    parameters, activeParams, batchSize, contextLength, gpuModel, precision, selectedModel
  )

  // 多GPU并行效率 - 基于现代推理框架的实际表现
  const parallelEfficiency = calculateParallelEfficiency(requiredGPUs)

  // 总吞吐量
  const totalThroughput = singleGpuThroughput * requiredGPUs * parallelEfficiency

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

// 基于实际基准测试数据的模型效率
function getModelEfficiency(parameters: number, selectedModel?: string): number {
  // 基于Database Mart A100 80GB基准测试的实际效率数据
  // 来源: https://www.databasemart.com/blog/vllm-gpu-benchmark-a100-80gb
  // 测试条件: A100 80GB, 50并发, FP16精度

  // DeepSeek蒸馏模型效率（基于实际测试校准）
  if (selectedModel && selectedModel.toLowerCase().includes('deepseek')) {
    if (parameters <= 10) return 0.12 // DeepSeek 7-8B: 实测约12% (2825 tokens/s)
    if (parameters <= 20) return 0.20 // DeepSeek 14B: 实测约20% (2552 tokens/s)
    if (parameters <= 40) return 0.08 // DeepSeek 32B: 实测约8% (472 tokens/s，受内存带宽限制)
    if (parameters <= 100) return 0.12 // DeepSeek 70B: 估算12%
    return 0.15 // DeepSeek-R1 671B: MoE架构效率更高
  }

  // Gemma模型效率（基于实际测试校准）
  if (selectedModel && selectedModel.toLowerCase().includes('gemma')) {
    if (parameters <= 15) return 0.018 // Gemma 9B: 实测约1.8% (328 tokens/s，效率极低)
    if (parameters <= 35) return 0.025 // Gemma 27B: 估算2.5%
    return 0.03
  }

  // QwQ模型效率
  if (selectedModel && selectedModel.toLowerCase().includes('qwq')) {
    if (parameters <= 40) return 0.10 // QwQ 32B: 估算10%
    return 0.12
  }

  // Qwen模型系列效率
  if (selectedModel && selectedModel.toLowerCase().includes('qwen')) {
    if (parameters <= 10) return 0.15 // Qwen 7-8B: 15%
    if (parameters <= 20) return 0.13 // Qwen 14B: 13%
    if (parameters <= 40) return 0.11 // Qwen 32B: 11%
    if (parameters <= 100) return 0.09 // Qwen 72B: 9%
    return 0.12 // Qwen 大模型: 12%
  }

  // Llama模型系列效率
  if (selectedModel && selectedModel.toLowerCase().includes('llama')) {
    if (parameters <= 10) return 0.14 // Llama 7-8B: 14%
    if (parameters <= 20) return 0.12 // Llama 13B: 12%
    if (parameters <= 40) return 0.10 // Llama 33B: 10%
    if (parameters <= 100) return 0.08 // Llama 70B: 8%
    return 0.10 // Llama 大模型: 10%
  }

  // 通用模型效率（基于参数大小，更保守的估算）
  if (parameters <= 10) {
    return 0.12 // 小模型: 12% (基于实测数据调整)
  } else if (parameters <= 20) {
    return 0.10 // 中型模型: 10%
  } else if (parameters <= 40) {
    return 0.08 // 大型模型: 8%
  } else if (parameters <= 100) {
    return 0.06 // 超大模型: 6%
  } else {
    return 0.04 // 极大模型: 4%
  }
}

// 计算并行效率的通用函数
function calculateParallelEfficiency(gpus: number): number {
  let parallelEfficiency = 1.0
  if (gpus > 1) {
    if (gpus <= 8) {
      parallelEfficiency = Math.max(0.85, 1.0 - (gpus - 1) * 0.02)
    } else if (gpus <= 32) {
      parallelEfficiency = Math.max(0.80, 0.85 - (gpus - 8) * 0.01)
    } else {
      parallelEfficiency = Math.max(0.80, 0.80 - (gpus - 32) * 0.003)
    }
  }
  return parallelEfficiency
}

// 计算单GPU实际吞吐量的通用函数 - 消除重复代码
function calculateSingleGpuThroughput(
  parameters: number,
  activeParams: number,
  batchSize: number,
  contextLength: number,
  gpuModel: string,
  precision: string,
  selectedModel?: string
): number {
  // 获取GPU性能
  const basePerformance = GPU_FP16_TFLOPS[gpuModel] || 100
  const adjustedPerformance = basePerformance * (PRECISION_MULTIPLIERS[precision] || 1.0)

  // 模型计算量估算 (FLOPS per token) - 推理只需要2倍参数量
  // 为避免数值溢出，重新组织计算顺序
  const flopsPerTokenInBillions = 2 * activeParams // 以十亿为单位

  // 理论峰值吞吐量 (tokens/s)
  // 重新组织计算：(adjustedPerformance * 1e12) / (flopsPerTokenInBillions * 1e9)
  // = (adjustedPerformance * 1e3) / flopsPerTokenInBillions
  const theoreticalThroughput = (adjustedPerformance * 1000) / flopsPerTokenInBillions

  // 数值安全检查：确保结果在合理范围内
  if (!Number.isFinite(theoreticalThroughput) || theoreticalThroughput <= 0) {
    console.warn(`计算异常: GPU=${gpuModel}, activeParams=${activeParams}, theoreticalThroughput=${theoreticalThroughput}`)
    return 1 // 返回最小合理值
  }

  // 基于实际基准测试数据的效率因子
  let efficiencyFactor = getModelEfficiency(parameters, selectedModel)

  // 并发数对效率的影响
  if (batchSize >= 32) {
    efficiencyFactor *= 1.15
  } else if (batchSize >= 8) {
    efficiencyFactor *= 1.1
  }

  // 上下文长度对效率的影响
  if (contextLength > 8192) {
    efficiencyFactor *= 0.92
  }

  // 单GPU实际吞吐量
  return theoreticalThroughput * efficiencyFactor

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

  // 使用共享函数计算单GPU吞吐量
  const singleGpuThroughput = calculateSingleGpuThroughput(
    parameters, activeParams, batchSize, contextLength, gpuModel, precision, selectedModel
  )

  // 计算基于性能需求的GPU数量
  let performanceBasedGPUs = Math.ceil(requiredTotalThroughput / singleGpuThroughput)

  // 考虑多GPU并行效率损失，需要迭代计算
  let actualGPUs = performanceBasedGPUs
  let actualTotalThroughput = 0

  // 扩大搜索范围，最多搜索到200张卡或者performanceBasedGPUs*2的较大值
  const maxSearchGPUs = Math.min(200, Math.max(performanceBasedGPUs * 2, performanceBasedGPUs + 20))

  for (let gpus = 1; gpus <= maxSearchGPUs; gpus++) {
    // 使用统一的并行效率计算
    const parallelEfficiency = calculateParallelEfficiency(gpus)
    const totalThroughput = singleGpuThroughput * gpus * parallelEfficiency
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
  const kvCacheSizePerToken = calcKvCacheSizePerToken(n_layers, d_model)
  const effectiveContextLength = getEffectiveContextLength(contextLength)
  const kvCacheMemory = kvCacheSizePerToken * effectiveContextLength * batchSize
  const activationMemory = calcActivationMemory(activeParams, batchSize, contextLength)
  const computationMemory = calcComputationMemory(activeParams, batchSize, contextLength)
  const totalMemory = modelMemory + kvCacheMemory + activationMemory + computationMemory

  const memoryBasedGPUs = Math.ceil(totalMemory / gpuMemory)
  const finalGPUs = Math.max(actualGPUs, memoryBasedGPUs)

  // 计算最终性能
  const finalParallelEfficiency = calculateParallelEfficiency(finalGPUs)
  const finalTotalThroughput = singleGpuThroughput * finalGPUs * finalParallelEfficiency
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
      const testParallelEfficiency = calculateParallelEfficiency(testGpus)
      const testTotalThroughput = singleGpuThroughput * testGpus * testParallelEfficiency
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
  const kvCacheSizePerToken = calcKvCacheSizePerToken(n_layers, d_model)
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

