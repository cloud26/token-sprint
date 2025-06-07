"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LanguageSwitcherProps {
    className?: string
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const router = useRouter()
    const pathname = usePathname()
    const currentLocale = useLocale()
    const t = useTranslations('common')

    const handleLanguageChange = (newLocale: string) => {
        // 将当前路径的语言部分替换为新语言
        const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
        router.push(newPath)
    }

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-24 justify-start gap-2">
                        <Globe className="h-4 w-4" />
                        {t(`languageLabels.${currentLocale}`)}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                        {t('languageLabels.en')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>
                        {t('languageLabels.zh')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
} 