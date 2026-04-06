import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { type Language, getAllLanguages, getCanonicalUrl, generateLanguageAlternates } from "@/config/languages"
import { Metadata } from "next"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"
import { SideNav } from "@/components/side-nav"
import { GPUSelectionGuide } from "@/components/gpu-selection-guide"
import { Breadcrumb } from "@/components/breadcrumb"
import { UpdateNotification } from "@/components/update-notification"
import { getModelBySlug, getAllModelSlugs } from "@/config/models"
import { notFound } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'

export async function generateStaticParams() {
    const modelSlugs = getAllModelSlugs()
    const languages = getAllLanguages()

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

    const t = await getTranslations({ locale: lang, namespace: 'tools.llmGpuCalculator.models' })

    // 使用插值模板
    const modelData = t.raw(`${modelSlug}`)
    const interpolationData = {
        ...modelData,
        modelLower: modelSlug.toLowerCase()
    }
    const seoTitle = t('seoTitle', interpolationData)
    const seoDescription = t('seoDescription', interpolationData)
    const keywords = t('keywords', interpolationData)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
    const path = `llm-gpu-memory-calculator/${modelSlug}`

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: keywords,
        alternates: {
            canonical: getCanonicalUrl(baseUrl, lang, path),
            languages: generateLanguageAlternates(baseUrl, path),
        },
        other: {
            'application-name': `${model.name} GPU Calculator`
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

    return (
        <div className="min-h-screen flex flex-col">
            <StructuredData language={language} model={model} modelSlug={modelSlug} />

            <LanguageSwitcher className="fixed top-4 right-4 z-50" />
            <SideNav currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    {/* 更新通知 */}
                    <UpdateNotification />

                    <PageContent model={model} />

                    <Suspense fallback={<div>Loading...</div>}>
                        <LLMMemoryCalculator preferredModelType={modelSlug} />
                    </Suspense>

                    {/* <div className="mt-8">
                        <GPUSelectionGuide />
                    </div> */}


                </div>
                <Footer />
            </main>
        </div>
    )
}

function PageContent({ model }: { model: any }) {
    const t = useTranslations('tools.llmGpuCalculator')
    const tn = useTranslations('nav')

    // 面包屑导航项
    const breadcrumbItems = [
        {
            label: tn('aiTools'),
            href: `/`
        },
        {
            label: tn('gpuCalculator'),
            href: `/llm-gpu-memory-calculator`
        },
        {
            label: model.name,
            current: true
        }
    ]

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <header className="flex flex-col items-center gap-2 mt-8">
                <h1 className="text-2xl font-bold text-center">
                    {t('calculatorTitle', { model: model.name })}
                </h1>
                <p className="text-center text-muted-foreground text-sm max-w-md">
                    {t('calculatorDescription', { model: model.name })}
                </p>
            </header>
        </>
    )
}

function StructuredData({ language, model, modelSlug }: { language: Language, model: any, modelSlug: string }) {
    const t = useTranslations('tools.llmGpuCalculator.models')

    // 使用插值模板
    const modelData = t.raw(`${modelSlug}`)
    const interpolationData = {
        ...modelData,
        modelLower: modelSlug.toLowerCase()
    }
    const seoDescription = t('seoDescription', interpolationData)

    // 结构化数据
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${model.name} GPU Calculator`,
        "description": seoDescription,
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
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData)
            }}
        />
    )
}
