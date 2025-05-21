"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BackToHomeProps {
    language: "en" | "zh"
}

export function BackToHome({ language }: BackToHomeProps) {
    return (
        <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft className="h-4 w-4" />
            {language === "zh" ? "返回主页" : "Back to Home"}
        </Link>
    )
} 