import { Language } from "./languages"

export interface ModelConfig {
    slug: string
    name: string
    parameters: number // 以B为单位
    recommendedPrecision: string
    seoTitle: {
        zh: string
        en: string
    }
    seoDescription: {
        zh: string
        en: string
    }
    specialFeatures: {
        zh: string[]
        en: string[]
    }
}

export const models: Record<string, ModelConfig> = {
    llama: {
        slug: "llama",
        name: "Llama",
        parameters: 109, // Llama 4 Scout默认参数
        recommendedPrecision: "FP8",
        seoTitle: {
            zh: "Llama推理GPU需求计算器 | Llama 3/4 显存需求配置",
            en: "Llama Inference GPU Requirement Calculator | Llama 3/4 VRAM Requirements"
        },
        seoDescription: {
            zh: "计算Llama 3.1(405B/70B/8B)和Llama 4推理部署所需显存和GPU数量。支持NVIDIA、AMD、苹果、华为等各厂商显卡，专业MoE架构部署方案。",
            en: "Calculate VRAM and GPU count for Llama 3.1 (405B/70B/8B) and Llama 4 inference deployment. Support for NVIDIA, AMD, Apple, and Huawei GPUs with MoE architecture."
        },
        specialFeatures: {
            zh: [
                "支持Llama 3.1全系列",
                "最新Llama 4系列",
                "MoE混合专家架构",
                "多模态AI能力"
            ],
            en: [
                "Llama 3.1 full series support",
                "Latest Llama 4 series",
                "Mixture-of-Experts (MoE) architecture",
                "Multimodal AI capabilities"
            ]
        }
    },
    deepseek: {
        slug: "deepseek",
        name: "DeepSeek",
        parameters: 671,
        recommendedPrecision: "FP8",
        seoTitle: {
            zh: "DeepSeek推理GPU需求计算器 | DeepSeek V3/R1 显存需求配置",
            en: "DeepSeek Inference GPU Requirement Calculator | DeepSeek V3/R1 VRAM Requirements"
        },
        seoDescription: {
            zh: "计算DeepSeek V3/R1 (671B)推理部署所需显存和GPU数量。支持NVIDIA、AMD、苹果、华为等各厂商显卡，超大模型专业部署方案。",
            en: "Calculate VRAM and GPU count for DeepSeek V3/R1 (671B) inference deployment. Support for NVIDIA, AMD, Apple, and Huawei GPUs with enterprise-grade solutions."
        },
        specialFeatures: {
            zh: [
                "671B超大参数规模",
                "业界领先的推理能力",
                "支持FP8精度优化",
                "适合企业级部署"
            ],
            en: [
                "Massive 671B parameter scale",
                "Industry-leading reasoning capabilities",
                "Supports FP8 precision optimization",
                "Suitable for enterprise deployment"
            ]
        }
    },
    qwen: {
        slug: "qwen",
        name: "Qwen",
        parameters: 235,
        recommendedPrecision: "FP8",
        seoTitle: {
            zh: "Qwen推理GPU需求计算器 | Qwen3 显存需求配置",
            en: "Qwen Inference GPU Requirement Calculator | Qwen3 VRAM Requirements"
        },
        seoDescription: {
            zh: "计算Qwen3-235B-A22B MoE模型推理部署所需显存和GPU数量。支持NVIDIA、AMD、苹果、华为等各厂商显卡，高效MoE架构部署方案。",
            en: "Calculate VRAM and GPU count for Qwen3-235B-A22B MoE inference deployment. Support for NVIDIA, AMD, Apple, and Huawei GPUs with efficient MoE architecture."
        },
        specialFeatures: {
            zh: [
                "混合专家(MoE)架构",
                "235B总参数，22B激活",
                "显存效率极高",
                "多语言支持优秀"
            ],
            en: [
                "Mixture-of-Experts (MoE) architecture",
                "235B total, 22B active parameters",
                "Extremely memory efficient",
                "Excellent multilingual support"
            ]
        }
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
    description: {
        en: string
        zh: string
    }
    seoTitle: {
        en: string
        zh: string
    }
    seoDescription: {
        en: string
        zh: string
    }
    representativeModels: {
        en: string[]
        zh: string[]
    }
    defaultModel: string // 页面默认选择的具体模型
}

export const tokenCounterModels: TokenCounterModel[] = [
    {
        slug: 'openai-gpt',
        name: 'OpenAI GPT',
        company: 'OpenAI',
        description: {
            en: 'OpenAI token counter with native tokenizer for GPT models. The most accurate OpenAI token counting tool.',
            zh: 'OpenAI token计数器，采用原生tokenizer支持GPT模型。最精确的OpenAI token计数工具。'
        },
        seoTitle: {
            en: 'OpenAI Token Counter: GPT-4o, GPT-4, GPT-3.5 Calculator & Tokenizer',
            zh: 'OpenAI Token计数器：GPT-4o、GPT-4、GPT-3.5计算器和分词器'
        },
        seoDescription: {
            en: 'OpenAI token counter & tokenizer for GPT-4o, GPT-4, GPT-3.5. Native js-tiktoken accuracy, real-time cost calculation.',
            zh: 'OpenAI token计数器和分词器，支持GPT-4o、GPT-4、GPT-3.5。原生js-tiktoken精度，实时成本计算。'
        },
        representativeModels: {
            en: ['GPT-4o', 'GPT-4', 'GPT-4 Turbo', 'GPT-3.5 Turbo'],
            zh: ['GPT-4o', 'GPT-4', 'GPT-4 Turbo', 'GPT-3.5 Turbo']
        },
        defaultModel: 'gpt-4o'
    },
    {
        slug: 'anthropic-claude',
        name: 'Anthropic Claude',
        company: 'Anthropic',
        description: {
            en: 'Anthropic Claude token counter and tokenizer tool. Approximate token counting for Claude models using advanced estimation.',
            zh: 'Anthropic Claude token计数器和tokenizer工具。使用先进估算算法为Claude模型提供近似token计数。'
        },
        seoTitle: {
            en: 'Claude Token Counter: Claude 4, Claude 3.5 Calculator & Tokenizer',
            zh: 'Claude Token计数器：Claude 4、Claude 3.5计算器和分词器'
        },
        seoDescription: {
            en: 'Claude token counter & tokenizer for Claude 4 Opus/Sonnet, Claude 3.5. Hugging Face tokenizer, long context support.',
            zh: 'Claude token计数器和分词器，支持Claude 4 Opus/Sonnet、Claude 3.5 Sonnet/Haiku。长上下文支持。'
        },
        representativeModels: {
            en: ['Claude 4 Opus', 'Claude 4 Sonnet', 'Claude 3.5 Sonnet', 'Claude 3.5 Haiku'],
            zh: ['Claude 4 Opus', 'Claude 4 Sonnet', 'Claude 3.5 Sonnet', 'Claude 3.5 Haiku']
        },
        defaultModel: 'claude-3.5-sonnet'
    },
    {
        slug: 'google-gemini',
        name: 'Google Gemini',
        company: 'Google',
        description: {
            en: 'Google Gemini token counter and tokenizer tool. Approximate token counting for Gemini models using advanced estimation.',
            zh: 'Google Gemini token计数器和tokenizer工具。使用先进估算算法为Gemini模型提供近似token计数。'
        },
        seoTitle: {
            en: 'Gemini Token Counter: Gemini 1.5 Pro, Flash Calculator & Tokenizer',
            zh: 'Gemini Token计数器：Gemini 1.5 Pro、Flash计算器和分词器'
        },
        seoDescription: {
            en: 'Gemini token counter & tokenizer for Gemini 1.5 Pro, Flash.',
            zh: 'Gemini token计数器和分词器，支持Gemini 1.5 Pro、Flash。'
        },
        representativeModels: {
            en: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Gemini Pro'],
            zh: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Gemini Pro']
        },
        defaultModel: 'gemini-1.5-pro'
    },
    {
        slug: 'meta-llama',
        name: 'Meta Llama',
        company: 'Meta',
        description: {
            en: 'Meta Llama token counter and tokenizer tool. Approximate token counting for Llama models using advanced estimation.',
            zh: 'Meta Llama token计数器和tokenizer工具。使用先进估算算法为Llama模型提供近似token计数。'
        },
        seoTitle: {
            en: 'Llama Token Counter: Llama 4, Llama 3 Calculator & Tokenizer',
            zh: 'Llama Token计数器：Llama 4、Llama 3计算器和分词器'
        },
        seoDescription: {
            en: 'Llama token counter & tokenizer for Llama 4 Scout/Maverick, Llama 3.3, 3.1. Hugging Face tokenizer, open source models.',
            zh: 'Llama token计数器和分词器，支持Llama 4 Scout/Maverick、Llama 3.3、3.1。开源模型优化。'
        },
        representativeModels: {
            en: ['Llama 3.1 405B', 'Llama 3.1 70B', 'Llama 3.1 8B', 'Llama 2 70B'],
            zh: ['Llama 3.1 405B', 'Llama 3.1 70B', 'Llama 3.1 8B', 'Llama 2 70B']
        },
        defaultModel: 'llama-3.3'
    },
    {
        slug: 'deepseek',
        name: 'DeepSeek',
        company: 'DeepSeek',
        description: {
            en: 'DeepSeek token counter and tokenizer tool. Approximate token counting for DeepSeek models using advanced estimation.',
            zh: 'DeepSeek token计数器和tokenizer工具。使用先进估算算法为DeepSeek模型提供近似token计数。'
        },
        seoTitle: {
            en: 'DeepSeek Token Counter: R1, V3 Calculator & Tokenizer',
            zh: 'DeepSeek Token计数器：R1、V3计算器和分词器'
        },
        seoDescription: {
            en: 'DeepSeek token counter & tokenizer for R1 Reasoner, V3 Chat. Hugging Face tokenizer, cost estimation.',
            zh: 'DeepSeek token计数器和分词器，支持R1推理器、V3聊天。成本估算，token优化。'
        },
        representativeModels: {
            en: ['DeepSeek-R1', 'DeepSeek-V3 Chat'],
            zh: ['DeepSeek-R1', 'DeepSeek-V3 Chat']
        },
        defaultModel: 'deepseek-r1'
    },
    {
        slug: 'qwen',
        name: 'Qwen',
        company: 'Alibaba',
        description: {
            en: 'Qwen2/Qwen3 token counter and tokenizer tool. Approximate token counting for Qwen models using advanced estimation.',
            zh: 'Qwen2/Qwen3 token计数器和tokenizer工具。使用先进估算算法为Qwen模型提供近似token计数。'
        },
        seoTitle: {
            en: 'Qwen Token Counter: Qwen2, Qwen3 Calculator & Tokenizer',
            zh: 'Qwen Token计数器：Qwen2、Qwen3计算器和分词器'
        },
        seoDescription: {
            en: 'Qwen token counter & tokenizer for Qwen2, Qwen3 models. GPT-4 estimation, cost calculation, multilingual support.',
            zh: 'Qwen token计数器和分词器，支持Qwen2、Qwen3模型。成本计算，多语言支持。'
        },
        representativeModels: {
            en: ['Qwen3-235B-A22B', 'Qwen2.5', 'Qwen-Plus', 'Qwen-Turbo', 'Qwen-Max'],
            zh: ['Qwen3-235B-A22B', 'Qwen2.5', 'Qwen-Plus', 'Qwen-Turbo', 'Qwen-Max']
        },
        defaultModel: 'qwen3-235b'
    }
]

// 获取所有Token Counter模型的slug
export function getAllTokenCounterModelSlugs(): string[] {
    return tokenCounterModels.map(model => model.slug)
}

// 根据slug获取Token Counter模型
export function getTokenCounterModelBySlug(slug: string): TokenCounterModel | undefined {
    return tokenCounterModels.find(model => model.slug === slug)
}

// 根据公司slug获取默认模型值（用于token counter组件）
export function getTokenCounterDefaultModel(companySlug: string): string {
    const model = getTokenCounterModelBySlug(companySlug)
    return model ? model.defaultModel : 'gpt-4o'
} 