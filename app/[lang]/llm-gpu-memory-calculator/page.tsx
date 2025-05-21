import { BackToHome } from "@/components/back-to-home"
import LanguageSwitcher from "@/components/language-switcher"
import { use } from "react"

export default function LLMGPUMemoryCalculator({
    params,
}: {
    params: Promise<{ lang: "en" | "zh" }>
}) {
    const { lang: language } = use(params)

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-2 md:p-8 md:pt-4">
            <div className="w-full max-w-4xl space-y-2">
                <div className="flex flex-col items-center gap-1 mt-8">
                    <div className="w-full flex justify-start mb-4">
                        <BackToHome language={language} />
                    </div>
                    <LanguageSwitcher language={language} />
                    <h1 className="text-2xl font-bold text-center">
                        {language === "zh" ? "大模型推理显存与GPU数量计算器" : "LLM GPU Memory Calculator"}
                    </h1>
                    <p className="text-center text-muted-foreground text-sm">
                        {language === "zh"
                            ? "计算大语言模型推理所需的显存和GPU数量"
                            : "Calculate GPU memory requirements and GPU count for LLM inference"}
                    </p>
                </div>
                <iframe
                    src="https://llm-gpu-memory-calculater.linpp2009.com/"
                    className="w-full h-[800px] rounded-lg border shadow-lg"
                    title="LLM GPU Memory Calculator"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </main>
    )
} 