"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { common, type Language } from "@/config/languages"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
    language: Language
}

export default function LanguageSwitcher({ language }: LanguageSwitcherProps) {
    const router = useRouter()

    const handleLanguageChange = (value: string) => {
        router.push(`/${value}${window.location.pathname.substring(3)}`)
    }

    return (
        <div className="absolute top-4 right-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-24 justify-start gap-2">
                        <Globe className="h-4 w-4" />
                        {common.languageLabels[language]}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {(Object.keys(common.languageLabels) as Language[]).map((lang) => (
                        <DropdownMenuItem
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className="justify-between"
                        >
                            {common.languageLabels[lang]}
                            {lang === language && (
                                <Check className="h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
} 