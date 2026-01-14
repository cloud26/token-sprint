import { ReactNode } from "react"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getHtmlLangForLanguage, type Language } from '@/config/languages'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'
import { ReferralTracker } from '@/components/referral-tracker'
import { SidebarAds } from '@/components/sidebar-ads'
import { Toaster } from '@/components/ui/toaster'

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
    const htmlLang = getHtmlLangForLanguage(lang as Language)

    return (
        <html lang={htmlLang}>
            <head>
                <meta name="google-adsense-account" content="ca-pub-8472112646404075" />
                {/* Google AdSense */}
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8472112646404075"
                    crossOrigin="anonymous"
                />
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-4Z7YE2WSXQ"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-4Z7YE2WSXQ');
                    `}
                </Script>
                <Script
                    id="structured-data"
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "LLM Tools Collection",
                            "url": process.env.NEXT_PUBLIC_BASE_URL || "https://app.linpp2009.com",
                            "description": "A collection of useful AI-related tools, including token generation speed visualization and LLM GPU memory calculator.",
                            "applicationCategory": "DeveloperApplication",
                            "operatingSystem": "Web Browser",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "LLM Tools Collection"
                            }
                        })
                    }}
                />
            </head>
            <body>
                <ReferralTracker />
                <SidebarAds />
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <Toaster />
                </NextIntlClientProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}

// 定义支持的语言
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ lang: locale }))
}
