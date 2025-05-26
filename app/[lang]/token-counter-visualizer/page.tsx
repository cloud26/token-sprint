import TokenCounter from "@/components/token-counter"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.linpp2009.com')
    const path = 'token-counter-visualizer'

    return {
        title: tools.tokenCounter.metadata.title[lang],
        description: tools.tokenCounter.metadata.description[lang],
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
    }
}

export default function TokenCounterPage({
    params,
}: {
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)
    const currentPath = `/${language}/token-counter-visualizer`

    return (
        <div className="min-h-screen flex flex-col">
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    <header className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.tokenCounter.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.tokenCounter.description[language]}
                        </p>
                    </header>

                    <TokenCounter language={language} />

                    {/* 使用说明 - SEO内容 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? 'How to Use This Token Counter Tool' : '如何使用这个Token计数器工具'}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-2">
                            {language === 'en' ? (
                                <>
                                    <p>This token counter tool helps you accurately count tokens in your text for AI applications:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Text Input:</strong> Paste or type your text in the input area</li>
                                        <li><strong>Model Selection:</strong> Choose from different tokenizer models (GPT-3.5, GPT-4, Claude, etc.)</li>
                                        <li><strong>Real-time Counting:</strong> See token count, character count, and estimated costs update in real-time</li>
                                        <li><strong>Cost Estimation:</strong> Get approximate API costs based on current pricing</li>
                                    </ul>
                                    <p>Perfect for developers, content creators, and anyone working with AI APIs who need to optimize text length and control costs.</p>
                                </>
                            ) : (
                                <>
                                    <p>这个Token计数器工具帮助您准确计算AI应用中文本的token数量：</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>文本输入：</strong> 在输入区域粘贴或输入您的文本</li>
                                        <li><strong>模型选择：</strong> 从不同的分词器模型中选择（GPT-3.5、GPT-4、Claude等）</li>
                                        <li><strong>实时计数：</strong> 实时查看token数量、字符数和预估成本</li>
                                        <li><strong>成本估算：</strong> 基于当前定价获取大概的API成本</li>
                                    </ul>
                                    <p>适合开发者、内容创作者以及任何需要优化文本长度和控制成本的AI API用户。</p>
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