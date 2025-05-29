"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Check, ChevronsUpDown, InfoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateInferenceMemory } from "@/utils/calculations"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { precisions, gpuModels, modelExamples } from "@/utils/constants"
import { type Language } from '@/config/languages'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { calculatorText } from "@/config/calculator"

interface CalculatorProps {
    language: Language
}

export default function LLMMemoryCalculator({ language }: CalculatorProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    
    // 从URL参数中获取模型，如果没有则使用默认值
    const urlModel = searchParams.get('model')
    const initialModel = urlModel ? 
        modelExamples.find(m => m.value === urlModel)?.name || "DeepSeek-R1" : 
        "DeepSeek-R1"
    
    const [parameters, setParameters] = useState<string>("671")
    const [precision, setPrecision] = useState<string>("FP8")
    const [gpuModel, setGpuModel] = useState<string>("NVIDIA H100")
    const [selectedModel, setSelectedModel] = useState<string>(initialModel)

    const selectedGpu = gpuModels.find((gpu) => `${gpu.name} (${gpu.memory}GB)` === gpuModel)
    const gpuMemory = selectedGpu ? selectedGpu.memory : 80 // 默认使用 80GB

    const memory = calculateInferenceMemory(Number(parameters), precision, gpuMemory)

    // 更新URL参数
    const updateURLParams = (newModel: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const modelValue = modelExamples.find(m => m.name === newModel)?.value
        
        if (modelValue && modelValue !== "deepseek-r1") {
            params.set('model', modelValue)
        } else {
            params.delete('model')
        }
        
        const queryString = params.toString()
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname
        
        // 使用replace避免在浏览器历史中创建过多条目
        router.replace(newUrl, { scroll: false })
    }

    // 当模型选择改变时更新URL和参数
    const handleModelChange = (newModel: string) => {
        setSelectedModel(newModel)
        const model = modelExamples.find(m => m.name === newModel)
        if (model) {
            setParameters(model.parameters.replace("B", ""))
        }
        updateURLParams(newModel)
    }

    // 监听URL参数变化，更新选中的模型
    useEffect(() => {
        const urlModel = searchParams.get('model')
        if (urlModel) {
            const model = modelExamples.find(m => m.value === urlModel)
            if (model && model.name !== selectedModel) {
                setSelectedModel(model.name)
                setParameters(model.parameters.replace("B", ""))
            }
        }
    }, [searchParams.get('model')])

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
                    locale: language
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
                                {calculatorText.parameters.label[language]}
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{calculatorText.parameters.tooltip[language]}</p>
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
                                    <SelectValue placeholder={calculatorText.parameters.selectPlaceholder[language]} />
                                </SelectTrigger>
                                <SelectContent>
                                    {modelExamples.map((model) => (
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
                            <Label>{calculatorText.precision.label[language]}</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{calculatorText.precision.tooltip[language]}</p>
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
                        <Label>{calculatorText.gpu.label[language]}</Label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between text-base">
                                    {gpuModel ? `${gpuModel}` : calculatorText.gpu.searchPlaceholder[language]}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder={calculatorText.gpu.searchPlaceholder[language]} />
                                    <CommandList>
                                        <CommandEmpty>{calculatorText.gpu.notFound[language]}</CommandEmpty>
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
                                    <Label className="text-gray-600 text-sm">{calculatorText.results.modelMemory[language]}</Label>
                                    <p className="text-lg font-semibold text-blue-600">{memory.modelMemory} GB</p>
                                </div>
                                <div className="text-center">
                                    <Label className="text-gray-600 text-sm">{calculatorText.results.inferenceMemory[language]}</Label>
                                    <p className="text-lg font-semibold text-blue-600">{memory.inferenceMemory} GB</p>
                                </div>
                                <div className="text-center border-l-2 border-gray-300 pl-4">
                                    <Label className="text-gray-600 text-sm font-medium">{calculatorText.results.totalMemory[language]}</Label>
                                    <p className="text-xl font-bold text-blue-600">{memory.totalMemory} GB</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-center">
                                <Label className="text-gray-600 text-sm font-medium">{calculatorText.results.requiredGPUs[language]}</Label>
                                <p className="text-xl font-bold text-blue-600">
                                    {memory.requiredGPUs} {calculatorText.results.unit[language]} {gpuModel}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 快速开始示例 */}
                    <section className="mt-6">
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <div className="text-sm text-amber-800 space-y-3">
                                <p className="font-medium">
                                    {language === 'en' ? 'Quick Start Examples:' : '快速开始示例：'}
                                </p>
                                <div className="space-y-2">
                                    {language === 'en' ? (
                                        <>
                                            <div className="flex gap-2 flex-wrap">
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen3-235B-A22B")
                                                        setParameters("235")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                        updateURLParams("Qwen3-235B-A22B")
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
                                                        updateURLParams("DeepSeek-R1")
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
                                                        updateURLParams("Llama 3.1 70B")
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
                                                        updateURLParams("Llama 3.1 8B")
                                                    }}
                                                >
                                                    Llama 3.1 8B + RTX 4090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen-7B")
                                                        setParameters("7")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 3090 (24GB)")
                                                        updateURLParams("Qwen-7B")
                                                    }}
                                                >
                                                    Qwen 7B + RTX 3090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                        updateURLParams("Llama 3.1 70B")
                                                    }}
                                                >
                                                    Llama 70B + H100 (FP8)
                                                </button>
                                            </div>
                                            <p className="text-xs italic">
                                                Click these examples to quickly configure popular model deployment scenarios!
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
                                                        updateURLParams("Qwen3-235B-A22B")
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
                                                        updateURLParams("DeepSeek-R1")
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
                                                        updateURLParams("Llama 3.1 70B")
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
                                                        updateURLParams("Llama 3.1 8B")
                                                    }}
                                                >
                                                    Llama 3.1 8B + RTX 4090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Qwen-7B")
                                                        setParameters("7")
                                                        setPrecision("FP16")
                                                        setGpuModel("NVIDIA RTX 3090 (24GB)")
                                                        updateURLParams("Qwen-7B")
                                                    }}
                                                >
                                                    Qwen 7B + RTX 3090
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                                    onClick={() => {
                                                        setSelectedModel("Llama 3.1 70B")
                                                        setParameters("70")
                                                        setPrecision("FP8")
                                                        setGpuModel("NVIDIA H100 (80GB)")
                                                        updateURLParams("Llama 3.1 70B")
                                                    }}
                                                >
                                                    Llama 70B + H100 (FP8)
                                                </button>
                                            </div>
                                            <p className="text-xs italic">
                                                点击这些示例快速配置热门模型部署方案！
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