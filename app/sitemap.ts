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

    // 添加模型特定的URL - 按流行度排序
    const popularModels = [
        'gpt-4o',
        'claude-4-sonnet',      // 最新的Claude 4 Sonnet
        'claude-4-opus',        // 最强的Claude 4 Opus
        'claude-3.5-sonnet',    // 流行的3.5版本
        'gemini-1.5-pro',
        'llama-3.1-70b',
        'deepseek-chat',
        'deepseek-r1',
        'claude-3.7-sonnet',    // 新增的3.7版本
        'gpt-4',
        'gemini-1.5-flash'
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

    // 添加模型特定的GPU calculator URLs - 使用不同的URL格式
    const gpuCalculatorModels = [
        // 最新Qwen3系列
        'qwen3-235b-a22b',
        'qwen3-30b-a3b',
        'qwen3-32b',
        'qwen3-14b',
        'qwen3-8b',
        'qwen3-4b',
        // 热门模型
        'deepseek-r1',
        'deepseek-v3',
        'llama-3.1-70b',
        'llama-3.1-405b',
        'llama-3.1-8b',
        'qwen-72b',
        'qwen-7b',
        'llama-7b'
    ]

    const gpuCalculatorUrls = gpuCalculatorModels.flatMap(model =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}/llm-gpu-memory-calculator?model=${model}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
    )

    return [...baseUrls, ...modelSpecificUrls, ...gpuCalculatorUrls]
} 