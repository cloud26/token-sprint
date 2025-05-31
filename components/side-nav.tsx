import Link from "next/link"
import { Menu } from "lucide-react"
import { tools, home, type Language } from "@/config/languages"

interface SideNavProps {
    language: Language
    currentPath?: string
}

export function SideNav({ language, currentPath }: SideNavProps) {
    const toolsList = [
        tools.llmGpuCalculator,
        tools.tokenSpeedVisualizer,
        tools.tokenCounter,
    ]

    // SEO优化的主页链接文本
    const homeTitle = language === 'en' ? 'AI Tools Homepage' : 'AI工具主页'
    const homeAriaLabel = language === 'en' ? 'Go to AI Tools Homepage' : '返回AI工具主页'

    return (
        <>
            {/* 移动端顶部导航 */}
            <nav className="md:hidden bg-background border-b p-3 fixed top-0 left-0 right-0 z-50">
                <div className="flex flex-col space-y-2">
                    <Link 
                        href={`/${language}`}
                        className="text-lg font-semibold hover:text-primary transition-colors"
                        title={homeTitle}
                        aria-label={homeAriaLabel}
                    >
                        {home.title[language]}
                    </Link>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {toolsList.map((tool) => {
                            const path = `/${language}/${tool.path}`
                            const isActive = currentPath === path

                            return (
                                <Link
                                    key={tool.path}
                                    href={path}
                                    title={tool.description[language]}
                                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {tool.title[language]}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* 桌面端侧边导航 */}
            <nav className="hidden md:block w-48 h-[calc(100vh-2rem)] border-r p-3 fixed left-0 top-4 overflow-y-auto bg-background">
                <div className="space-y-6">
                    <div>
                        <Link 
                            href={`/${language}`}
                            className="text-lg font-semibold mb-2 block hover:text-primary transition-colors"
                            title={homeTitle}
                            aria-label={homeAriaLabel}
                        >
                            {home.title[language]}
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            {home.description[language]}
                        </p>
                    </div>

                    <div className="space-y-2">
                        {toolsList.map((tool) => {
                            const path = `/${language}/${tool.path}`
                            const isActive = currentPath === path

                            return (
                                <Link
                                    key={tool.path}
                                    href={path}
                                    title={tool.description[language]}
                                    className={`group flex items-start p-2.5 rounded-lg border ${isActive
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-card hover:bg-card/80"
                                        } text-card-foreground transition-all`}
                                >
                                    <div className="space-y-1 flex-1">
                                        <div className="text-sm font-medium">{tool.title[language]}</div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description[language]}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>
        </>
    )
} 