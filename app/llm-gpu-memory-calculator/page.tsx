"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LLMGPUMemoryCalculator() {
    const [language, setLanguage] = useState<"en" | "zh">("zh")

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-2 md:p-8 md:pt-4">
            <div className="w-full max-w-4xl space-y-2">
                <div className="flex flex-col items-center gap-1 mt-8">
                    <Tabs value={language} onValueChange={(value) => setLanguage(value as "en" | "zh")} className="mb-1">
                        <TabsList className="grid w-32 grid-cols-2">
                            <TabsTrigger value="zh">中文</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <h1 className="text-2xl font-bold text-center">
                        {language === "zh" ? "大模型推理显存与GPU数量计算器" : "LLM GPU Memory Calculator"}
                    </h1>
                    <p className="text-center text-muted-foreground text-sm">
                        {language === "zh"
                            ? "计算大语言模型推理所需的显存和GPU数量"
                            : "Calculate GPU memory requirements and GPU count for LLM inference"}
                    </p>
                </div>
                <div className="w-full h-[800px] rounded-lg overflow-hidden border shadow-lg">
                    <iframe
                        src="https://llm-gpu-memory-calculater.linpp2009.com/"
                        className="w-full h-full"
                        title="LLM GPU Memory Calculator"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </main>
    )
} 