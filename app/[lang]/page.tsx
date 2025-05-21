import Link from "next/link"
import { ArrowRight } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import { use } from "react"
import { tools, home, type Language } from "@/config/languages"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    return {
        title: home.metadata.title[lang],
        description: home.metadata.description[lang],
    }
}

export default function Home({
    params,
}: {
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)

    const toolsList = [
        tools.tokenSpeedVisualizer,
        tools.llmGpuCalculator,
    ]

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-2 md:p-8 md:pt-4">
            <div className="w-full max-w-3xl space-y-8">
                <div className="flex flex-col items-center gap-1 mt-16">
                    <LanguageSwitcher language={language} />
                    <h1 className="text-3xl font-bold text-center">
                        {home.title[language]}
                    </h1>
                    <p className="text-center text-muted-foreground text-sm">
                        {home.description[language]}
                    </p>
                </div>

                <div className="grid gap-4">
                    {toolsList.map((tool) => (
                        <Link
                            key={tool.path}
                            href={`/${language}/${tool.path}`}
                            className="group flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="space-y-1">
                                <h2 className="text-xl font-semibold">{tool.title[language]}</h2>
                                <p className="text-sm text-muted-foreground">{tool.description[language]}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
} 