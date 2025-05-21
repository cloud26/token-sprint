"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { common, type Language } from "@/config/languages"

interface BackToHomeProps {
    language: Language
}

export function BackToHome({ language }: BackToHomeProps) {
    return (
        <Link
            href={`/${language}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft className="h-4 w-4" />
            {common.backToHome[language]}
        </Link>
    )
} 