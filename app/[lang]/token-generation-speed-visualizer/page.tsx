import TokenSpeedDemo from "@/components/token-speed-demo"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { use } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.linpp2009.com')
    const path = 'token-generation-speed-visualizer'
    
    return {
        title: tools.tokenSpeedVisualizer.metadata.title[lang],
        description: tools.tokenSpeedVisualizer.metadata.description[lang],
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                'en': `${baseUrl}/en/${path}`,
                'zh': `${baseUrl}/zh/${path}`,
            },
        },
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
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={currentPath} />
            
            <main className="ml-64 flex-1 flex flex-col items-center p-4 pt-2 md:p-8 md:pt-4">
                <div className="w-full max-w-3xl space-y-2 flex-1">
                    <div className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.tokenSpeedVisualizer.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.tokenSpeedVisualizer.description[language]}
                        </p>
                    </div>
                    <TokenSpeedDemo initialLanguage={language} />
                </div>
                <Footer />
            </main>
        </div>
    )
} 