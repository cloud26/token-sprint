export interface ModelConfig {
    slug: string
    name: string
    parameters: number // 以B为单位
    recommendedPrecision: string
}

export const models: Record<string, ModelConfig> = {
    llama: {
        slug: "llama",
        name: "Llama",
        parameters: 109, // Llama 4 Scout默认参数
        recommendedPrecision: "FP8"
    },
    deepseek: {
        slug: "deepseek",
        name: "DeepSeek",
        parameters: 671,
        recommendedPrecision: "FP8"
    },
    qwen: {
        slug: "qwen",
        name: "Qwen",
        parameters: 235,
        recommendedPrecision: "FP8"
    }
}

export function getModelBySlug(slug: string): ModelConfig | null {
    return models[slug] || null
}

export function getAllModelSlugs(): string[] {
    return Object.keys(models)
}

// Token Counter 模型配置 - 按AI公司分类用于SEO优化
export interface TokenCounterModel {
    slug: string
    name: string
    company: string
    defaultModel: string // 页面默认选择的具体模型
}

export const tokenCounterModels: TokenCounterModel[] = [
    {
        slug: 'openai-gpt',
        name: 'OpenAI GPT',
        company: 'OpenAI',
        defaultModel: 'gpt-4o'
    },
    {
        slug: 'anthropic-claude',
        name: 'Anthropic Claude',
        company: 'Anthropic',
        defaultModel: 'claude-3.5-sonnet'
    },
    {
        slug: 'google-gemini',
        name: 'Google Gemini',
        company: 'Google',
        defaultModel: 'gemini-1.5-pro'
    },
    {
        slug: 'meta-llama',
        name: 'Meta Llama',
        company: 'Meta',
        defaultModel: 'llama-3.3'
    },
    {
        slug: 'deepseek',
        name: 'DeepSeek',
        company: 'DeepSeek',
        defaultModel: 'deepseek-r1'
    },
    {
        slug: 'alibaba-qwen',
        name: 'Alibaba Qwen',
        company: 'Alibaba',
        defaultModel: 'qwen3-chat'
    }
]

export function getAllTokenCounterModelSlugs(): string[] {
    return tokenCounterModels.map(model => model.slug)
}

export function getTokenCounterModelBySlug(slug: string): TokenCounterModel | undefined {
    return tokenCounterModels.find(model => model.slug === slug)
}

export function getTokenCounterDefaultModel(companySlug: string): string {
    const model = getTokenCounterModelBySlug(companySlug)
    return model?.defaultModel || 'gpt-4o'
} 