import TokenSpeedDemo from "@/components/token-speed-demo"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use } from "react"
import { type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import { Breadcrumb } from "@/components/breadcrumb"
import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const t = await getTranslations({ locale: lang, namespace: 'tools.tokenSpeedVisualizer' })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
    const path = 'token-generation-speed-visualizer'

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
        other: {
            'application-name': 'AI Token Generation Speed Visualizer',
            'keywords': t('metadata.keywords')
        }
    }
}

export default function TokenGenerationSpeedVisualizer({
    params,
}: {
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)
    const currentPath = `/${language}/token-generation-speed-visualizer`

    return (
        <div className="min-h-screen flex flex-col">
            <LanguageSwitcher className="fixed top-4 right-4 z-50" />
            <SideNav currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    <PageContent />
                    
                    <TokenSpeedDemo initialLanguage={language} />

                    <SpeedGuideSection />
                </div>
                <Footer />
            </main>
        </div>
    )
}

function PageContent() {
    const t = useTranslations('tools.tokenSpeedVisualizer')
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

function SpeedGuideSection() {
    const locale = useLocale()
    const t = useTranslations('common.ui')
    
    return (
        <section className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">
                {t('whySpeedMatters')}
            </h2>
            <div className="text-sm text-muted-foreground space-y-3">
                <p>{t('speedGuideContent.intro')}</p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-2">{t('speedGuideContent.speedBenchmarks.title')}</h3>
                        <ul className="text-blue-800 text-xs space-y-1">
                            <li>• {t('speedGuideContent.speedBenchmarks.chatgpt')}</li>
                            <li>• {t('speedGuideContent.speedBenchmarks.claude')}</li>
                            <li>• {t('speedGuideContent.speedBenchmarks.local')}</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-medium text-green-900 mb-2">{t('speedGuideContent.optimizationTips.title')}</h3>
                        <ul className="text-green-800 text-xs space-y-1">
                            <li>• {t('speedGuideContent.optimizationTips.streaming')}</li>
                            <li>• {t('speedGuideContent.optimizationTips.progress')}</li>
                            <li>• {t('speedGuideContent.optimizationTips.optimize')}</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                        <strong>{t('speedGuideContent.useTool.title')}</strong> {t('speedGuideContent.useTool.description')}
                    </p>
                </div>
            </div>
        </section>
    )
} 