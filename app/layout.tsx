import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Tools Collection | linpp2009.com',
  description: 'A collection of useful AI-related tools, including token generation speed visualization and LLM GPU memory calculator.',
  generator: 'linpp2009.com',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
