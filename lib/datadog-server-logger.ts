/**
 * 服务器端 Datadog 日志工具
 * 
 * 使用 Datadog HTTP API 发送日志，适用于 Next.js API 路由
 */

import { datadogConfig, isDatadogEnabled } from '@/config/datadog'

// 日志级别枚举
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// 日志数据接口
export interface ServerLogData {
  message: string
  level: LogLevel
  context?: Record<string, any>
  tags?: string[]
  timestamp?: Date
}

// LLM 计算相关的日志数据接口
export interface LLMCalculationLogData extends ServerLogData {
  calculationType: 'llm-gpu-memory' | 'token-counter' | 'token-generation-speed'
  parameters?: {
    modelName?: string
    parameters?: number
    precision?: string
    gpuModel?: string
    gpuMemory?: number
    batchSize?: number
    contextLength?: number
    expectedTokensPerSecond?: number
    locale?: string
  }
  results?: {
    totalMemory?: number
    requiredGPUs?: number
    tokensPerSecond?: number
    memoryBreakdown?: Record<string, number>
    performanceAnalysis?: Record<string, any>
  }
}

class DatadogServerLogger {
  private readonly apiUrl: string

  constructor() {
    // 构建 Datadog Logs API URL
    this.apiUrl = `https://http-intake.logs.${datadogConfig.site}/v1/input/${datadogConfig.clientToken}`
  }

  private shouldLog(): boolean {
    return isDatadogEnabled()
  }

  private async sendToDatadog(logData: any): Promise<void> {
    if (!this.shouldLog()) {
      return
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to send log to Datadog:', error)
      // 不抛出错误，避免影响主要功能
    }
  }

  public async log(data: ServerLogData): Promise<void> {
    // 始终输出到控制台（用于开发调试）
    console.log(`[${data.level.toUpperCase()}] ${data.message}`, data.context)

    if (!this.shouldLog()) {
      return
    }

    const logEntry = {
      timestamp: data.timestamp || new Date().toISOString(),
      level: data.level,
      message: data.message,
      service: datadogConfig.service,
      env: datadogConfig.env,
      version: datadogConfig.version,
      ...data.context,
      ddtags: data.tags?.join(',')
    }

    await this.sendToDatadog(logEntry)
  }

  public async debug(message: string, context?: Record<string, any>, tags?: string[]): Promise<void> {
    await this.log({ message, level: LogLevel.DEBUG, context, tags })
  }

  public async info(message: string, context?: Record<string, any>, tags?: string[]): Promise<void> {
    await this.log({ message, level: LogLevel.INFO, context, tags })
  }

  public async warn(message: string, context?: Record<string, any>, tags?: string[]): Promise<void> {
    await this.log({ message, level: LogLevel.WARN, context, tags })
  }

  public async error(message: string, context?: Record<string, any>, tags?: string[]): Promise<void> {
    await this.log({ message, level: LogLevel.ERROR, context, tags })
  }

  // 专门用于 LLM 计算日志的方法
  public async logLLMCalculation(data: LLMCalculationLogData): Promise<void> {
    const enhancedContext = {
      ...data.context,
      calculationType: data.calculationType,
      parameters: data.parameters,
      results: data.results
    }

    const tags = [
      ...(data.tags || []),
      `calculation_type:${data.calculationType}`,
      `locale:${data.parameters?.locale || 'unknown'}`
    ]

    await this.log({
      message: data.message,
      level: data.level,
      context: enhancedContext,
      tags,
      timestamp: data.timestamp
    })
  }
}

// 创建单例实例
export const datadogServerLogger = new DatadogServerLogger()

// 导出便捷方法
export const logDebug = (message: string, context?: Record<string, any>, tags?: string[]) =>
  datadogServerLogger.debug(message, context, tags)

export const logInfo = (message: string, context?: Record<string, any>, tags?: string[]) =>
  datadogServerLogger.info(message, context, tags)

export const logWarn = (message: string, context?: Record<string, any>, tags?: string[]) =>
  datadogServerLogger.warn(message, context, tags)

export const logError = (message: string, context?: Record<string, any>, tags?: string[]) =>
  datadogServerLogger.error(message, context, tags)

export const logLLMCalculation = (data: LLMCalculationLogData) =>
  datadogServerLogger.logLLMCalculation(data)
