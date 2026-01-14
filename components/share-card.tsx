"use client"

import React from 'react'
import { Card } from '@/components/ui/card'

export interface ShareCardData {
  modelName: string
  parameters: string
  precision: string
  gpuModel: string
  gpuCount: number
  totalMemory: number
  batchSize: string
  contextLength: string
  modelMemory: number
  kvCacheMemory: number
  activationMemory: number
  computationMemory: number
  locale: string
}

interface ShareCardProps {
  data: ShareCardData
  translations: {
    title: string
    configuration: string
    model: string
    parameters: string
    precision: string
    gpu: string
    gpuCount: string
    concurrency: string
    contextLength: string
    memoryBreakdown: string
    modelMemory: string
    kvCache: string
    activation: string
    computation: string
    totalMemory: string
    poweredBy: string
    email: string
    website: string
  }
}

export const ShareCard = React.forwardRef<HTMLDivElement, ShareCardProps>(
  ({ data, translations }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[800px] bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 rounded-2xl shadow-2xl border-2 border-blue-200"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-blue-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {translations.title}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded"></span>
            {translations.configuration}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{translations.model}</div>
              <div className="text-base font-semibold text-gray-900">{data.modelName}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{translations.parameters}</div>
              <div className="text-base font-semibold text-blue-600">{data.parameters}B</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{translations.precision}</div>
              <div className="text-base font-semibold text-gray-900">{data.precision}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{translations.gpu}</div>
              <div className="text-base font-semibold text-gray-900">{data.gpuModel.split(' (')[0]}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{translations.concurrency}</div>
              <div className="text-base font-semibold text-gray-900">{data.batchSize}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{translations.contextLength}</div>
              <div className="text-base font-semibold text-gray-900">{data.contextLength}</div>
            </div>
          </div>
        </div>

        {/* GPU Count Highlight */}
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg text-white text-center">
          <div className="text-sm opacity-90 mb-1">{translations.gpuCount}</div>
          <div className="text-4xl font-bold">{data.gpuCount}</div>
        </div>

        {/* Memory Breakdown */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 rounded"></span>
            {translations.memoryBreakdown}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-xs text-gray-600 mb-1">{translations.modelMemory}</div>
              <div className="text-lg font-bold text-blue-600">{data.modelMemory}</div>
              <div className="text-xs text-gray-500">GB</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
              <div className="text-xs text-gray-600 mb-1">{translations.kvCache}</div>
              <div className="text-lg font-bold text-green-600">{data.kvCacheMemory}</div>
              <div className="text-xs text-gray-500">GB</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
              <div className="text-xs text-gray-600 mb-1">{translations.activation}</div>
              <div className="text-lg font-bold text-purple-600">{data.activationMemory}</div>
              <div className="text-xs text-gray-500">GB</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center">
              <div className="text-xs text-gray-600 mb-1">{translations.computation}</div>
              <div className="text-lg font-bold text-orange-600">{data.computationMemory}</div>
              <div className="text-xs text-gray-500">GB</div>
            </div>
          </div>
        </div>

        {/* Total Memory */}
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border-2 border-amber-200 text-center">
          <div className="text-sm text-amber-700 mb-1">{translations.totalMemory}</div>
          <div className="text-3xl font-bold text-amber-900">{data.totalMemory} GB</div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {translations.poweredBy}: <span className="font-semibold text-gray-700">{translations.email}</span>
          </div>
          <div className="text-xs font-mono text-blue-600">
            {translations.website}
          </div>
        </div>
      </div>
    )
  }
)

ShareCard.displayName = 'ShareCard'
