import { use, Suspense } from "react"
import { tools, home, type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import LLMMemoryCalculator from "@/components/llm-memory-calculator"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { GPUSelectionGuide } from "@/components/gpu-selection-guide"
import { Breadcrumb } from "@/components/breadcrumb"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')

    return {
        title: home.metadata.title[lang],
        description: home.metadata.description[lang],
        alternates: {
            canonical: lang === 'en' ? baseUrl : `${baseUrl}/${lang}`,
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')

    // SEO结构化数据 - 网站导航和面包屑
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${baseUrl}/#website`,
                "url": `${baseUrl}/`,
                "name": language === 'en' ? "AI Tools Collection" : "AI工具集合",
                "description": home.metadata.description[language],
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/${language}/#page`,
                "url": `${baseUrl}/${language}`,
                "name": home.metadata.title[language],
                "isPartOf": {
                    "@id": `${baseUrl}/#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": language === 'en' ? "AI Development Tools" : "AI开发工具"
                },
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": tools.llmGpuCalculator.title[language],
                            "url": `${baseUrl}/${language}/${tools.llmGpuCalculator.path}`
                        },
                        {
                            "@type": "ListItem", 
                            "position": 2,
                            "name": tools.tokenCounter.title[language],
                            "url": `${baseUrl}/${language}/${tools.tokenCounter.path}`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3, 
                            "name": tools.tokenSpeedVisualizer.title[language],
                            "url": `${baseUrl}/${language}/${tools.tokenSpeedVisualizer.path}`
                        }
                    ]
                }
            }
        ]
    }

    // 面包屑导航项
    const breadcrumbItems = [
        {
            label: language === 'en' ? 'AI Tools' : 'AI工具',
            current: true
        }
    ]

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
            <SideNav language={language} currentPath={`/${language}`} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    {/* 面包屑导航 */}
                    <Breadcrumb items={breadcrumbItems} language={language} />
                    
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