"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, InfoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateInferenceMemory } from "@/utils/calculations"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { precisions, gpuModels, modelExamples, GPU_PERFORMANCE } from "@/utils/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTranslations, useLocale } from 'next-intl'
import React from "react"

interface CalculatorProps {
    preferredModelType?: string // 优先显示的模型类型，如 'deepseek', 'llama', 'qwen' 等
}

interface ContextLengthOption {
    value: string
    label: string
    description: string
    scenarios: string
}

export default function LLMMemoryCalculator({ preferredModelType }: CalculatorProps) {
    const t = useTranslations('calculator')
    const locale = useLocale()

    // Context Length 配置选项 - 从翻译文件获取
    const CONTEXT_LENGTH_OPTIONS: ContextLengthOption[] = t.raw('contextLength.options') || [
        {
            value: '2048',
            label: '2K tokens',
            description: '简单问答、代码补全',
            scenarios: '适合: ChatGPT式对话、代码助手、简单翻译'
        },
        {
            value: '4096', 
            label: '4K tokens',
            description: '标准对话、文档分析',
            scenarios: '适合: 客服机器人、文档问答、邮件处理'
        },
        {
            value: '8192',
            label: '8K tokens', 
            description: '长文档、复杂推理',
            scenarios: '适合: 论文分析、法律文档、技术文档'
        },
        {
            value: '16384',
            label: '16K tokens',
            description: '书籍章节、深度分析',
            scenarios: '适合: 学术研究、长篇内容创作、详细报告'
        },
        {
            value: '32768',
            label: '32K tokens',
            description: '整本书籍、代码库',
            scenarios: '适合: 代码库分析、完整书籍处理、大型项目文档'
        },
        {
            value: '65536',
            label: '64K tokens',
            description: '超长上下文、多文档',
            scenarios: '适合: 多文档对比、大型代码重构、企业知识库'
        },
        {
            value: '131072',
            label: '128K tokens',
            description: '海量文档、全景分析',
            scenarios: '适合: 研究综述、大型项目规划、企业级智能助手'
        },
        {
            value: '262144',
            label: '256K tokens',
            description: '极限长度、专业场景',
            scenarios: '适合: 法律案例库、医学文献、超大型项目'
        }
    ]
    
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
    const [gpuModel, setGpuModel] = useState<string>("NVIDIA H100 (80GB)")
    const [selectedModel, setSelectedModel] = useState<string>(getDefaultModel())
    const [batchSize, setBatchSize] = useState<string>("1") // 并发量
    const [contextLength, setContextLength] = useState<string>("4096") // 上下文长度
    
    // Popover 开关状态
    const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
    const [contextPopoverOpen, setContextPopoverOpen] = useState(false)
    const [gpuPopoverOpen, setGpuPopoverOpen] = useState(false)

    const selectedGpu = gpuModels.find((gpu) => `${gpu.name} (${gpu.memory}GB)` === gpuModel)
    const gpuMemory = selectedGpu ? selectedGpu.memory : 80 // 默认使用 80GB

    // 获取选中模型的value用于精确匹配
    const selectedModelValue = sortedModelExamples.find(m => m.name === selectedModel)?.value

    const memory = calculateInferenceMemory(
        Number(parameters), 
        precision, 
        gpuMemory, 
        Number(batchSize), 
        Number(contextLength),
        gpuModel,
        selectedModelValue // 传入具体的模型标识符
    )

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
                    batchSize: Number(batchSize),
                    contextLength: Number(contextLength),
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
    }, [parameters, precision, gpuModel, batchSize, contextLength, memory]);

    const handleParameterChange = (value: string) => {
        setParameters(value.replace(/[^0-9.]/g, ""))
    }

    const handleBatchSizeChange = (value: string) => {
        setBatchSize(value.replace(/[^0-9]/g, ""))
    }

    const handleContextLengthChange = (value: string) => {
        setContextLength(value.replace(/[^0-9]/g, ""))
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Card 
                className="w-full" 
                role="main"
            >
                <CardContent className="p-4 space-y-3">
                    {/* Model Selection 和 Model Parameters 放在同一行 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm">{t('modelSelection.label')}</Label>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                                            <p className="font-medium">{t('modelSelection.tooltip.title')}</p>
                                            {t.raw('modelSelection.tooltip.features').map((feature: string, index: number) => (
                                                <p key={index} className="text-xs">• {feature}</p>
                                            ))}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between text-sm">
                                        {selectedModel ? selectedModel : t('modelSelection.placeholder')}
                                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder={t('modelSelection.searchPlaceholder')} />
                                        <CommandList>
                                            <CommandEmpty>{t('modelSelection.notFound')}</CommandEmpty>
                                            <CommandGroup>
                                                {sortedModelExamples.map((model) => (
                                                    <CommandItem
                                                        key={model.name}
                                                        value={model.name}
                                                        onSelect={(currentValue) => {
                                                            handleModelChange(currentValue === selectedModel ? "" : currentValue)
                                                            setModelPopoverOpen(false)
                                                        }}
                                                        className="flex flex-col items-start py-2 px-3 hover:bg-slate-50"
                                                    >
                                                        <div className="flex items-center w-full">
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-3 w-3 flex-shrink-0",
                                                                    selectedModel === model.name ? "opacity-100" : "opacity-0",
                                                                )}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="font-medium text-sm truncate">{model.name}</span>
                                                                    <span className="text-xs text-blue-600 ml-2 flex-shrink-0">{model.parameters}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1">
                        <div className="flex items-center gap-2">
                                <Label htmlFor="parameters" className="text-sm">
                                    {t('parameters.label')}
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                        <p>{t('parameters.tooltip')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                            <Input
                                id="parameters"
                                type="text"
                                value={parameters}
                                onChange={(e) => handleParameterChange(e.target.value)}
                                className="text-sm"
                                placeholder={t('parameters.placeholder')}
                            />
                        </div>
                    </div>

                    {/* 精度和并发用户数放在同一行 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                        <div className="flex items-center gap-2">
                                <Label className="text-sm">{t('precision.label')}</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                        <p>{t('precision.tooltip')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Select value={precision} onValueChange={setPrecision}>
                                <SelectTrigger className="text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {precisions.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>
                                            {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="batchSize" className="text-sm">{t('concurrency.label')}</Label>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-sm">
                                        <div className="space-y-2 text-xs">
                                            <p><strong>{t('concurrency.tooltip.title')}</strong></p>
                                            {t.raw('concurrency.tooltip.scenarios').map((scenario: string, index: number) => (
                                                <p key={index}>{scenario}</p>
                                            ))}
                                            <div className="border-t pt-2 mt-2">
                                                <p><strong>{t('concurrency.tooltip.estimation.title')}</strong></p>
                                                {t.raw('concurrency.tooltip.estimation.methods').map((method: string, index: number) => (
                                                    <p key={index}>{method}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Input
                                id="batchSize"
                                type="text"
                                value={batchSize}
                                onChange={(e) => handleBatchSizeChange(e.target.value)}
                                className="text-sm"
                                placeholder={t('concurrency.placeholder')}
                            />
                        </div>
                    </div>

                    {/* Context Length 和 GPU Model 放在同一行 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="contextLength" className="text-sm">{t('contextLength.label')}</Label>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                                            <p className="font-medium">{t('contextLength.tooltip.title')}</p>
                                            {t.raw('contextLength.tooltip.features').map((feature: string, index: number) => (
                                                <p key={index} className="text-xs">• {feature}</p>
                                            ))}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Popover open={contextPopoverOpen} onOpenChange={setContextPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between text-sm">
                                        {contextLength ? 
                                            CONTEXT_LENGTH_OPTIONS.find(opt => opt.value === contextLength)?.label || contextLength 
                                            : t('contextLength.placeholder')
                                        }
                                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder={t('contextLength.searchPlaceholder')} />
                                        <CommandList>
                                            <CommandEmpty>{t('contextLength.notFound')}</CommandEmpty>
                                            <CommandGroup>
                                                {CONTEXT_LENGTH_OPTIONS.map((option) => (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value}
                                                        onSelect={(currentValue) => {
                                                            handleContextLengthChange(currentValue === contextLength ? "" : currentValue)
                                                            setContextPopoverOpen(false)
                                                        }}
                                                        className="flex flex-col items-start py-3 px-3 hover:bg-slate-50"
                                                    >
                                                        <div className="flex items-center w-full">
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-3 w-3 flex-shrink-0",
                                                                    contextLength === option.value ? "opacity-100" : "opacity-0",
                                                                )}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="font-medium text-sm">{option.label}</span>
                                                                    <span className="text-xs text-blue-600 ml-2 flex-shrink-0">{option.description}</span>
                                                                </div>
                                                                <div className="mt-1 text-xs text-gray-600">
                                                                    {option.scenarios}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm">{t('gpu.label')}</Label>
                            <Popover open={gpuPopoverOpen} onOpenChange={setGpuPopoverOpen}>
                            <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between text-sm">
                                        <div className="flex items-center justify-between w-full mr-2">
                                            {gpuModel ? (
                                                <>
                                                    <span className="truncate">{gpuModel.split(' (')[0]}</span>
                                                    <span className="text-blue-600 font-semibold ml-2 flex-shrink-0">
                                                        {gpuModel.match(/\((\d+)GB\)/)?.[1]}GB
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{t('gpu.placeholder')}</span>
                                            )}
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                        <CommandInput placeholder={t('gpu.searchPlaceholder')} />
                                    <CommandList>
                                            <CommandEmpty>{t('gpu.notFound')}</CommandEmpty>
                                        <CommandGroup>
                                            {gpuModels.map((gpu) => (
                                                <CommandItem
                                                    key={`${gpu.name} (${gpu.memory}GB)`}
                                                    value={`${gpu.name} (${gpu.memory}GB)`}
                                                    onSelect={(currentValue) => {
                                                        setGpuModel(currentValue === gpuModel ? "" : currentValue)
                                                            setGpuPopoverOpen(false)
                                                    }}
                                                        className="flex flex-col items-start py-2 px-3 hover:bg-slate-50"
                                                >
                                                        <div className="flex items-center w-full">
                                                    <Check
                                                        className={cn(
                                                                    "mr-2 h-3 w-3 flex-shrink-0",
                                                            gpuModel === `${gpu.name} (${gpu.memory}GB)` ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="font-medium text-xs truncate">{gpu.name}</span>
                                                                    <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                                                                        <span className="font-bold text-blue-600 text-sm">{gpu.memory}GB</span>
                                                                        
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between w-full mt-1">
                                                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                                                        <span className="text-green-600">{gpu.performance} TFLOPS</span>
                                                                        <span className="text-purple-600">{gpu.architecture}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        </div>
                    </div>

                    {/* 总计和GPU需求 - 优先显示 */}
                    <section>
                        <div className="grid grid-cols-2 gap-4">
                            {/* 总内存需求 */}
                            <div className="text-center p-3 bg-blue-100 rounded border-2 border-blue-300">
                                <Label className="text-gray-700 text-sm font-medium">{t('results.totalMemory')}</Label>
                                <p className="text-xl font-bold text-blue-700">{memory.totalMemory} GB</p>
                    </div>

                            {/* GPU需求 */}
                            <div className="text-center p-3 bg-blue-100 rounded border-2 border-blue-300">
                                <Label className="text-gray-700 text-sm font-medium">{t('results.requiredGPUs')}</Label>
                                <p className="text-xl font-bold text-blue-700">
                                    {memory.requiredGPUs} {t('results.unit')} {gpuModel.split(' (')[0]}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 详细内存分解 */}
                    <section>
                        <div className="bg-slate-50 p-3 rounded-lg space-y-3">
                            <h3 className="text-base font-semibold text-center mb-3">{t('memoryBreakdown.title')}</h3>
                            
                            {/* 模型信息 */}
                            <div className="text-center p-2 bg-amber-50 rounded text-xs border border-amber-200">
                                <span className="text-gray-700">
                                    {t('memoryBreakdown.modelInfo', { parameters })}
                                    {(parameters === '671' || parameters === '235') && (
                                        <span className="ml-2 text-amber-700">
                                            {t('memoryBreakdown.moeInfo', { activeParams: parameters === '671' ? '37' : '22' })}
                                        </span>
                                    )}
                                </span>
                            </div>
                            
                            {/* 一行显示所有内存组件 */}
                            <div className="grid grid-cols-4 gap-3">
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs">{t('memoryBreakdown.components.modelMemory.label')}</Label>
                                    <p className="text-base font-semibold text-blue-600">{memory.modelMemory} GB</p>
                                    <p className="text-xs text-gray-500">{t('memoryBreakdown.components.modelMemory.description')}</p>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs">{t('memoryBreakdown.components.kvCache.label')}</Label>
                                    <p className="text-base font-semibold text-green-600">{memory.kvCacheMemory} GB</p>
                                    <p className="text-xs text-gray-500">{t('memoryBreakdown.components.kvCache.description')}</p>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs">{t('memoryBreakdown.components.activationMemory.label')}</Label>
                                    <p className="text-base font-semibold text-purple-600">{memory.activationMemory} GB</p>
                                    <p className="text-xs text-gray-500">
                                        {(parameters === '671' || parameters === '235') 
                                            ? t('memoryBreakdown.components.activationMemory.descriptionMoE')
                                            : t('memoryBreakdown.components.activationMemory.descriptionNormal')
                                        }
                                    </p>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs">{t('memoryBreakdown.components.computationCache.label')}</Label>
                                    <p className="text-base font-semibold text-orange-600">{memory.computationMemory} GB</p>
                                    <p className="text-xs text-gray-500">{t('memoryBreakdown.components.computationCache.description')}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 新增：吞吐量性能信息 */}
                    <section>
                        <div className="bg-green-50 p-4 rounded-lg space-y-4">
                            <h3 className="text-lg font-semibold text-center mb-4 text-green-800">{t('performance.title')}</h3>
                            
                            {/* 性能指标说明 */}
                            <div className="text-center p-2 bg-green-100 rounded text-xs border border-green-300">
                                <span className="text-green-800">
                                    <strong>{t('performance.explanation', { avgTokens: memory.throughputInfo.avgOutputTokens })}</strong>
                                </span>
                            </div>
                            
                            {/* 2x2网格显示性能指标 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded border border-green-200 text-center">
                                    <Label className="text-gray-600 text-sm font-medium">{t('performance.metrics.totalThroughput.label')}</Label>
                                    <p className="text-lg font-bold text-green-600">
                                        {memory.throughputInfo.tokensPerSecond.toLocaleString()} {t('performance.metrics.totalThroughput.unit')}
                                    </p>
                                    <p className="text-xs text-gray-500">{t('performance.metrics.totalThroughput.description')}</p>
                                </div>
                                
                                <div className="bg-white p-3 rounded border border-green-200 text-center">
                                    <Label className="text-gray-600 text-sm font-medium">{t('performance.metrics.throughputPerUser.label')}</Label>
                                    <p className="text-lg font-bold text-green-600">
                                        {memory.throughputInfo.tokensPerSecondPerUser.toLocaleString()} {t('performance.metrics.throughputPerUser.unit')}
                                    </p>
                                    <p className="text-xs text-gray-500">{t('performance.metrics.throughputPerUser.description', { users: batchSize })}</p>
                                </div>
                                
                                <div className="bg-white p-3 rounded border border-green-200 text-center">
                                    <Label className="text-gray-600 text-sm font-medium">{t('performance.metrics.estimatedLatency.label')}</Label>
                                    <p className="text-lg font-bold text-green-600">
                                        {memory.throughputInfo.estimatedLatency.toLocaleString()} {t('performance.metrics.estimatedLatency.unit')}
                                    </p>
                                    <p className="text-xs text-gray-500">{t('performance.metrics.estimatedLatency.description', { avgTokens: memory.throughputInfo.avgOutputTokens })}</p>
                                </div>
                                
                                <div className="bg-white p-3 rounded border border-green-200 text-center">
                                    <Label className="text-gray-600 text-sm font-medium">{t('performance.metrics.maxQPS.label')}</Label>
                                    <p className="text-lg font-bold text-green-600">
                                        {memory.throughputInfo.maxQPS} {t('performance.metrics.maxQPS.unit')}
                                    </p>
                                    <p className="text-xs text-gray-500">{t('performance.metrics.maxQPS.description', { concurrency: batchSize, latency: (memory.throughputInfo.estimatedLatency/1000).toFixed(1) })}</p>
                                </div>
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
                                            <div className="flex gap-2 flex-wrap">
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen3-235B-A22B")
                                                        setParameters("235")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                        setBatchSize("4")
                                                        setContextLength("8192")
                                                    }}
                                                >
                                                    {t('quickStart.examples.flagship')}
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("DeepSeek-R1")
                                                        setParameters("671")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                        setBatchSize("2")
                                                        setContextLength("4096")
                                                    }}
                                                >
                                                    {t('quickStart.examples.ultraLarge')}
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA A100 (80GB)")
                                                        setBatchSize("8")
                                                        setContextLength("4096")
                                                    }}
                                                >
                                                    {t('quickStart.examples.enterprise')}
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                        setBatchSize("32")
                                                        setContextLength("8192")
                                                    }}
                                                >
                                                    {t('quickStart.examples.highConcurrency')}
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 8B")
                                                        setParameters("8")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 4090 (24GB)")
                                                        setBatchSize("4")
                                                        setContextLength("2048")
                                                    }}
                                                >
                                                    {t('quickStart.examples.lightweight')}
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 8B")
                                                        setParameters("8")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 4090 (24GB)")
                                                        setBatchSize("16")
                                                        setContextLength("4096")
                                                    }}
                                                >
                                                    {t('quickStart.examples.mediumScale')}
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen2.5-72B")
                                                        setParameters("72")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                        setBatchSize("6")
                                                        setContextLength("8192")
                                                    }}
                                                >
                                                    {t('quickStart.examples.popular')}
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                setSelectedModel("Qwen QwQ-32B")
                                                setParameters("32")
                                                setPrecision("INT4")
                                                        setGpuModel("NVIDIA RTX 4090 (24GB)")
                                                        setBatchSize("8")
                                                        setContextLength("4096")
                                                    }}
                                                >
                                            {t('quickStart.examples.reasoning')}
                                                </button>
                                            </div>
                                            <p className="text-xs italic">
                                                {t('quickStart.description')}
                                            </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </CardContent>
            </Card>

        </TooltipProvider>
    )
} 