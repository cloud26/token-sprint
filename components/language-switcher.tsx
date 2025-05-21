"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LanguageSwitcherProps {
    language: "en" | "zh"
}

export default function LanguageSwitcher({ language }: LanguageSwitcherProps) {
    const router = useRouter()

    const handleLanguageChange = (value: string) => {
        router.push(`/${value}${window.location.pathname.substring(3)}`)
    }

    return (
        <Tabs value={language} onValueChange={handleLanguageChange} className="mb-1">
            <TabsList className="grid w-32 grid-cols-2">
                <TabsTrigger value="zh">中文</TabsTrigger>
                <TabsTrigger value="en">EN</TabsTrigger>
            </TabsList>
        </Tabs>
    )
} 