"use client"

import { useState } from "react"
import TokenSpeedDemo from "@/components/token-speed-demo"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackToHome } from "@/components/back-to-home"

export default function TokenGenerationSpeedVisualizer() {
    const [language, setLanguage] = useState<"en" | "zh">("zh")

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-2 md:p-8 md:pt-4">
            <div className="w-full max-w-3xl space-y-2">
                <div className="flex flex-col items-center gap-1 mt-8">
                    <div className="w-full flex justify-start mb-4">
                        <BackToHome language={language} />
                    </div>
                    <Tabs value={language} onValueChange={(value) => setLanguage(value as "en" | "zh")} className="mb-1">
                        <TabsList className="grid w-32 grid-cols-2">
                            <TabsTrigger value="zh">中文</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <h1 className="text-2xl font-bold text-center">{language === "zh" ? "Token 生成速度可视化" : "Token Generation Speed Visualizer"}</h1>
                    <p className="text-center text-muted-foreground text-sm">
                        {language === "zh"
                            ? "实时体验不同的 token 生成速度"
                            : "Experience different token generation speeds in real-time"}
                    </p>
                </div>
                <TokenSpeedDemo initialLanguage={language} />
            </div>
        </main>
    )
} 