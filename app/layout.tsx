import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'
import { ReferralTracker } from '@/components/referral-tracker'
import { SidebarAds } from '@/components/sidebar-ads'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Tools Collection | linpp2009.com',
  description: 'A collection of useful AI-related tools, including token generation speed visualization and LLM GPU memory calculator.',
  generator: 'linpp2009.com',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://app.linpp2009.com'),
  alternates: {
    canonical: '/',
  },
  other: {
    'google-adsense-account': 'ca-pub-8472112646404075',
  },
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
