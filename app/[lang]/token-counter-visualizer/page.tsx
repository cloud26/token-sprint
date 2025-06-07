import TokenCounter from "@/components/token-counter"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const t = await getTranslations({ locale: lang, namespace: 'tools.tokenCounter' })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
    const path = 'token-counter-visualizer'

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        keywords: t('metadata.keywords'),
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
        other: {
            'application-name': 'AI Token Counter'
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

    return (
        <div className="min-h-screen flex flex-col">
            <StructuredData language={language} />

            <LanguageSwitcher className="fixed top-4 right-4 z-50" />
            <SideNav currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    <PageContent />

                    <Suspense fallback={<div>Loading...</div>}>
                        <TokenCounter language={language} />
                    </Suspense>

                    <BusinessGuideSection />
                </div>
            </main>

            <Footer />
        </div>
    )
}

function PageContent() {
    const t = useTranslations('tools.tokenCounter')
    const tn = useTranslations('nav')
    
    // 面包屑导航项
    const breadcrumbItems = [
        {
            label: tn('aiTools'),
            href: `/`
        },
        {
            label: t('title'),
            current: true
        }
    ]

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <header className="flex flex-col items-center gap-1 mt-8">
                <h1 className="text-2xl font-bold text-center">
                    {t('title')}
                </h1>
                <p className="text-center text-muted-foreground text-sm">
                    {t('description')}
                </p>
            </header>
        </>
    )
}

function StructuredData({ language }: { language: Language }) {
    const t = useTranslations('tools.tokenCounter')
    
    // 结构化数据
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": t('structured.aiTokenCounter'),
        "description": t('metadata.description'),
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.linpp2009.com'}/${language}/token-counter-visualizer`,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            t('structured.tokenCountingModels'),
            t('structured.visualBreakdown'),
            t('structured.modelSupport'),
            t('structured.realtimeAnalysis')
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
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData)
            }}
        />
    )
}

function BusinessGuideSection() {
    const locale = useLocale()
    const t = useTranslations('common.ui')
    
    return (
        <section className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">
                {t('businessGuide')}
            </h2>
            <div className="text-sm text-muted-foreground space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{t('businessGuideContent.costEstimation.title')}</h3>
                    <p>{t('businessGuideContent.costEstimation.description')}</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>{t('businessGuideContent.costEstimation.examples.gpt4o')}</strong></li>
                        <li><strong>{t('businessGuideContent.costEstimation.examples.claude')}</strong></li>
                        <li><strong>{t('businessGuideContent.costEstimation.examples.gemini')}</strong></li>
                    </ul>
                    <p className="mt-2">{t('businessGuideContent.costEstimation.tip')}</p>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{t('businessGuideContent.businessScenarios.title')}</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>{t('businessGuideContent.businessScenarios.contentGeneration')}</strong></li>
                        <li><strong>{t('businessGuideContent.businessScenarios.customerSupport')}</strong></li>
                        <li><strong>{t('businessGuideContent.businessScenarios.documentAnalysis')}</strong></li>
                        <li><strong>{t('businessGuideContent.businessScenarios.apiIntegration')}</strong></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{t('businessGuideContent.optimizationStrategies.title')}</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>{t('businessGuideContent.optimizationStrategies.modelSelection')}</strong></li>
                        <li><strong>{t('businessGuideContent.optimizationStrategies.promptEngineering')}</strong></li>
                        <li><strong>{t('businessGuideContent.optimizationStrategies.contextManagement')}</strong></li>
                        <li><strong>{t('businessGuideContent.optimizationStrategies.batchProcessing')}</strong></li>
                    </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="font-medium text-blue-800">{t('businessGuideContent.proTip.title')}</p>
                    <p className="text-blue-700">{t('businessGuideContent.proTip.content')}</p>
                </div>
            </div>
        </section>
    )
} 