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
            <Card className="p-6">
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="parameters">
                                {calculatorText.parameters.label[language]}
                                <span className="hidden">LLM model size in billions of parameters</span>
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div>
                                        <p>{calculatorText.parameters.tooltip[language]}</p>
                                        <p className="hidden">
                                            Common LLM sizes: 7B (Llama 2), 13B, 70B, 175B (GPT-3)
                                            Used for calculating GPU memory requirements for inference
                                        </p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                id="parameters"
                                type="text"
                                value={parameters}
                                onChange={(e) => handleParameterChange(e.target.value)}
                                className="text-lg w-1/2"
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
                                            {model.name}
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
                                    {calculatorText.precision.tooltip[language]}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Select value={precision} onValueChange={setPrecision}>
                            <SelectTrigger className="text-lg">
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
                                <Button variant="outline" role="combobox" className="w-full justify-between text-lg">
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

                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <div className="space-y-1">
                            <Label className="text-gray-600">{calculatorText.results.modelMemory[language]}：</Label>
                            <p className="text-xl">
                                <span className="text-blue-600 font-semibold">{memory.modelMemory}</span> GB
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-600">{calculatorText.results.inferenceMemory[language]}：</Label>
                            <p className="text-xl">
                                <span className="text-blue-600 font-semibold">{memory.inferenceMemory}</span> GB
                            </p>
                        </div>
                        <div className="pt-2 border-t">
                            <Label className="text-gray-600">{calculatorText.results.totalMemory[language]}：</Label>
                            <p className="text-2xl">
                                <span className="text-blue-600 font-semibold">{memory.totalMemory}</span> GB
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <Label className="text-gray-600">{calculatorText.results.requiredGPUs[language]}：</Label>
                        <p className="text-2xl">
                            <span className="text-blue-600 font-semibold">{memory.requiredGPUs}</span> {calculatorText.results.unit[language]} {gpuModel}
                        </p>
                    </div>
                </CardContent>
            </Card>
                                            
        </TooltipProvider>
    )
} 