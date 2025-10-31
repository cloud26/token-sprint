import type { Metadata } from 'next'
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
  return children
}
