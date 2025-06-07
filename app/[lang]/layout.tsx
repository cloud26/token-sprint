import { ReactNode } from "react"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default async function Layout({
    children,
    params,
}: {
    children: ReactNode
    params: Promise<{ lang: string }>
}) {
    // 确保传入的 locale 是有效的
    const { lang } = await params
    if (!routing.locales.includes(lang as any)) {
        notFound()
    }
    
    const messages = await getMessages()
    
    return (
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
    )
}

// 定义支持的语言
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ lang: locale }))
} 