import TokenCounter from "@/components/token-counter"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import { Breadcrumb } from "@/components/breadcrumb"
import { getTokenCounterModelBySlug, getAllTokenCounterModelSlugs, getTokenCounterDefaultModel } from "@/config/models"
import { notFound } from "next/navigation"
import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'

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

    const t = await getTranslations({ locale: lang, namespace: 'tokenCounterModels' })

    // 使用插值模板
    const modelData = t.raw(`${companySlug}`)
    const seoTitle = t('seoTitle', modelData)
    const seoDescription = t('seoDescription', modelData)
    const keywords = t('keywords', modelData)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
    const path = `token-counter-visualizer/${companySlug}`

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: keywords,
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
        other: {
            'application-name': `${model.name} Token Counter`
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

    return (
        <div className="min-h-screen flex flex-col">
            <StructuredData language={language} model={model} companySlug={companySlug} />

            <LanguageSwitcher className="fixed top-4 right-4 z-50" />
            <SideNav currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    <PageContent model={model} />

                    <Suspense fallback={<div>Loading...</div>}>
                        <TokenCounter
                            language={language}
                            defaultModel={defaultModelValue}
                            preferredCompany={model.company}
                        />
                    </Suspense>

                    <OptimizationTipsSection model={model} />
                </div>
                <Footer />
            </main>
        </div>
    )
}

function PageContent({ model }: { model: any }) {
    const t = useTranslations('tools.tokenCounter')
    const tn = useTranslations('nav')
    const tm = useTranslations('tokenCounterModels')

    // 面包屑导航项
    const breadcrumbItems = [
        {
            label: tn('aiTools'),
            href: `/`
        },
        {
            label: t('title'),
            href: `/token-counter-visualizer`
        },
        {
            label: model.name,
            current: true
        }
    ]

    // 使用插值模板
    const modelData = tm.raw(`${model.slug}`)
    const pageTitle = tm('seoTitle', modelData)
    const pageDescription = tm('description', modelData)

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <header className="flex flex-col items-center gap-1 mt-8">
                <h1 className="text-2xl font-bold text-center">
                    {pageTitle}
                </h1>
                <p className="text-center text-muted-foreground text-sm">
                    {pageDescription}
                </p>
            </header>
        </>
    )
}

function StructuredData({ language, model, companySlug }: { language: Language, model: any, companySlug: string }) {
    const tm = useTranslations('tokenCounterModels')

    // 使用插值模板
    const modelData = tm.raw(`${companySlug}`)
    const seoDescription = tm('seoDescription', modelData)
    const representativeModels = tm(`${companySlug}.representativeModels`)

    // 结构化数据
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${model.name} Token Counter`,
        "description": seoDescription,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.linpp2009.com'}/${language}/token-counter-visualizer/${companySlug}`,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "provider": {
            "@type": "Organization",
            "name": model.company
        },
        "targetProduct": {
            "@type": "SoftwareApplication",
            "name": model.name,
            "provider": model.company
        },
        "supportedModels": representativeModels,
        "author": {
            "@type": "Organization",
            "name": "linpp2009.com",
            "url": "https://app.linpp2009.com"
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0]
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

function OptimizationTipsSection({ model }: { model: any }) {
    const locale = useLocale()
    const t = useTranslations('common.ui')
    
    return (
                    <section className="mt-6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">
                {t('optimizationTipsFor', { model: model.name })}
                        </h3>
                            <div className="text-sm text-gray-600 space-y-2">
                <p>• <strong>{t('tokenEfficiency')}</strong></p>
                <p>• <strong>{t('modelSelection', { company: model.company })}</strong></p>
                <p>• <strong>{t('batchProcessing')}</strong></p>
                <p>• <strong>{t('contextManagement')}</strong></p>
                <p>• <strong>{t('costPlanning')}</strong></p>
                            </div>
                    </section>
    )
} 