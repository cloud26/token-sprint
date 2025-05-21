import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import { ReferralTracker } from '@/components/referral-tracker'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Tools Collection | linpp2009.com',
  description: 'A collection of useful AI-related tools, including token generation speed visualization and LLM GPU memory calculator.',
  generator: 'linpp2009.com',
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
      </head>
      <body>
        <ReferralTracker />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
