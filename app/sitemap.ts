import { MetadataRoute } from 'next'
import { getAllModelSlugs, getAllTokenCounterModelSlugs } from '@/config/models'

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

    // 基础路由页面 - 只包含语言版本，不包含根路径以避免重复
    const baseUrls = routes.flatMap(route =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 0.9 : 0.8, // 降低首页优先级，因为它不是canonical
        }))
    )

    // 添加根路径作为canonical首页
    const canonicalHome = {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0, // 最高优先级给canonical首页
    }

    // GPU Calculator 页面
    const gpuCalculatorUrls = getAllModelSlugs().flatMap(modelSlug =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}/llm-gpu-memory-calculator/${modelSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
    )

    // Token Counter 页面
    const tokenCounterUrls = getAllTokenCounterModelSlugs().flatMap(modelSlug =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}/token-counter-visualizer/${modelSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
    )

    return [
        canonicalHome,
        ...baseUrls,
        ...gpuCalculatorUrls,
        ...tokenCounterUrls,
    ]
} 