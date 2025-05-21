import { BackToHome } from "@/components/back-to-home"
import LanguageSwitcher from "@/components/language-switcher"
import { use } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    return {
        title: tools.llmGpuCalculator.metadata.title[lang],
        description: tools.llmGpuCalculator.metadata.description[lang],
    }
}

export default function LLMGPUMemoryCalculatorPage({
    params,
}: {
    params: Promise<{ lang: Language }>
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
                        {tools.llmGpuCalculator.title[language]}
                    </h1>
                    <p className="text-center text-muted-foreground text-sm">
                        {tools.llmGpuCalculator.description[language]}
                    </p>
                </div>
                <LLMMemoryCalculator language={language} />
            </div>
        </main>
    )
} 