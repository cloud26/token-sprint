import { NextResponse } from 'next/server'
import { logLLMCalculation, LogLevel } from '@/lib/datadog-server-logger'

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const {
            parameters,
            precision,
            gpuModel,
            gpuMemory,
            batchSize,
            contextLength,
            expectedTokensPerSecond,
            manualGpuCount,
            totalMemory,
            requiredGPUs,
            locale,
            selectedModel,
            // 性能指标
            throughputInfo,
            // GPU分析
            gpuAnalysis,
            // 性能分析
            performanceAnalysis
        } = data

        // 基础配置信息
        console.log(`[${locale}] === LLM部署配置计算 ===`)
        console.log(`[${locale}] 模型配置: ${selectedModel || '自定义模型'} (${parameters}B参数)`)
        console.log(`[${locale}] 运行配置: ${precision}精度, ${contextLength}平均上下文长度, ${batchSize}并发用户`)
        console.log(`[${locale}] 硬件配置: ${gpuModel} (${gpuMemory}GB显存)`)

        // 用户期望与实际配置
        if (expectedTokensPerSecond && Number(expectedTokensPerSecond) > 1) {
            console.log(`[${locale}] 用户期望: 每用户${expectedTokensPerSecond} tokens/s`)
        }
        if (manualGpuCount) {
            console.log(`[${locale}] 用户设置GPU数量: ${manualGpuCount}个`)
        }

        // 计算结果
        console.log(`[${locale}] === 计算结果 ===`)
        console.log(`[${locale}] 显存需求: ${totalMemory}GB (需要${requiredGPUs}个GPU)`)

        // 内存分解详情
        if (data.memoryBreakdown) {
            const { modelMemory, kvCacheMemory, activationMemory, computationMemory } = data.memoryBreakdown
            console.log(`[${locale}] 内存分解:`)
            console.log(`[${locale}]   - 模型权重: ${modelMemory}GB`)
            console.log(`[${locale}]   - KV 缓存: ${kvCacheMemory}GB`)
            console.log(`[${locale}]   - 激活内存: ${activationMemory}GB`)
            console.log(`[${locale}]   - 计算缓存: ${computationMemory}GB`)
        }

        // 架构信息
        if (data.architectureInfo) {
            const { d_model, n_layers, activeParams, isMoE, source } = data.architectureInfo
            console.log(`[${locale}] 模型架构:`)
            console.log(`[${locale}]   - 隐藏层维度: ${d_model}`)
            console.log(`[${locale}]   - 层数: ${n_layers}`)
            console.log(`[${locale}]   - 激活参数: ${activeParams}B`)
            console.log(`[${locale}]   - MoE模型: ${isMoE ? '是' : '否'}`)
            console.log(`[${locale}]   - 数据来源: ${source}`)
        }

        // 性能指标
        if (throughputInfo) {
            console.log(`[${locale}] 性能指标:`)
            console.log(`[${locale}]   - 总吞吐量: ${throughputInfo.tokensPerSecond} tokens/s`)
            console.log(`[${locale}]   - 每用户吞吐量: ${throughputInfo.tokensPerSecondPerUser} tokens/s/user`)
            console.log(`[${locale}]   - 预估延迟: ${throughputInfo.estimatedLatency}ms`)
            console.log(`[${locale}]   - 最大QPS: ${throughputInfo.maxQPS} queries/s`)
        }

        // GPU分析
        if (gpuAnalysis) {
            console.log(`[${locale}] GPU分析:`)
            console.log(`[${locale}]   - 基础GPU需求: ${gpuAnalysis.baseRequiredGPUs}个`)
            if (gpuAnalysis.memoryWarning) {
                console.log(`[${locale}]   - ⚠️  显存警告: ${gpuAnalysis.memoryWarning}`)
            }
        }

        // 性能分析
        if (performanceAnalysis && Number(expectedTokensPerSecond) > 1) {
            console.log(`[${locale}] 性能分析:`)
            console.log(`[${locale}]   - 性能需求GPU: ${performanceAnalysis.minRequiredGPUs}个`)
            console.log(`[${locale}]   - 期望vs实际: ${expectedTokensPerSecond} vs ${throughputInfo?.tokensPerSecondPerUser} tokens/s/user`)
            console.log(`[${locale}]   - 性能评估: ${performanceAnalysis.meetsExpectation ? '✅ 满足期望' : '❌ 低于期望'}`)
            if (performanceAnalysis.recommendedAction) {
                console.log(`[${locale}]   - 建议操作: ${performanceAnalysis.recommendedAction}`)
            }
        }

        // 优化建议
        if (gpuAnalysis?.memoryWarning || (performanceAnalysis && !performanceAnalysis.meetsExpectation)) {
            console.log(`[${locale}] === 优化建议 ===`)
            if (gpuAnalysis?.memoryWarning) {
                console.log(`[${locale}] 💡 显存优化: 增加GPU数量或降低并发/上下文长度`)
                console.log(`[${locale}]    详细: ${gpuAnalysis.memoryWarning}`)
            }
            if (performanceAnalysis && !performanceAnalysis.meetsExpectation) {
                console.log(`[${locale}] 💡 性能优化: 需要${performanceAnalysis.minRequiredGPUs}个GPU以满足性能要求`)
                if (performanceAnalysis.recommendedAction) {
                    console.log(`[${locale}]    建议: ${performanceAnalysis.recommendedAction}`)
                }
            }
        } else {
            console.log(`[${locale}] ✅ 配置状态: 当前配置满足所有需求`)
        }

        console.log(`[${locale}] ================================`)

        // 发送日志到 Datadog
        try {
            await logLLMCalculation({
                message: `LLM GPU Memory Calculation - ${selectedModel || 'Custom Model'} (${parameters}B parameters)`,
                level: LogLevel.INFO,
                calculationType: 'llm-gpu-memory',
                parameters: {
                    modelName: selectedModel,
                    parameters,
                    precision,
                    gpuModel,
                    gpuMemory,
                    batchSize,
                    contextLength,
                    expectedTokensPerSecond: Number(expectedTokensPerSecond),
                    locale
                },
                results: {
                    totalMemory,
                    requiredGPUs,
                    memoryBreakdown: data.memoryBreakdown,
                    performanceAnalysis: {
                        throughputInfo,
                        gpuAnalysis,
                        performanceAnalysis
                    }
                },
                context: {
                    userAgent: request.headers.get('user-agent'),
                    timestamp: new Date().toISOString(),
                    sessionId: request.headers.get('x-session-id'), // 如果前端发送了会话ID
                },
                tags: [
                    `model:${selectedModel || 'custom'}`,
                    `precision:${precision}`,
                    `gpu:${gpuModel}`,
                    `locale:${locale}`
                ]
            })
        } catch (datadogError) {
            console.error('Failed to send log to Datadog:', datadogError)
            // 不影响主要功能，继续执行
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('记录日志失败:', error)
        return NextResponse.json({ success: false, error: '记录日志失败' }, { status: 500 })
    }
} 