"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, InfoIcon, ChevronDown, ChevronRight, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateInferenceMemory } from "@/utils/calculations"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { precisions, gpuModels, MODELS, getModelsByGroup } from "@/utils/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTranslations, useLocale } from 'next-intl'
import React from "react"
import { ShareDialog } from "@/components/share-dialog"
import { ShareCardData } from "@/components/share-card"

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

    // 处理包含Markdown格式的翻译文本
    const renderMarkdownText = (text: string) => {
        // 简单处理 **text** 格式为加粗
        return text.replace(/\*\*(.*?)\*\*/g, '<span class="text-lg font-bold">$1</span>')
    }

    // Context Length 配置选项 - 从翻译文件获取
    const CONTEXT_LENGTH_OPTIONS: ContextLengthOption[] = t.raw('contextLength.options') || [
        {
            value: '256',
            label: '256 tokens',
            description: '极短交互',
            scenarios: '典型使用: 快速问答、简单指令、短代码片段'
        },
        {
            value: '512',
            label: '512 tokens',
            description: '短对话',
            scenarios: '典型使用: ChatGPT式对话、基础辅助、简短解释'
        },
        {
            value: '1024',
            label: '1K tokens',
            description: '标准交互',
            scenarios: '典型使用: 客服机器人、文档问答、代码辅助'
        },
        {
            value: '2048',
            label: '2K tokens',
            description: '扩展对话',
            scenarios: '典型使用: 技术讨论、详细分析、较长文档'
        },
        {
            value: '4096',
            label: '4K tokens',
            description: '复杂任务',
            scenarios: '典型使用: 论文分析、代码审查、综合报告'
        },
        {
            value: '8192',
            label: '8K tokens',
            description: '长篇内容',
            scenarios: '典型使用: 书籍章节、大型代码库、研究文档'
        },
        {
            value: '16384',
            label: '16K tokens',
            description: '超长上下文',
            scenarios: '典型使用: 多文档分析、大规模代码重构'
        },
        {
            value: '32768',
            label: '32K tokens',
            description: '书籍与代码库',
            scenarios: '典型使用: 代码库分析、整本书处理、大型项目文档'
        },
        {
            value: '65536',
            label: '64K tokens',
            description: '超长上下文、多文档',
            scenarios: '典型使用: 多文档对比、大规模代码重构、企业知识库'
        },
        {
            value: '131072',
            label: '128K tokens',
            description: '海量文档、全景分析',
            scenarios: '典型使用: 研究综述、大型项目规划、企业级AI助手'
        }
    ]

    // 根据优先模型类型重新排序模型列表
    const sortedModelExamples = React.useMemo(() => {
        if (!preferredModelType) return MODELS

        const preferred: typeof MODELS = []
        const others: typeof MODELS = []

        MODELS.forEach(model => {
            const modelName = model.name.toLowerCase()
            if (
                (preferredModelType === 'deepseek' && modelName.includes('deepseek')) ||
                (preferredModelType === 'llama' && modelName.includes('llama')) ||
                (preferredModelType === 'qwen' && (modelName.includes('qwen') || modelName.includes('qwen3-coder') || modelName.includes('qwen3-next'))) ||
                (preferredModelType === 'claude' && modelName.includes('claude')) ||
                (preferredModelType === 'gemini' && modelName.includes('gemini')) ||
                (preferredModelType === 'gpt' && modelName.includes('gpt-oss'))
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
            'qwen': 'Qwen3-Coder-480B-A35B',
            'claude': 'DeepSeek-R1', // Claude模型不在modelExamples中，使用默认
            'gemini': 'DeepSeek-R1',  // Gemini模型不在modelExamples中，使用默认
            'gpt': 'GPT-OSS-120B' // GPT-OSS系列默认使用120B模型
        }

        return defaultModels[preferredModelType] || "DeepSeek-R1"
    }

    // 根据默认模型设置默认参数
    const getDefaultParameters = () => {
        const defaultModel = getDefaultModel()
        const model = sortedModelExamples.find(m => m.name === defaultModel)
        return model ? model.parametersNum.toString() : "671"
    }

    const [parameters, setParameters] = useState<string>(getDefaultParameters())
    const [precision, setPrecision] = useState<string>("FP8")
    const [gpuModel, setGpuModel] = useState<string>("NVIDIA H100 (80GB)")
    const [selectedModel, setSelectedModel] = useState<string>(getDefaultModel())
    const [batchSize, setBatchSize] = useState<string>("1") // 并发用户数 - 影响KV缓存显存
    const [contextLength, setContextLength] = useState<string>("1024") // 上下文长度
    // 移除期望吞吐量配置 - 专注于内存计算
    const [manualGpuCount, setManualGpuCount] = useState<string>("") // 手动设置的GPU数量

    // Popover 开关状态
    const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
    const [contextPopoverOpen, setContextPopoverOpen] = useState(false)
    const [gpuPopoverOpen, setGpuPopoverOpen] = useState(false)

    // FAQ 展开状态
    const [expandedFaqItems, setExpandedFaqItems] = useState<Set<number>>(new Set())

    // 分享对话框状态
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

    const selectedGpu = gpuModels.find((gpu) => `${gpu.name} (${gpu.memory}GB)` === gpuModel)
    const gpuMemory = selectedGpu ? selectedGpu.memory : 80 // 默认使用 80GB

    // 获取选中模型的value用于精确匹配
    const selectedModelValue = sortedModelExamples.find(m => m.name === selectedModel)?.value

    const memory = React.useMemo(() => {
        return calculateInferenceMemory(
            Number(parameters),
            precision,
            gpuMemory,
            Number(batchSize),
            Number(contextLength),
            gpuModel,
            selectedModelValue, // 传入具体的模型标识符
            undefined, // 不传入期望体验 - 专注于内存计算
            Number(manualGpuCount) || undefined // 传入手动GPU数量
        )
    }, [parameters, precision, gpuMemory, batchSize, contextLength, gpuModel, selectedModelValue, manualGpuCount])

    // 使用防抖来优化GPU数量自动计算 - 简化为只基于内存需求
    const [isUserTyping, setIsUserTyping] = React.useState(false)

    // 防抖计算GPU数量 - 只基于内存需求
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsUserTyping(false)

            // 使用内存需求计算推荐GPU数量
            const memoryBasedGpus = memory.gpuAnalysis.baseRequiredGPUs
            if (memoryBasedGpus.toString() !== manualGpuCount) {
                setManualGpuCount(memoryBasedGpus.toString())
            }
        }, 500) // 500ms防抖延迟

        return () => clearTimeout(timer)
    }, [selectedModel, parameters, precision, batchSize, contextLength, gpuModel, memory.gpuAnalysis.baseRequiredGPUs, manualGpuCount])

    // 当模型选择改变时更新参数
    const handleModelChange = (newModel: string) => {
        setSelectedModel(newModel)
        const model = sortedModelExamples.find(m => m.name === newModel)
        if (model) {
            setParameters(model.parametersNum.toString())
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
                    // 基础配置
                    parameters: Number(parameters),
                    precision,
                    gpuModel,
                    gpuMemory,
                    batchSize: Number(batchSize),
                    contextLength: Number(contextLength),
                    expectedTokensPerSecond: 0, // 不记录期望吞吐量
                    manualGpuCount: Number(manualGpuCount) || null,
                    selectedModel,
                    locale,
                    // 计算结果
                    totalMemory: memory.totalMemory,
                    requiredGPUs: memory.requiredGPUs,
                    // 移除性能指标记录 - 专注于内存计算
                    // GPU分析
                    gpuAnalysis: memory.gpuAnalysis ? {
                        baseRequiredGPUs: memory.gpuAnalysis.baseRequiredGPUs,
                        memoryWarning: memory.gpuAnalysis.memoryWarning || null
                    } : null,
                    // 性能分析
                    performanceAnalysis: memory.performanceAnalysis ? {
                        minRequiredGPUs: memory.performanceAnalysis.minRequiredGPUs,
                        meetsExpectation: memory.performanceAnalysis.meetsExpectation,
                        recommendedAction: memory.performanceAnalysis.recommendedAction
                    } : null,
                    // 内存分解
                    memoryBreakdown: {
                        modelMemory: memory.modelMemory,
                        kvCacheMemory: memory.kvCacheMemory,
                        activationMemory: memory.activationMemory,
                        computationMemory: memory.computationMemory
                    },
                    // 架构信息
                    architectureInfo: {
                        d_model: memory.architectureInfo.d_model,
                        n_layers: memory.architectureInfo.n_layers,
                        activeParams: memory.architectureInfo.activeParams,
                        isMoE: memory.architectureInfo.isMoE,
                        source: memory.architectureInfo.source
                    }
                }),
            });
        } catch (error) {
            console.error('Failed to log calculation:', error);
        }
    };

    // 在计算结果更新时记录日志（防抖） - 简化为基于内存的计算
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isUserTyping) {
                logCalculation();
            }
        }, 1000); // 1秒防抖延迟

        return () => clearTimeout(timer);
    }, [parameters, precision, gpuModel, batchSize, contextLength, manualGpuCount, memory, isUserTyping]);

    const handleParameterChange = (value: string) => {
        setParameters(value.replace(/[^0-9.]/g, ""))
    }

    const handleBatchSizeChange = (value: string) => {
        setIsUserTyping(true)
        setBatchSize(value.replace(/[^0-9]/g, ""))
    }

    const handleContextLengthChange = (value: string) => {
        setContextLength(value.replace(/[^0-9]/g, ""))
    }

    const handleManualGpuCountChange = (value: string) => {
        setIsUserTyping(true)
        setManualGpuCount(value.replace(/[^0-9]/g, ""))
    }

    // FAQ 展开/收起切换
    const toggleFaqItem = (index: number) => {
        const newExpanded = new Set(expandedFaqItems)
        if (newExpanded.has(index)) {
            newExpanded.delete(index)
        } else {
            newExpanded.add(index)
        }
        setExpandedFaqItems(newExpanded)
    }

    // 渲染带有Markdown格式的FAQ答案
    const renderFaqAnswer = (answer: string) => {
        return answer
            .replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-blue-700">$1</span>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    }

    // 准备分享数据
    const prepareShareData = (): ShareCardData => {
        return {
            modelName: selectedModel,
            parameters: parameters,
            precision: precision,
            gpuModel: gpuModel,
            gpuCount: Number(manualGpuCount) || memory.gpuAnalysis.baseRequiredGPUs,
            totalMemory: memory.totalMemory,
            batchSize: batchSize,
            contextLength: contextLength,
            modelMemory: memory.modelMemory,
            kvCacheMemory: memory.kvCacheMemory,
            activationMemory: memory.activationMemory,
            computationMemory: memory.computationMemory,
            locale: locale
        }
    }

    // 处理分享按钮点击
    const handleShare = () => {
        setIsShareDialogOpen(true)
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Card
                className="w-full"
                role="main"
            >
                <CardContent className="p-4 space-y-3">
                    {/* Model Selection - 单独一行 */}
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
                                    <div className="flex items-center gap-2 min-w-0">
                                        {selectedModel ? (
                                            <>
                                                <span className="truncate">{selectedModel}</span>
                                                {(() => {
                                                    const currentModel = MODELS.find(m => m.name === selectedModel);
                                                    return currentModel?.isMoE && (
                                                        <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-md font-medium flex-shrink-0">
                                                            MoE
                                                        </span>
                                                    );
                                                })()}
                                            </>
                                        ) : (
                                            <span>{t('modelSelection.placeholder')}</span>
                                        )}
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder={t('modelSelection.searchPlaceholder')} />
                                    <CommandList>
                                        <CommandEmpty>{t('modelSelection.notFound')}</CommandEmpty>
                                        {/* 按系列分组显示模型 */}
                                        {(() => {
                                            // 使用配置中的分组信息，这已经包含了正确的排序
                                            const allGroups = getModelsByGroup();

                                            // 如果有优先类型，调整系列的显示顺序
                                            let seriesOrder = Object.keys(allGroups);
                                            if (preferredModelType) {
                                                const preferredSeries: string[] = [];
                                                const otherSeries: string[] = [];

                                                seriesOrder.forEach(series => {
                                                    const seriesLower = series.toLowerCase();
                                                    if (
                                                        (preferredModelType === 'deepseek' && seriesLower.includes('deepseek')) ||
                                                        (preferredModelType === 'llama' && seriesLower.includes('llama')) ||
                                                        (preferredModelType === 'qwen' && (seriesLower.includes('qwen') || seriesLower.includes('qwen 3'))) ||
                                                        (preferredModelType === 'gpt' && seriesLower.includes('gpt-oss'))
                                                    ) {
                                                        preferredSeries.push(series);
                                                    } else {
                                                        otherSeries.push(series);
                                                    }
                                                });

                                                seriesOrder = [...preferredSeries, ...otherSeries];
                                            }

                                            return seriesOrder.map(series => (
                                                <CommandGroup key={series} heading={series}>
                                                    {allGroups[series].map((model) => (
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
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <span className="font-medium text-sm truncate">{model.name}</span>
                                                                            {model.isMoE && (
                                                                                <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-md font-medium flex-shrink-0">
                                                                                    MoE
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-xs text-blue-600 ml-2 flex-shrink-0">{model.parameters}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            ));
                                        })()}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Model Parameters - 单独一行 */}
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

                    {/* 精度和上下文长度放在同一行 */}
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
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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
                    </div>

                    {/* GPU型号 - 单独一行 */}
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
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command
                                    filter={(value, search) => {
                                        // 自定义搜索逻辑：更精确的匹配
                                        if (!search) return 1;
                                        const searchLower = search.toLowerCase();
                                        const valueLower = value.toLowerCase();

                                        // 完全匹配优先级最高
                                        if (valueLower.includes(searchLower)) {
                                            // 如果搜索词是连续的字符串，给予更高优先级
                                            const gpuName = valueLower.split(' (')[0]; // 提取GPU名称部分
                                            if (gpuName.includes(searchLower)) {
                                                return 1;
                                            }
                                        }

                                        return 0;
                                    }}
                                >
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
                                                                    <span className="text-purple-600">{gpu.architecture}</span>
                                                                    <span className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-medium">{gpu.releaseYear}</span>
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

                    {/* 并发用户数 - 影响KV缓存显存 */}
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
                                        <p>并发用户数会显著影响KV缓存的显存占用。每个用户的对话历史都需要在GPU显存中存储。</p>
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

                    {/* GPU数目 - 单独一行，突出显示 */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label className="text-base font-semibold">{t('gpuCount.label')}</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                    <div className="space-y-2 text-xs">
                                        <p><strong>{t('gpuCount.tooltip.title')}</strong></p>
                                        {t.raw('gpuCount.tooltip.features').map((feature: string, index: number) => (
                                            <p key={index}>{feature}</p>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 relative">
                                    <Input
                                        type="text"
                                        value={manualGpuCount}
                                        onChange={(e) => handleManualGpuCountChange(e.target.value)}
                                        className={`text-lg font-bold h-12 ${(() => {
                                            const recommendedGpus = memory.gpuAnalysis.baseRequiredGPUs;
                                            const isAutoCalculated = !isUserTyping && manualGpuCount === recommendedGpus.toString();
                                            return isAutoCalculated ? 'pr-14' : 'pr-3';
                                        })()} ${memory.gpuAnalysis.memoryWarning ? 'border-red-500' : 'border-blue-300'}`}
                                        placeholder={t('gpuCount.placeholder')}
                                    />
                                    {(() => {
                                        // 判断当前GPU数量是否为自动计算的值
                                        const recommendedGpus = memory.gpuAnalysis.baseRequiredGPUs;

                                        const isAutoCalculated = !isUserTyping && manualGpuCount === recommendedGpus.toString();

                                        return isAutoCalculated && (
                                            <span className="absolute right-1 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded font-medium">
                                                {t('gpuCount.autoLabel')}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <span className="text-lg font-semibold text-blue-700 whitespace-nowrap">{t('gpuCount.unit')}</span>
                            </div>
                            {memory.gpuAnalysis.memoryWarning && (
                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2">
                                    {memory.gpuAnalysis.memoryWarning}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 显存需求分解 */}
                    <section>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                            {/* 显存需求概览 */}
                            <div className="text-center p-3 bg-blue-100 rounded-lg border border-blue-300 mb-3">
                                <p className="text-lg font-bold text-blue-700">{t('memoryRequirement.totalMemory', { totalMemory: memory.totalMemory })}</p>
                                <p className="text-sm text-blue-600 mt-1" dangerouslySetInnerHTML={{
                                    __html: renderMarkdownText(t('memoryRequirement.requiredGPUs', { count: memory.gpuAnalysis.baseRequiredGPUs }))
                                }} />
                            </div>



                            {/* 内存组件分解 - 4x1布局 */}
                            <div className="grid grid-cols-4 gap-2">
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs font-medium">{t('memoryBreakdown.components.modelMemory.label')}</Label>
                                    <p className="text-base font-semibold text-blue-600 mt-1">{memory.modelMemory} GB</p>
                                    <p className="text-xs text-gray-500 mt-1">{t('memoryBreakdown.components.modelMemory.description')}</p>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs font-medium">{t('memoryBreakdown.components.kvCache.label')}</Label>
                                    <p className="text-base font-semibold text-green-600 mt-1">{memory.kvCacheMemory} GB</p>
                                    <p className="text-xs text-gray-500 mt-1">{t('memoryBreakdown.components.kvCache.description')}</p>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs font-medium">{t('memoryBreakdown.components.activationMemory.label')}</Label>
                                    <p className="text-base font-semibold text-purple-600 mt-1">{memory.activationMemory} GB</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {memory.architectureInfo.isMoE
                                            ? t('memoryBreakdown.components.activationMemory.descriptionMoE')
                                            : t('memoryBreakdown.components.activationMemory.descriptionNormal')
                                        }
                                    </p>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                    <Label className="text-gray-600 text-xs font-medium">{t('memoryBreakdown.components.computationCache.label')}</Label>
                                    <p className="text-base font-semibold text-orange-600 mt-1">{memory.computationMemory} GB</p>
                                    <p className="text-xs text-gray-500 mt-1">{t('memoryBreakdown.components.computationCache.description')}</p>
                                </div>
                            </div>

                            {/* GPU配置状态 */}
                            {memory.gpuAnalysis.memoryWarning && (
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div className="text-sm font-medium text-red-800 mb-1">{t('memoryRequirement.memoryWarning')}</div>
                                    <div className="text-xs text-red-600">{memory.gpuAnalysis.memoryWarning}</div>
                                </div>
                            )}

                            {/* 分享按钮 */}
                            <div className="flex justify-center pt-4 border-t border-slate-200">
                                <Button
                                    onClick={handleShare}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    {t('share.button')}
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* 性能指标 */}
                    <section>
                        <div className="bg-green-50 p-4 rounded-lg space-y-4">
                            {/* 隐藏吞吐需求概览 - 专注于内存计算 */}



                            {/* 隐藏性能指标显示 - 只保留基于内存的计算结果 */}
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
                                                setSelectedModel("Qwen3-Coder-480B-A35B")
                                                setParameters("480")
                                                setPrecision("FP8")
                                                setGpuModel("NVIDIA H100 (80GB)")
                                                setBatchSize("1")
                                                setContextLength("4096")
                                            }}
                                        >
                                            Qwen3-Coder 480B
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setSelectedModel("Qwen3-235B-A22B")
                                                setParameters("235")
                                                setPrecision("FP8")
                                                setGpuModel("NVIDIA H100 (80GB)")
                                                setBatchSize("2")
                                                setContextLength("4096")
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
                                                setBatchSize("1")
                                                setContextLength("2048")
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
                                                setBatchSize("4")
                                                setContextLength("2048")
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
                                                setBatchSize("16")
                                                setContextLength("4096")
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
                                                setBatchSize("2")
                                                setContextLength("1024")
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
                                                setBatchSize("4")
                                                setContextLength("2048")
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
                                                setBatchSize("3")
                                                setContextLength("4096")
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
                                                setBatchSize("2")
                                                setContextLength("2048")
                                            }}
                                        >
                                            {t('quickStart.examples.reasoning')}
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setSelectedModel("GPT-OSS-120B")
                                                setParameters("117")
                                                setPrecision("MXFP4")
                                                setGpuModel("NVIDIA H100 (80GB)")
                                                setBatchSize("1")
                                                setContextLength("4096")
                                            }}
                                        >
                                            GPT-OSS-120B (OpenAI)
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setSelectedModel("GPT-OSS-20B")
                                                setParameters("21")
                                                setPrecision("MXFP4")
                                                setGpuModel("NVIDIA RTX 4090 (24GB)")
                                                setBatchSize("2")
                                                setContextLength("2048")
                                            }}
                                        >
                                            GPT-OSS-20B (OpenAI)
                                        </button>
                                    </div>
                                    <p className="text-xs italic">
                                        {t('quickStart.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ 部分 */}
                    <section className="mt-6">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                {t('faq.title')}
                            </h2>
                            <div className="space-y-3">
                                {t.raw('faq.items').map((item: { question: string; answer: string }, index: number) => (
                                    <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                        <button
                                            onClick={() => toggleFaqItem(index)}
                                            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-medium text-slate-700 pr-2">
                                                {item.question}
                                            </span>
                                            {expandedFaqItems.has(index) ? (
                                                <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                            )}
                                        </button>
                                        {expandedFaqItems.has(index) && (
                                            <div className="px-4 pb-3 pt-1 border-t border-slate-100">
                                                <div
                                                    className="text-sm text-slate-600 leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                        __html: renderFaqAnswer(item.answer)
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </CardContent>
            </Card>

            {/* 分享对话框 */}
            <ShareDialog
                open={isShareDialogOpen}
                onOpenChange={setIsShareDialogOpen}
                data={prepareShareData()}
                translations={{
                    dialogTitle: t('share.dialogTitle'),
                    dialogDescription: t('share.dialogDescription'),
                    downloadButton: t('share.downloadButton'),
                    copyButton: t('share.copyButton'),
                    copySuccess: t('share.copySuccess'),
                    copyError: t('share.copyError'),
                    downloadError: t('share.downloadError'),
                    generating: t('share.generating'),
                    card: {
                        title: t('share.card.title'),
                        configuration: t('share.card.configuration'),
                        model: t('share.card.model'),
                        parameters: t('share.card.parameters'),
                        precision: t('share.card.precision'),
                        gpu: t('share.card.gpu'),
                        gpuCount: t('share.card.gpuCount'),
                        concurrency: t('share.card.concurrency'),
                        contextLength: t('share.card.contextLength'),
                        memoryBreakdown: t('share.card.memoryBreakdown'),
                        modelMemory: t('share.card.modelMemory'),
                        kvCache: t('share.card.kvCache'),
                        activation: t('share.card.activation'),
                        computation: t('share.card.computation'),
                        totalMemory: t('share.card.totalMemory'),
                        poweredBy: t('share.card.poweredBy'),
                        website: t('share.card.website')
                    }
                }}
            />
        </TooltipProvider>
    )
}
