import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"
import { SideNav } from "@/components/side-nav"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.linpp2009.com')
    const path = 'llm-gpu-memory-calculator'

    return {
        title: tools.llmGpuCalculator.metadata.title[lang],
        description: tools.llmGpuCalculator.metadata.description[lang],
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
    }
}

export default function LLMGPUMemoryCalculatorPage({
    params,
}: {
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)
    const currentPath = `/${language}/llm-gpu-memory-calculator`

    return (
        <div className="min-h-screen flex flex-col">
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-64 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-4xl space-y-2 flex-1">
                    <header className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.llmGpuCalculator.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.llmGpuCalculator.description[language]}
                        </p>
                    </header>
                    
                    <LLMMemoryCalculator language={language} />
                    
                    {/* 使用说明 - 真正有SEO价值的内容 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? 'How to Use This LLM Inference Hardware Calculator' : '如何使用这个大模型推理硬件计算器'}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-2">
                            {language === 'en' ? (
                                <>
                                    <p>This LLM inference hardware calculator helps you determine the optimal GPU configuration for deploying large language models:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Model Parameters:</strong> Enter the size of your language model in billions (e.g., 7B, 13B, 70B)</li>
                                        <li><strong>Precision Format:</strong> Choose the precision (FP16, FP8, INT8, INT4) - lower precision reduces memory usage</li>
                                        <li><strong>GPU Selection:</strong> Select your target GPU model (H100, A100, RTX 4090, etc.)</li>
                                        <li><strong>Results:</strong> Get model memory, inference overhead, total VRAM requirements, and GPU count needed</li>
                                    </ul>
                                    <p>Perfect for AI engineers, ML researchers, and companies planning LLM deployment infrastructure.</p>
                                </>
                            ) : (
                                <>
                                    <p>这个大模型推理硬件计算器帮助您确定部署大语言模型的最佳GPU配置：</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>模型参数：</strong> 输入您的语言模型大小（十亿参数，如7B、13B、70B）</li>
                                        <li><strong>精度格式：</strong> 选择精度（FP16、FP8、INT8、INT4）- 较低精度可减少显存使用</li>
                                        <li><strong>GPU选择：</strong> 选择目标GPU型号（H100、A100、RTX 4090等）</li>
                                        <li><strong>结果：</strong> 获取模型显存、推理开销、总显存需求和所需GPU数量</li>
                                    </ul>
                                    <p>适合AI工程师、ML研究人员和计划LLM部署基础设施的公司。</p>
                                </>
                            )}
                        </div>
                    </section>
                </div>
                <Footer />
            </main>
        </div>
    )
} 