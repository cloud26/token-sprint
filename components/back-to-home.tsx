"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'

export function BackToHome() {
    const locale = useLocale()
    const t = useTranslations('common')
    
    return (
        <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft className="h-4 w-4" />
            {t('backToHome')}
        </Link>
    )
} 