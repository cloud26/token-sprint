import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.linpp2009.com')
        
    const languages = ['en', 'zh']
    const routes = [
        '',
        '/token-generation-speed-visualizer',
        '/llm-gpu-memory-calculator',
    ]

    return routes.flatMap(route => 
        languages.map(lang => ({
            url: `${baseUrl}/${lang}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    )
} 