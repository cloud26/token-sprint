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

    // Token Counter 的热门模型（按使用频率排序）
    const popularTokenCounterModels = [
        // OpenAI 最受欢迎
        'gpt-4o',
        'gpt-4',
        'gpt-4-turbo',
        'gpt-3.5-turbo',
        
        // Claude 系列（最新最热门）
        'claude-4-opus',        // 最强的Claude 4
        'claude-4-sonnet',      // 最新的Claude 4 Sonnet
        'claude-3.7-sonnet',    // 新增的3.7版本
        'claude-3.5-sonnet',    // 非常流行的3.5版本
        'claude-3.5-haiku',     // 轻量级但流行
        'claude-3-opus',
        'claude-3-sonnet',
        'claude-3-haiku',
        
        // Google Gemini
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-pro',
        
        // Meta Llama
        'llama-3.1-405b',
        'llama-3.1-70b',
        'llama-3.1-8b',
        'llama-2-70b',
        'llama-2-13b',
        'llama-2-7b',
        
        // DeepSeek
        'deepseek-r1',
        'deepseek-chat',
        'deepseek-v3'
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
        priority: 1.0, // 最高优先级，作为canonical首页
    }

    // LLM GPU 计算器的专门模型页面 - 高SEO优先级
    const gpuCalculatorPages = getAllModelSlugs().flatMap(modelSlug =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}/llm-gpu-memory-calculator/${modelSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9, // 高优先级，专门为SEO长尾关键词设计
        }))
    )

    // Token Counter 的AI公司页面 - 高SEO优先级
    const tokenCounterPages = getAllTokenCounterModelSlugs().flatMap(companySlug =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}/token-counter-visualizer/${companySlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9, // 高优先级，专门为SEO公司关键词设计
        }))
    )

    return [canonicalHome, ...baseUrls, ...gpuCalculatorPages, ...tokenCounterPages]
} 