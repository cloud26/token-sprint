import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"
import { SideNav } from "@/components/side-nav"
import { GPUSelectionGuide } from "@/components/gpu-selection-guide"
import { Breadcrumb } from "@/components/breadcrumb"
import { getModelBySlug, getAllModelSlugs } from "@/config/models"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    const modelSlugs = getAllModelSlugs()
    const languages: Language[] = ['en', 'zh']
    
    return languages.flatMap(lang => 
        modelSlugs.map(model => ({
            lang,
            model
        }))
    )
}

export async function generateMetadata({ 
    params 
}: { 
    params: Promise<{ lang: Language; model: string }> 
}): Promise<Metadata> {
    const { lang, model: modelSlug } = await params
    const model = getModelBySlug(modelSlug)
    
    if (!model) {
        return {
            title: 'Model Not Found',
            description: 'The requested model configuration was not found.'
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
    const path = `llm-gpu-memory-calculator/${modelSlug}`

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
            'application-name': `${model.name} GPU Calculator`,
            'keywords': lang === 'en' ? 
                `${model.name.toLowerCase()}, gpu requirements, local deployment, ${model.name.toLowerCase()} requirements, ai model deployment` :
                `${model.name}, GPU需求, 本地部署, ${model.name}显卡需求, AI模型部署`
        }
    }
}

export default function ModelSpecificCalculatorPage({
    params,
}: {
    params: Promise<{ lang: Language; model: string }>
}) {
    const { lang: language, model: modelSlug } = use(params)
    const model = getModelBySlug(modelSlug)
    
    if (!model) {
        notFound()
    }

    const currentPath = `/${language}/llm-gpu-memory-calculator/${modelSlug}`

    // 面包屑导航项
    const breadcrumbItems = [
        {
            label: language === 'en' ? 'AI Tools' : 'AI工具',
            href: `/${language}`
        },
        {
            label: language === 'en' ? 'GPU Calculator' : 'GPU计算器',
            href: `/${language}/llm-gpu-memory-calculator`
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
        "name": `${model.name} GPU Calculator`,
        "description": model.seoDescription[language],
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.linpp2009.com'}/${language}/llm-gpu-memory-calculator/${modelSlug}`,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "about": {
            "@type": "AIModel",
            "name": model.name,
            "parameters": `${model.parameters}B`,
            "recommendedPrecision": model.recommendedPrecision
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* SEO结构化数据 */}
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
                    
                    <header className="flex flex-col items-center gap-2 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {language === 'en' ? 
                                `${model.name} VRAM & GPU Calculator` :
                                `${model.name} 显存与GPU计算器`
                            }
                        </h1>
                        <p className="text-center text-muted-foreground text-sm max-w-md">
                            {language === 'en' ? 
                                `Calculate VRAM requirements and GPU count for ${model.name} deployment. Support for NVIDIA, AMD, Apple, and Huawei` :
                                `计算${model.name}部署所需的显存和GPU数量，支持NVIDIA、AMD、苹果、华为等各厂商显卡`
                            }
                        </p>
                    </header>

                    <Suspense fallback={<div>Loading...</div>}>
                        <LLMMemoryCalculator language={language} preferredModelType={modelSlug} />
                    </Suspense>

                    {/* GPU Selection Guide */}
                    <div className="mt-8">
                        <GPUSelectionGuide language={language} />
                    </div>

                    {/* 模型专属建议 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? `${model.name} Deployment Tips` : `${model.name}部署建议`}
                        </h2>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="text-sm text-yellow-800">
                                {language === 'en' ? (
                                    <>
                                        <p className="font-medium mb-2">💡 Optimization Recommendations:</p>
                                        <ul className="space-y-1">
                                            <li>• <strong>Precision:</strong> {model.recommendedPrecision} recommended for optimal performance/memory balance</li>
                                            <li>• <strong>Parameters:</strong> ~{model.parameters}B parameters require careful memory planning</li>
                                            <li>• <strong>Deployment:</strong> Consider using model parallelism for large models</li>
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium mb-2">💡 优化建议：</p>
                                        <ul className="space-y-1">
                                            <li>• <strong>精度:</strong> 推荐使用{model.recommendedPrecision}以获得最佳性能/内存平衡</li>
                                            <li>• <strong>参数量:</strong> 约{model.parameters}B参数需要仔细规划内存</li>
                                            <li>• <strong>部署:</strong> 大模型建议使用模型并行化</li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </main>
        </div>
    )
} 