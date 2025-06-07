import { Suspense } from "react"
import { Metadata } from "next"
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { SideNav } from "@/components/side-nav"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { GPUSelectionGuide } from "@/components/gpu-selection-guide"
import { Breadcrumb } from "@/components/breadcrumb"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params
    const t = await getTranslations({ locale: lang })
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')

    return {
        title: t('home.metadata.title'),
        description: t('home.metadata.description'), 
        alternates: {
            canonical: lang === 'en' ? baseUrl : `${baseUrl}/${lang}`,
            languages: {
                'en': `${baseUrl}/en`,
                'zh': `${baseUrl}/zh`,
                'x-default': `${baseUrl}/en`,
            },
        },
        openGraph: {
            title: t('home.metadata.title'),
            description: t('home.metadata.description'),
            url: `${baseUrl}/${lang}`,
            siteName: 'AI Tools Collection',
            locale: lang === 'en' ? 'en_US' : 'zh_CN',
            type: 'website',
        },
    }
}

export default function Home({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const t = useTranslations()
    
    return (
        <div className="min-h-screen flex flex-col">
            <LanguageSwitcher className="fixed top-4 right-4 z-50" />
            <SideNav />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    {/* 面包屑导航 */}
                    <Breadcrumb items={[{ label: t('nav.aiTools'), current: true }]} />
                    
                    <div className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {t('tools.llmGpuCalculator.title')}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {t('tools.llmGpuCalculator.description')}
                        </p>
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <LLMMemoryCalculator />
                    </Suspense>
                    
                    {/* GPU Selection Guide */}
                    <div className="mt-8">
                        <GPUSelectionGuide />
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    )
} 