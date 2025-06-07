"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { TOOL_PATHS } from '@/lib/i18n-utils'

interface SideNavProps {
    currentPath?: string
}

export function SideNav({ currentPath }: SideNavProps) {
    const locale = useLocale()
    const pathname = usePathname()
    const t = useTranslations()
    
    const toolsList = [
        { key: 'llmGpuCalculator', path: TOOL_PATHS.llmGpuCalculator },
        { key: 'tokenSpeedVisualizer', path: TOOL_PATHS.tokenSpeedVisualizer },
        { key: 'tokenCounter', path: TOOL_PATHS.tokenCounter },
    ]

    // SEO优化的主页链接文本
    const homeTitle = t('nav.homePage')
    const homeAriaLabel = t('nav.goToHomePage')

    return (
        <>
            {/* 移动端顶部导航 */}
            <nav className="md:hidden bg-background border-b p-3 fixed top-0 left-0 right-0 z-50">
                <div className="flex flex-col space-y-2">
                    <Link 
                        href={`/${locale}`}
                        className="text-lg font-semibold hover:text-primary transition-colors"
                        title={homeTitle}
                        aria-label={homeAriaLabel}
                    >
                        {t('home.title')}
                    </Link>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {toolsList.map((tool) => {
                            const path = `/${locale}/${tool.path}`
                            const isActive = currentPath === path

                            return (
                                <Link
                                    key={tool.path}
                                    href={path}
                                    title={t(`tools.${tool.key}.description`)}
                                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {t(`tools.${tool.key}.title`)}
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
                            href={`/${locale}`}
                            className="text-lg font-semibold mb-2 block hover:text-primary transition-colors"
                            title={homeTitle}
                            aria-label={homeAriaLabel}
                        >
                            {t('home.title')}
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t('home.description')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        {toolsList.map((tool) => {
                            const path = `/${locale}/${tool.path}`
                            const isActive = currentPath === path

                            return (
                                <Link
                                    key={tool.path}
                                    href={path}
                                    title={t(`tools.${tool.key}.description`)}
                                    className={`group flex items-start p-2.5 rounded-lg border ${isActive
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-card hover:bg-card/80"
                                        } text-card-foreground transition-all`}
                                >
                                    <div className="space-y-1 flex-1">
                                        <div className="text-sm font-medium">{t(`tools.${tool.key}.title`)}</div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{t(`tools.${tool.key}.description`)}</p>
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