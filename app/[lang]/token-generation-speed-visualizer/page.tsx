"use client"

import TokenSpeedDemo from "@/components/token-speed-demo"
import { BackToHome } from "@/components/back-to-home"
import LanguageSwitcher from "@/components/language-switcher"
import { use } from "react"

export default function TokenGenerationSpeedVisualizer({
    params,
}: {
    params: Promise<{ lang: "en" | "zh" }>
}) {
    const { lang: language } = use(params)

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-2 md:p-8 md:pt-4">
            <div className="w-full max-w-3xl space-y-2">
                <div className="flex flex-col items-center gap-1 mt-8">
                    <div className="w-full flex justify-start mb-4">
                        <BackToHome language={language} />
                    </div>
                    <LanguageSwitcher language={language} />
                    <h1 className="text-2xl font-bold text-center">
                        {language === "zh" ? "Token 生成速度可视化" : "Token Generation Speed Visualizer"}
                    </h1>
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