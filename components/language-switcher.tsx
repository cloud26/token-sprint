"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { common, type Language } from "@/config/languages"
import { Globe } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
    language: Language
    className?: string
}

export default function LanguageSwitcher({ language, className }: LanguageSwitcherProps) {
    const router = useRouter()

    const handleLanguageChange = (value: string) => {
        router.push(`/${value}${window.location.pathname.substring(3)}`)
    }

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-24 justify-start gap-2">
                        <Globe className="h-4 w-4" />
                        {common.languageLabels[language]}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                        {common.languageLabels.en}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>
                        {common.languageLabels.zh}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
} 