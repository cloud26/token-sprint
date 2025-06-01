import TokenCounter from "@/components/token-counter"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import { Breadcrumb } from "@/components/breadcrumb"
import { getTokenCounterModelBySlug, getAllTokenCounterModelSlugs, getTokenCounterDefaultModel } from "@/config/models"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    const modelSlugs = getAllTokenCounterModelSlugs()
    const languages: Language[] = ['en', 'zh']
    
    return languages.flatMap(lang => 
        modelSlugs.map(model => ({
            lang,
            model
        }))
    )
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Language; model: string }> }): Promise<Metadata> {
    const { lang, model: companySlug } = await params
    const model = getTokenCounterModelBySlug(companySlug)
    
    if (!model) {
        notFound()
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
    const path = `token-counter-visualizer/${companySlug}`

    return {
        title: model.seoTitle[lang],
        description: model.seoDescription[lang],
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
        other: {
            'application-name': `${model.name} Token Counter`,
            'keywords': lang === 'en' ?
                `${model.name} token counter, ${model.name} tokenizer, ${model.company} tokens, AI token calculator, ${model.name} cost calculator` :
                `${model.name} token计数器, ${model.name} 分词器, ${model.company} tokens, AI token计算器, ${model.name} 成本计算器`
        }
    }
}

export default function TokenCounterModelPage({
    params,
}: {
    params: Promise<{ lang: Language; model: string }>
}) {
    const { lang: language, model: companySlug } = use(params)
    const model = getTokenCounterModelBySlug(companySlug)
    
    if (!model) {
        notFound()
    }

    const currentPath = `/${language}/token-counter-visualizer/${companySlug}`
    const defaultModelValue = getTokenCounterDefaultModel(companySlug)

    // 面包屑导航项
    const breadcrumbItems = [
        {
            label: language === 'en' ? 'AI Tools' : 'AI工具',
            href: `/${language}`
        },
        {
            label: tools.tokenCounter.title[language],
            href: `/${language}/token-counter-visualizer`
        },
        {
            label: model.name,
            current: true
        }
    ]

    // 结构化数据
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${model.name} Token Counter`,
        "description": model.seoDescription[language],
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.linpp2009.com'}/${language}/token-counter-visualizer/${companySlug}`,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": model.features[language],
        "provider": {
            "@type": "Organization",
            "name": model.company
        },
        "targetProduct": {
            "@type": "SoftwareApplication",
            "name": model.name,
            "provider": model.company
        },
        "supportedModels": model.representativeModels[language],
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
                    {/* 面包屑导航 */}
                    <Breadcrumb items={breadcrumbItems} language={language} />
                    
                    <header className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {model.seoTitle[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {model.description[language]}
                        </p>
                    </header>

                    <Suspense fallback={<div>Loading...</div>}>
                        <TokenCounter 
                            language={language} 
                            defaultModel={defaultModelValue}
                            preferredCompany={model.company}
                        />
                    </Suspense>

                    {/* 使用场景 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? `Best Use Cases for ${model.name}` : `${model.name} 最佳使用场景`}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {model.useCases[language].map((useCase, index) => (
                                    <div key={index} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                        <p className="text-amber-800">{useCase}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 专业提示 */}
                    <section className="mt-6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">
                            {language === 'en' ? `Optimization Tips for ${model.name}` : `${model.name} 优化建议`}
                        </h3>
                        {language === 'en' ? (
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>• <strong>Token Efficiency:</strong> Use precise, concise prompts to minimize token usage and costs.</p>
                                <p>• <strong>Model Selection:</strong> Choose the right {model.company} model for your specific use case and budget.</p>
                                <p>• <strong>Batch Processing:</strong> Combine multiple requests when possible to reduce API overhead.</p>
                                <p>• <strong>Context Management:</strong> Monitor conversation length to stay within model limits.</p>
                                <p>• <strong>Cost Planning:</strong> Use this counter to estimate costs before implementing in production.</p>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>• <strong>Token效率:</strong> 使用精确、简洁的提示词来最小化token使用量和成本。</p>
                                <p>• <strong>模型选择:</strong> 根据您的具体用例和预算选择合适的{model.company}模型。</p>
                                <p>• <strong>批处理:</strong> 尽可能合并多个请求以减少API开销。</p>
                                <p>• <strong>上下文管理:</strong> 监控对话长度以保持在模型限制内。</p>
                                <p>• <strong>成本规划:</strong> 在生产环境实施前使用此计数器估算成本。</p>
                            </div>
                        )}
                    </section>
                </div>
                <Footer />
            </main>
        </div>
    )
} 