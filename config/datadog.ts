export interface DatadogConfig {
  clientToken: string
  site: string
  service: string
  env: string
  version?: string
  forwardErrorsToLogs: boolean
  sessionSampleRate: number
}

export const datadogConfig: DatadogConfig = {
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
  site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
  service: 'token-sprint',
  env: process.env.NODE_ENV || 'development',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  forwardErrorsToLogs: true,
  sessionSampleRate: 100
}

export const isDatadogEnabled = (): boolean => {
  return Boolean(datadogConfig.clientToken)
}
