"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { common, type Language } from "@/config/languages"

interface LanguageSwitcherProps {
    language: Language
}

export default function LanguageSwitcher({ language }: LanguageSwitcherProps) {
    const router = useRouter()

    const handleLanguageChange = (value: string) => {
        router.push(`/${value}${window.location.pathname.substring(3)}`)
    }

    return (
        <Tabs value={language} onValueChange={handleLanguageChange} className="mb-1">
            <TabsList className="grid w-32 grid-cols-2">
                <TabsTrigger value="zh">{common.languageLabels.zh}</TabsTrigger>
                <TabsTrigger value="en">{common.languageLabels.en}</TabsTrigger>
            </TabsList>
        </Tabs>
    )
} 