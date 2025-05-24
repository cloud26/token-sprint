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
    const [parameters, setParameters] = useState<string>("671")
    const [precision, setPrecision] = useState<string>("FP8")
    const [gpuModel, setGpuModel] = useState<string>("NVIDIA H100")
    const [selectedModel, setSelectedModel] = useState<string>("DeepSeek-R1")

    const selectedGpu = gpuModels.find((gpu) => `${gpu.name} (${gpu.memory}GB)` === gpuModel)
    const gpuMemory = selectedGpu ? selectedGpu.memory : 80 // 默认使用 80GB

    const memory = calculateInferenceMemory(Number(parameters), precision, gpuMemory)

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
                                    setSelectedModel(value);
                                    const model = modelExamples.find(m => m.name === value);
                                    if (model) {
                                        setParameters(model.parameters.replace("B", ""));
                                    }
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
                </CardContent>
            </Card>

        </TooltipProvider>
    )
} 