import TokenCounter from "@/components/token-counter"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import Link from "next/link"

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
        other: {
            'application-name': 'AI Token Counter',
            'keywords': lang === 'en' ? 
                'token counter, ai token counter, ai tokenizer, gpt token counter, claude token counter, gemini token counter, deepseek token counter, llama token counter, token calculator, ai tokenizer online, best ai tokenizer' :
                'token计数器, AI token计数器, AI tokenizer, GPT token计数器, Claude token计数器, Gemini token计数器, DeepSeek token计数器, Llama token计数器, token计算器, AI分词器, 在线tokenizer'
        }
    }
}

export default function TokenCounterPage({
    params,
}: {
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)
    const currentPath = `/${language}/token-counter-visualizer`

    // 结构化数据
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": language === 'en' ? "AI Token Counter" : "AI Token 计数器",
        "description": tools.tokenCounter.metadata.description[language],
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.linpp2009.com'}/${language}/token-counter-visualizer`,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            language === 'en' ? "Token counting for multiple AI models" : "多种AI模型的Token计数",
            language === 'en' ? "Visual token breakdown" : "可视化Token分解",
            language === 'en' ? "Support for GPT, Claude, Gemini, DeepSeek, Llama models" : "支持GPT、Claude、Gemini、DeepSeek、Llama模型",
            language === 'en' ? "Real-time token analysis" : "实时Token分析"
        ],
        "supportedModels": [
            "GPT-4o", "GPT-4", "GPT-4 Turbo", "GPT-3.5 Turbo",
            "Gemini 1.5 Pro", "Gemini 1.5 Flash", "Gemini Pro",
            "Claude 4 Opus", "Claude 4 Sonnet", "Claude 3.7 Sonnet", "Claude 3.5 Sonnet", "Claude 3.5 Haiku",
            "Claude 3 Opus", "Claude 3 Sonnet", "Claude 3 Haiku",
            "Llama 3.1 405B", "Llama 3.1 70B", "Llama 3.1 8B", "Llama 2 70B", "Llama 2 13B", "Llama 2 7B",
            "DeepSeek-V3 Chat", "DeepSeek-R1 Reasoner"
        ],
        "author": {
            "@type": "Organization",
            "name": "linpp2009.com",
            "url": "https://www.linpp2009.com"
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0]
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* JSON-LD 结构化数据 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
            
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-xl space-y-2 flex-1">
                    <header className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.tokenCounter.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.tokenCounter.description[language]}
                        </p>
                    </header>

                    {/* Quick Start Links - 优先体验 */}
                    <section className="mt-6 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? 'Quick Start Examples' : '快速开始示例'}
                        </h2>
                        <div className="text-sm space-y-3">
                            <p className="text-muted-foreground">
                                {language === 'en' ? 
                                    'Click to quickly test different AI model tokenizers:' : 
                                    '点击快速测试不同AI模型的分词器：'
                                }
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Link href={`/${language}/token-counter-visualizer?model=gpt-4o`} 
                                   className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs transition-colors">
                                    GPT-4o Counter
                                </Link>
                                <Link href={`/${language}/token-counter-visualizer?model=claude-4-opus`} 
                                   className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded text-xs transition-colors">
                                    Claude 4 Counter
                                </Link>
                                <Link href={`/${language}/token-counter-visualizer?model=claude-3.5-sonnet`} 
                                   className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs transition-colors">
                                    Claude 3.5 Counter
                                </Link>
                                <Link href={`/${language}/token-counter-visualizer?model=gemini-1.5-pro`} 
                                   className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded text-xs transition-colors">
                                    Gemini Counter
                                </Link>
                                <Link href={`/${language}/token-counter-visualizer?model=llama-3.1-70b`} 
                                   className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-xs transition-colors">
                                    Llama Counter
                                </Link>
                                <Link href={`/${language}/token-counter-visualizer?model=deepseek-chat`} 
                                   className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs transition-colors">
                                    DeepSeek Counter
                                </Link>
                            </div>
                        </div>
                    </section>

                    <Suspense fallback={<div>Loading...</div>}>
                        <TokenCounter language={language} />
                    </Suspense>

                    {/* 使用说明 - SEO内容 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? 'How to Use This Token Counter & Tokenizer Tool' : '如何使用这个Token计数器和分词器工具'}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-2">
                            {language === 'en' ? (
                                <>
                                    <p>This token counter and tokenizer tool helps you accurately count tokens in your text for AI applications:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Text Input:</strong> Paste or type your text in the input area</li>
                                        <li><strong>Tokenizer Selection:</strong> Choose from different AI model tokenizers (GPT-3.5, GPT-4, Claude, Gemini, Llama, DeepSeek, etc.)</li>
                                        <li><strong>Real-time Counting:</strong> See token count, character count, and word count update in real-time</li>
                                        <li><strong>Visual Breakdown:</strong> See how your text is tokenized with color-coded visualization</li>
                                    </ul>
                                    <p>Perfect for developers, content creators, and anyone working with AI APIs who need to optimize text length and understand tokenization. Our online tokenizer supports all major AI models including GPT, Claude, Gemini, Llama, and DeepSeek.</p>
                                </>
                            ) : (
                                <>
                                    <p>这个Token计数器和分词器工具帮助您准确计算AI应用中文本的token数量：</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>文本输入：</strong> 在输入区域粘贴或输入您的文本</li>
                                        <li><strong>分词器选择：</strong> 从不同的AI模型分词器中选择（GPT-3.5、GPT-4、Claude、Gemini、Llama、DeepSeek等）</li>
                                        <li><strong>实时计数：</strong> 实时查看token数量、字符数和单词数</li>
                                        <li><strong>可视化分解：</strong> 通过彩色编码可视化查看文本如何被分词</li>
                                    </ul>
                                    <p>适合开发者、内容创作者以及任何需要优化文本长度和理解分词机制的AI API用户。我们的在线分词器支持所有主流AI模型，包括GPT、Claude、Gemini、Llama和DeepSeek。</p>
                                </>
                            )}
                        </div>
                        
                        {/* 支持的模型列表 - SEO优化 */}
                        <div className="mt-6">
                            <h3 className="text-md font-semibold mb-2">
                                {language === 'en' ? 'Supported AI Models' : '支持的AI模型'}
                            </h3>
                            <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <p className="font-medium text-gray-700">OpenAI GPT:</p>
                                    <p>GPT-4o, GPT-4, GPT-4 Turbo, GPT-3.5 Turbo</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Google Gemini:</p>
                                    <p>Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini Pro</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Anthropic Claude:</p>
                                    <p>Claude 4 (Opus, Sonnet), Claude 3.7, Claude 3.5 (Sonnet, Haiku)</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Meta Llama:</p>
                                    <p>Llama 3.1 (405B, 70B, 8B), Llama 2 (70B, 13B, 7B)</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">DeepSeek:</p>
                                    <p>DeepSeek-V3 Chat, DeepSeek-R1 Reasoner</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </main>
        </div>
    )
} 