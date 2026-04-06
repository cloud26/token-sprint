import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use, Suspense } from "react"
import { type Language, getCanonicalUrl, generateLanguageAlternates } from "@/config/languages"
import { Metadata } from "next"
import dynamic from 'next/dynamic'

const LLMMemoryCalculator = dynamic(() => import("@/components/llm-memory-calculator"), {
    loading: () => (
        <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-10 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
        </div>
    ),
})
import { SideNav } from "@/components/side-nav"
import { GPUSelectionGuide } from "@/components/gpu-selection-guide"
import { Breadcrumb } from "@/components/breadcrumb"
import { UpdateNotification } from "@/components/update-notification"
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const t = await getTranslations({ locale: lang, namespace: 'tools.llmGpuCalculator' })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
    const path = 'llm-gpu-memory-calculator'

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        keywords: t('metadata.keywords'),
        alternates: {
            canonical: getCanonicalUrl(baseUrl, lang, path),
            languages: generateLanguageAlternates(baseUrl, path),
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
            <LanguageSwitcher className="fixed top-4 right-4 z-50" />
            <SideNav currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    {/* 更新通知 */}
                    <UpdateNotification />

                    <PageContent />

                    <Suspense fallback={<div>Loading...</div>}>
                        <LLMMemoryCalculator />
                    </Suspense>

                    {/* GPU Selection Guide */}
                    {/* <div className="mt-8">
                        <GPUSelectionGuide />
                    </div> */}
                </div>
                <Footer />
            </main>
        </div>
    )
}

function PageContent() {
    const t = useTranslations('tools.llmGpuCalculator')
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
