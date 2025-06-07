"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, InfoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateInferenceMemory } from "@/utils/calculations"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { precisions, gpuModels, modelExamples } from "@/utils/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTranslations, useLocale } from 'next-intl'
import React from "react"

interface CalculatorProps {
    preferredModelType?: string // 优先显示的模型类型，如 'deepseek', 'llama', 'qwen' 等
}

export default function LLMMemoryCalculator({ preferredModelType }: CalculatorProps) {
    const t = useTranslations('calculator')
    const locale = useLocale()
    // 根据优先模型类型重新排序模型列表
    const sortedModelExamples = React.useMemo(() => {
        if (!preferredModelType) return modelExamples
        
        const preferred: typeof modelExamples = []
        const others: typeof modelExamples = []
        
        modelExamples.forEach(model => {
            const modelName = model.name.toLowerCase()
            if (
                (preferredModelType === 'deepseek' && modelName.includes('deepseek')) ||
                (preferredModelType === 'llama' && modelName.includes('llama')) ||
                (preferredModelType === 'qwen' && modelName.includes('qwen')) ||
                (preferredModelType === 'claude' && modelName.includes('claude')) ||
                (preferredModelType === 'gemini' && modelName.includes('gemini'))
            ) {
                preferred.push(model)
            } else {
                others.push(model)
            }
        })
        
        return [...preferred, ...others]
    }, [preferredModelType])
    
    // 根据优先模型类型设置默认模型
    const getDefaultModel = () => {
        if (!preferredModelType) return "DeepSeek-R1"
        
        const defaultModels: Record<string, string> = {
            'deepseek': 'DeepSeek-R1',
            'llama': 'Llama 4 Scout',
            'qwen': 'Qwen3-235B-A22B',
            'claude': 'DeepSeek-R1', // Claude模型不在modelExamples中，使用默认
            'gemini': 'DeepSeek-R1'  // Gemini模型不在modelExamples中，使用默认
        }
        
        return defaultModels[preferredModelType] || "DeepSeek-R1"
    }

    // 根据默认模型设置默认参数
    const getDefaultParameters = () => {
        const defaultModel = getDefaultModel()
        const model = sortedModelExamples.find(m => m.name === defaultModel)
        return model ? model.parameters.replace("B", "") : "671"
    }

    const [parameters, setParameters] = useState<string>(getDefaultParameters())
    const [precision, setPrecision] = useState<string>("FP8")
    const [gpuModel, setGpuModel] = useState<string>("NVIDIA H100")
    const [selectedModel, setSelectedModel] = useState<string>(getDefaultModel())

    const selectedGpu = gpuModels.find((gpu) => `${gpu.name} (${gpu.memory}GB)` === gpuModel)
    const gpuMemory = selectedGpu ? selectedGpu.memory : 80 // 默认使用 80GB

    const memory = calculateInferenceMemory(Number(parameters), precision, gpuMemory)

    // 当模型选择改变时更新参数
    const handleModelChange = (newModel: string) => {
        setSelectedModel(newModel)
        const model = sortedModelExamples.find(m => m.name === newModel)
        if (model) {
            setParameters(model.parameters.replace("B", ""))
        }
    }

    // 添加日志记录函数
    const logCalculation = async () => {
        try {
            await fetch('/api/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parameters: Number(parameters),
                    precision,
                    gpuModel,
                    gpuMemory,
                    totalMemory: memory.totalMemory,
                    requiredGPUs: memory.requiredGPUs,
                    locale: locale
                }),
            });
        } catch (error) {
            console.error('Failed to log calculation:', error);
        }
    };

    // 在计算结果更新时记录日志
    useEffect(() => {
        logCalculation();
    }, [parameters, precision, gpuModel, memory]);

    const handleParameterChange = (value: string) => {
        setParameters(value.replace(/[^0-9.]/g, ""))
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Card 
                className="w-full" 
                role="main"
            >
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="parameters">
                                {t('parameters.label')}
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('parameters.tooltip')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                id="parameters"
                                type="text"
                                value={parameters}
                                onChange={(e) => handleParameterChange(e.target.value)}
                                className="text-base w-1/2"
                                placeholder="Enter model size (e.g., 7, 13, 70)"
                            />
                            <Select
                                value={selectedModel}
                                onValueChange={(value) => {
                                    handleModelChange(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('parameters.selectPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortedModelExamples.map((model) => (
                                        <SelectItem key={model.name} value={model.name}>
                                            {model.name} ({model.parameters})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label>{t("precision.label")}</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t("precision.tooltip")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Select value={precision} onValueChange={setPrecision}>
                            <SelectTrigger className="text-base">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {precisions.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>
                                        {p.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{t("gpu.label")}</Label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between text-base">
                                    {gpuModel ? `${gpuModel}` : t("gpu.searchPlaceholder")}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder={t("gpu.searchPlaceholder")} />
                                    <CommandList>
                                        <CommandEmpty>{t("gpu.notFound")}</CommandEmpty>
                                        <CommandGroup>
                                            {gpuModels.map((gpu) => (
                                                <CommandItem
                                                    key={`${gpu.name} (${gpu.memory}GB)`}
                                                    value={`${gpu.name} (${gpu.memory}GB)`}
                                                    onSelect={(currentValue) => {
                                                        setGpuModel(currentValue === gpuModel ? "" : currentValue)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            gpuModel === `${gpu.name} (${gpu.memory}GB)` ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    {`${gpu.name} (${gpu.memory}GB)`}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <section>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            {/* 单行三列布局 */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <Label className="text-gray-600 text-sm">{t("results.modelMemory")}</Label>
                                    <p className="text-lg font-semibold text-blue-600">{memory.modelMemory} GB</p>
                                </div>
                                <div className="text-center">
                                    <Label className="text-gray-600 text-sm">{t("results.inferenceMemory")}</Label>
                                    <p className="text-lg font-semibold text-blue-600">{memory.inferenceMemory} GB</p>
                                </div>
                                <div className="text-center border-l-2 border-gray-300 pl-4">
                                    <Label className="text-gray-600 text-sm font-medium">{t("results.totalMemory")}</Label>
                                    <p className="text-xl font-bold text-blue-600">{memory.totalMemory} GB</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-center">
                                <Label className="text-gray-600 text-sm font-medium">{t("results.requiredGPUs")}</Label>
                                <p className="text-xl font-bold text-blue-600">
                                    {memory.requiredGPUs} {t("results.unit")} {gpuModel}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 快速开始示例 */}
                    <section className="mt-6">
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <div className="text-sm text-amber-800 space-y-3">
                                <p className="font-medium">
                                    {t('quickStart.title')}
                                </p>
                                <div className="space-y-2">
                                    {locale === 'en' ? (
                                        <>
                                            <div className="flex gap-2 flex-wrap">
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen3-235B-A22B")
                                                        setParameters("235")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    🆕 Qwen3-235B + H100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("DeepSeek-R1")
                                                        setParameters("671")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    DeepSeek R1 + H100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA A100 (80GB)")
                                                    }}
                                                >
                                                    Llama 3.1 70B + A100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 8B")
                                                        setParameters("8")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 4090 (24GB)")
                                                    }}
                                                >
                                                    Llama 3.1 8B + RTX 4090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen2.5-72B")
                                                        setParameters("72")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    🔥 Qwen2.5-72B + H100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen2.5-7B")
                                                        setParameters("7")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 3090 (24GB)")
                                                    }}
                                                >
                                                    Qwen2.5-7B + RTX 3090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    Llama 70B + H100 (FP8)
                                                </button>
                                            </div>
                                            <p className="text-xs italic">
                                                {t('quickStart.description')}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex gap-2 flex-wrap">
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen3-235B-A22B")
                                                        setParameters("235")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    🆕 Qwen3-235B + H100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("DeepSeek-R1")
                                                        setParameters("671")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    DeepSeek R1 + H100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA A100 (80GB)")
                                                    }}
                                                >
                                                    Llama 3.1 70B + A100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 8B")
                                                        setParameters("8")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 4090 (24GB)")
                                                    }}
                                                >
                                                    Llama 3.1 8B + RTX 4090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen2.5-72B")
                                                        setParameters("72")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    🔥 Qwen2.5-72B + H100
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen2.5-7B")
                                                        setParameters("7")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 3090 (24GB)")
                                                    }}
                                                >
                                                    Qwen2.5-7B + RTX 3090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                    }}
                                                >
                                                    Llama 70B + H100 (FP8)
                                                </button>
                                            </div>
                                            <p className="text-xs italic">
                                                {t('quickStart.description')}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </CardContent>
            </Card>

        </TooltipProvider>
    )
} 