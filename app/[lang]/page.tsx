import { use, Suspense } from "react"
import { tools, home, type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { GPUSelectionGuide } from "@/components/gpu-selection-guide"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')

    return {
        title: home.metadata.title[lang],
        description: home.metadata.description[lang],
        alternates: {
            canonical: `${baseUrl}/${lang}`,
            languages: {
                'en': `${baseUrl}/en`,
                'zh': `${baseUrl}/zh`,
                'x-default': `${baseUrl}/en`,
            },
        },
        openGraph: {
            title: home.metadata.title[lang],
            description: home.metadata.description[lang],
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
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)

    return (
        <div className="min-h-screen flex flex-col">
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={`/${language}/${tools.llmGpuCalculator.path}`} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    <div className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.llmGpuCalculator.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.llmGpuCalculator.description[language]}
                        </p>
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <LLMMemoryCalculator language={language} />
                    </Suspense>
                    
                    {/* GPU Selection Guide */}
                    <div className="mt-8">
                        <GPUSelectionGuide language={language} />
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    )
} 