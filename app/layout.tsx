import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'
import { ReferralTracker } from '@/components/referral-tracker'
import { SidebarAds } from '@/components/sidebar-ads'
import './globals.css'

export const metadata: Metadata = {
  title: 'LLM Tools Collection',
  description: 'A collection of useful LLM-related tools, including token generation speed visualization and LLM GPU memory calculator.',
  generator: 'LLM Tools Collection',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://app.linpp2009.com'),
  alternates: {
    canonical: '/en',
    languages: {
      'en': '/en',
      'zh': '/zh',
      'x-default': '/en',
    },
  },
  icons: {
    icon: [
      { url: `/favicon.svg?v=${Date.now()}`, type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: `/favicon.svg?v=${Date.now()}`, sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  other: {
    'google-adsense-account': 'ca-pub-8472112646404075',
    'yandex-verification': '5220b08fa4e50648',
  },
  applicationName: 'LLM Tools Collection',
  publisher: 'LLM Tools Collection',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
