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
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
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
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.linpp2009.com'}/${language}/token-counter-visualizer`,
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
            "url": "https://app.linpp2009.com"
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
                <div className="w-full max-w-2xl space-y-2 flex-1">
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
                            {language === 'en' ? 'Business Guide: Token Optimization & Cost Control' : '业务指南：Token优化与成本控制'}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-4">
                            {language === 'en' ? (
                                <>
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">💰 API Cost Estimation</h3>
                                        <p>Understanding token counts is crucial for cost management. For example:</p>
                                        <ul className="list-disc pl-5 space-y-1 mt-2">
                                            <li><strong>GPT-4o:</strong> $15/1M input tokens - A 1000-token prompt costs ~$0.015</li>
                                            <li><strong>Claude 3.5 Sonnet:</strong> $3/1M tokens - Same prompt costs ~$0.003</li>
                                            <li><strong>Gemini 1.5 Pro:</strong> $1.25/1M tokens - Same prompt costs ~$0.00125</li>
                                        </ul>
                                        <p className="mt-2">Use our calculator to estimate costs before scaling your application.</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">🎯 Business Scenarios</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>Content Generation:</strong> Pre-calculate token limits for blog posts, marketing copy</li>
                                            <li><strong>Customer Support:</strong> Optimize chatbot responses to stay within context windows</li>
                                            <li><strong>Document Analysis:</strong> Chunk large documents efficiently for processing</li>
                                            <li><strong>API Integration:</strong> Validate input size before expensive API calls</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">⚡ Optimization Strategies</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>Model Selection:</strong> Use cheaper models for simple tasks, premium for complex ones</li>
                                            <li><strong>Prompt Engineering:</strong> Shorter, more specific prompts often yield better results</li>
                                            <li><strong>Context Management:</strong> Monitor conversation length to avoid hitting limits</li>
                                            <li><strong>Batch Processing:</strong> Combine multiple requests to reduce overhead</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                        <p className="font-medium text-blue-800">💡 Pro Tip:</p>
                                        <p className="text-blue-700">Different tokenizers can produce 20-40% variation in token counts for the same text. Test with your target model's tokenizer for accurate cost estimation.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">💰 API成本估算</h3>
                                        <p>理解token数量对成本管控至关重要。例如：</p>
                                        <ul className="list-disc pl-5 space-y-1 mt-2">
                                            <li><strong>GPT-4o:</strong> $15/100万token - 1000个token的提示词成本约$0.015</li>
                                            <li><strong>Claude 3.5 Sonnet:</strong> $3/100万token - 相同提示词成本约$0.003</li>
                                            <li><strong>Gemini 1.5 Pro:</strong> $1.25/100万token - 相同提示词成本约$0.00125</li>
                                        </ul>
                                        <p className="mt-2">在扩展应用前使用我们的计算器评估成本。</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">🎯 业务场景应用</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>内容生成：</strong> 为博客文章、营销文案预先计算token限制</li>
                                            <li><strong>客户支持：</strong> 优化聊天机器人响应以保持在上下文窗口内</li>
                                            <li><strong>文档分析：</strong> 高效分块大型文档进行处理</li>
                                            <li><strong>API集成：</strong> 在昂贵的API调用前验证输入大小</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">⚡ 优化策略</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>模型选择：</strong> 简单任务使用便宜模型，复杂任务使用高级模型</li>
                                            <li><strong>提示工程：</strong> 更短、更具体的提示词往往产生更好的结果</li>
                                            <li><strong>上下文管理：</strong> 监控对话长度以避免达到限制</li>
                                            <li><strong>批处理：</strong> 合并多个请求以减少开销</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                        <p className="font-medium text-blue-800">💡 专业提示：</p>
                                        <p className="text-blue-700">不同的分词器对相同文本可能产生20-40%的token数量差异。使用目标模型的分词器测试以获得准确的成本估算。</p>
                                    </div>
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