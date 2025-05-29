import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.linpp2009.com')
        
    const languages = ['en', 'zh']
    const routes = [
        '',
        '/token-counter-visualizer',
        '/token-generation-speed-visualizer',
        '/llm-gpu-memory-calculator',
    ]

    // 添加模型特定的URL
    const popularModels = [
        'gpt-4o',
        'claude-3.5-sonnet', 
        'gemini-1.5-pro',
        'llama-3.1-70b',
        'deepseek-chat'
    ]

    const baseUrls = routes.flatMap(route => 
        languages.map(lang => ({
            url: `${baseUrl}/${lang}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    )

    // 添加模型特定的token counter URLs
    const modelSpecificUrls = popularModels.flatMap(model =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}/token-counter-visualizer?model=${model}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
    )

    return [...baseUrls, ...modelSpecificUrls]
} 