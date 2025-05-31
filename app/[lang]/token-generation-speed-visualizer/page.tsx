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
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
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
        other: {
            'application-name': 'AI Token Generation Speed Visualizer',
            'keywords': lang === 'en' ?
                'ai token speed, ai generation speed, token generation, ai response time, ai performance' :
                'AI token生成速度, AI生成速度, token生成模拟器, AI响应时间, AI性能测试'
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
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={currentPath} />

            <main className="pt-20 md:pt-4 md:ml-48 flex-1 flex flex-col items-center p-4 md:p-8">
                <div className="w-full max-w-2xl space-y-2 flex-1">
                    <header className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.tokenSpeedVisualizer.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.tokenSpeedVisualizer.description[language]}
                        </p>
                    </header>

                    <TokenSpeedDemo initialLanguage={language} />

                    {/* AI性能优化指南 - 精简版业务价值内容 */}
                    <section className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {language === 'en' ? 'Why Token Generation Speed Matters' : '为什么Token生成速度很重要'}
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-3">
                            {language === 'en' ? (
                                <>
                                    <p>Token generation speed directly impacts user experience in AI applications. Research shows delays over 3 seconds significantly increase user abandonment rates.</p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-medium text-blue-900 mb-2">📊 Speed Benchmarks</h3>
                                            <ul className="text-blue-800 text-xs space-y-1">
                                                <li>• ChatGPT-4: ~20-40 tokens/sec</li>
                                                <li>• Claude 3.5: ~25-50 tokens/sec</li>
                                                <li>• Local models: 5-200+ tokens/sec</li>
                                            </ul>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h3 className="font-medium text-green-900 mb-2">⚡ Optimization Tips</h3>
                                            <ul className="text-green-800 text-xs space-y-1">
                                                <li>• Use streaming for perceived speed</li>
                                                <li>• Show progress indicators</li>
                                                <li>• Optimize for your use case</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600">
                                            <strong>Use this tool to:</strong> Test optimal speeds for chatbots (15-30 tokens/sec), content tools (40+ tokens/sec), or educational platforms (5-15 tokens/sec). Find the sweet spot between performance and user experience.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>Token生成速度直接影响AI应用的用户体验。研究表明，超过3秒的延迟会显著增加用户流失率。</p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-medium text-blue-900 mb-2">📊 速度基准</h3>
                                            <ul className="text-blue-800 text-xs space-y-1">
                                                <li>• ChatGPT-4: ~20-40 tokens/秒</li>
                                                <li>• Claude 3.5: ~25-50 tokens/秒</li>
                                                <li>• 本地模型: 5-200+ tokens/秒</li>
                                            </ul>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h3 className="font-medium text-green-900 mb-2">⚡ 优化建议</h3>
                                            <ul className="text-green-800 text-xs space-y-1">
                                                <li>• 使用流式响应提升感知速度</li>
                                                <li>• 显示进度指示器</li>
                                                <li>• 针对用例优化速度</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600">
                                            <strong>使用此工具:</strong> 测试聊天机器人（15-30 tokens/秒）、内容工具（40+ tokens/秒）或教育平台（5-15 tokens/秒）的最佳速度。找到性能与用户体验之间的最佳平衡点。
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                </div>
                <Footer />
            </main>
        </div>
    )
} 