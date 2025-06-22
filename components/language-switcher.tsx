"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLocale } from 'next-intl'
import { LANGUAGE_CONFIG, type Language } from '@/config/languages'
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
    const currentLocale = useLocale() as Language

    const handleLanguageChange = (newLocale: Language) => {
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
                        {LANGUAGE_CONFIG.LANGUAGE_LABELS[currentLocale]}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {LANGUAGE_CONFIG.SUPPORTED_LANGUAGES.map((lang) => (
                        <DropdownMenuItem key={lang} onClick={() => handleLanguageChange(lang)}>
                            {LANGUAGE_CONFIG.LANGUAGE_LABELS[lang]}
                    </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
} 