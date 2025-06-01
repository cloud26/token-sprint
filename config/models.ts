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
    useCases: {
        zh: string[]
        en: string[]
    }
}

export const models: Record<string, ModelConfig> = {
    llama: {
        slug: "llama",
        name: "Llama 3.1",
        parameters: 70,
        recommendedPrecision: "FP16",
        seoTitle: {
            zh: "Llama本地部署GPU需求计算器 | Llama 70B/405B显卡配置",
            en: "Llama VRAM Calculator | GPU Requirements for 70B/405B"
        },
        seoDescription: {
            zh: "专业的Llama本地部署GPU计算器，精确计算Llama 3.1 70B/405B模型本地运行需要多少张显卡。支持NVIDIA H100/A100/RTX 4090、AMD、华为昇腾、Mac M系列，提供最优本地部署方案。",
            en: "Professional Llama VRAM calculator and GPU requirements tool. Calculate exact VRAM and GPU count for Llama 3.1 70B/405B models. NVIDIA H100/A100/RTX 4090."
        },
        specialFeatures: {
            zh: [
                "开源免费，完全本地部署",
                "支持商用，无使用限制",
                "模型性能优秀，推理速度快",
                "社区活跃，资源丰富"
            ],
            en: [
                "Open source and completely local deployment", 
                "Commercial use allowed, no restrictions",
                "Excellent performance with fast inference",
                "Active community with rich resources"
            ]
        },
        useCases: {
            zh: [
                "企业内部AI助手",
                "私有化聊天机器人",
                "本地代码生成",
                "离线文本分析"
            ],
            en: [
                "Enterprise AI assistant",
                "Private chatbot deployment", 
                "Local code generation",
                "Offline text analysis"
            ]
        }
    },
    deepseek: {
        slug: "deepseek",
        name: "DeepSeek-R1",
        parameters: 671,
        recommendedPrecision: "FP8",
        seoTitle: {
            zh: "DeepSeek R1本地部署GPU计算器 | 671B超大模型显卡需求",
            en: "DeepSeek R1 VRAM Calculator | 671B GPU Requirements"
        },
        seoDescription: {
            zh: "DeepSeek R1 (671B) 本地部署专用GPU计算器，精确计算超大规模模型运行需要的显卡数量。支持FP8优化部署，提供H100/A100集群配置方案，专业级推理部署规划。",
            en: "DeepSeek R1 VRAM calculator for 671B model. Calculate exact VRAM and GPU requirements with FP8 optimization. Professional H100/A100 cluster planning."
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
        },
        useCases: {
            zh: [
                "高级推理任务",
                "复杂问题求解",
                "企业级AI应用",
                "研究与开发"
            ],
            en: [
                "Advanced reasoning tasks",
                "Complex problem solving",
                "Enterprise AI applications", 
                "Research and development"
            ]
        }
    },
    qwen: {
        slug: "qwen",
        name: "Qwen3-235B-A22B",
        parameters: 235,
        recommendedPrecision: "FP8",
        seoTitle: {
            zh: "Qwen3本地部署GPU计算器 | 235B MoE模型显卡配置",
            en: "Qwen3 VRAM Calculator | 235B MoE GPU Requirements"
        },
        seoDescription: {
            zh: "Qwen3-235B-A22B MoE模型本地部署GPU计算器，计算混合专家模型的精确显卡需求。235B总参数，22B激活参数，高效节省显存，提供专业MoE架构部署方案。",
            en: "Qwen3 VRAM calculator for 235B MoE model. Calculate VRAM and GPU requirements for mixture-of-experts with 22B active parameters. Memory-efficient."
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
        },
        useCases: {
            zh: [
                "多语言AI应用",
                "高效推理部署",
                "资源受限环境",
                "成本优化方案"
            ],
            en: [
                "Multilingual AI applications",
                "Efficient inference deployment",
                "Resource-constrained environments",
                "Cost-optimized solutions"
            ]
        }
    },
    claude: {
        slug: "claude",
        name: "Claude 3.5 Sonnet",
        parameters: 200, // 估计值
        recommendedPrecision: "FP16",
        seoTitle: {
            zh: "Claude本地部署GPU计算器 | Claude 3.5模型显卡需求",
            en: "Claude VRAM Calculator | Claude 3.5 GPU Requirements"
        },
        seoDescription: {
            zh: "Claude 3.5 Sonnet本地部署GPU计算器，计算Anthropic Claude模型的显卡配置需求。支持长上下文处理，提供专业的本地化部署方案和硬件配置建议。",
            en: "Claude 3.5 VRAM calculator and GPU requirements tool. Calculate VRAM needs for Anthropic Claude model with long context. Professional deployment planning."
        },
        specialFeatures: {
            zh: [
                "超长上下文支持",
                "安全性极高",
                "推理质量优秀",
                "多模态能力"
            ],
            en: [
                "Ultra-long context support",
                "Extremely high safety standards",
                "Excellent reasoning quality",
                "Multimodal capabilities"
            ]
        },
        useCases: {
            zh: [
                "长文档分析",
                "安全敏感应用",
                "高质量内容生成",
                "复杂推理任务"
            ],
            en: [
                "Long document analysis",
                "Safety-sensitive applications",
                "High-quality content generation",
                "Complex reasoning tasks"
            ]
        }
    },
    gemini: {
        slug: "gemini",
        name: "Gemini 1.5 Pro",
        parameters: 175, // 估计值
        recommendedPrecision: "FP16",
        seoTitle: {
            zh: "Gemini本地部署GPU计算器 | Gemini 1.5 Pro显卡配置",
            en: "Gemini VRAM Calculator | Gemini 1.5 Pro GPU Requirements"
        },
        seoDescription: {
            zh: "Gemini 1.5 Pro本地部署GPU计算器，计算Google Gemini模型的本地运行显卡需求。支持多模态处理，提供专业的GPU配置方案和部署建议。",
            en: "Gemini 1.5 Pro VRAM calculator. Calculate VRAM and GPU requirements for Google Gemini model with multimodal processing. Professional GPU planning."
        },
        specialFeatures: {
            zh: [
                "强大的多模态能力",
                "Google技术支持",
                "优秀的代码理解",
                "高效的推理速度"
            ],
            en: [
                "Powerful multimodal capabilities",
                "Google technology backing",
                "Excellent code understanding",
                "Efficient inference speed"
            ]
        },
        useCases: {
            zh: [
                "多模态AI应用",
                "代码分析生成",
                "图像文本理解",
                "教育培训平台"
            ],
            en: [
                "Multimodal AI applications",
                "Code analysis and generation",
                "Image and text understanding",
                "Educational platforms"
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
    features: {
        en: string[]
        zh: string[]
    }
    useCases: {
        en: string[]
        zh: string[]
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
            en: 'OpenAI Token Counter: GPT-4o, GPT-4, GPT-3.5 Calculator',
            zh: 'OpenAI GPT Token计数器：GPT-4o、GPT-4、GPT-3.5计算工具'
        },
        seoDescription: {
            en: 'Professional OpenAI token counter for GPT-4o, GPT-4, GPT-3.5. Native tokenizer accuracy, real-time cost calculation, prompt optimization.',
            zh: '专业的OpenAI GPT token计数器，支持GPT-4o、GPT-4、GPT-4 Turbo、GPT-3.5 Turbo。最佳OpenAI token计数工具，原生分词器支持精确成本估算。'
        },
        features: {
            en: ['Native tokenizer accuracy', 'Real-time cost calculation', 'Multiple GPT model support', 'Prompt optimization'],
            zh: ['原生分词器精度', '实时成本计算', '多GPT模型支持', '提示词优化']
        },
        useCases: {
            en: ['API cost planning', 'Content generation', 'Chatbot development', 'Prompt engineering'],
            zh: ['API成本规划', '内容生成', '聊天机器人开发', '提示工程']
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
            en: 'Claude Token Counter: Claude 4, Claude 3.5 Calculator',
            zh: 'Anthropic Claude Token计数器：Claude 4、Claude 3.5、Claude 3计算工具'
        },
        seoDescription: {
            en: 'Accurate Claude token counter for Claude 4 Opus/Sonnet, Claude 3.5 Sonnet/Haiku. Long context support, safety analysis, cost estimation.',
            zh: '精确的Anthropic Claude token计数器，支持Claude 4 Opus/Sonnet、Claude 3.7、Claude 3.5 Sonnet/Haiku、Claude 3。长上下文支持，安全分析，成本估算。'
        },
        features: {
            en: ['Ultra-long context counting', 'Safety-focused analysis', 'Advanced reasoning support', 'Constitutional AI optimization'],
            zh: ['超长上下文计数', '安全性分析', '高级推理支持', '宪法AI优化']
        },
        useCases: {
            en: ['Document analysis', 'Research assistance', 'Content moderation', 'Long-form writing'],
            zh: ['文档分析', '研究辅助', '内容审核', '长文写作']
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
            en: 'Gemini Token Counter: Gemini 1.5 Pro, Flash Calculator',
            zh: 'Google Gemini Token计数器：Gemini 1.5 Pro、Flash计算工具'
        },
        seoDescription: {
            en: 'Professional Gemini token counter for Gemini 1.5 Pro, Flash. Supports 2M token context, multimodal counting, document processing.',
            zh: '专业的Google Gemini token计数器，支持Gemini 1.5 Pro、Gemini 1.5 Flash、Gemini Pro。支持最多200万token上下文，多模态计数，文档处理。'
        },
        features: {
            en: ['2M token context support', 'Multimodal token counting', 'Document processing', 'Video content analysis'],
            zh: ['200万token上下文支持', '多模态token计数', '文档处理', '视频内容分析']
        },
        useCases: {
            en: ['Long document analysis', 'Multimodal AI applications', 'Video processing', 'Large dataset analysis'],
            zh: ['长文档分析', '多模态AI应用', '视频处理', '大数据分析']
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
            en: 'Llama Token Counter: Llama 3.1, Llama 2 Calculator',
            zh: 'Meta Llama Token计数器：Llama 3.1、Llama 2开源计算工具'
        },
        seoDescription: {
            en: 'Free Llama token counter for Llama 3.1 (405B, 70B, 8B), Llama 2. Open source optimization, local deployment, custom fine-tuning.',
            zh: '免费的Meta Llama token计数器，支持Llama 3.1 (405B, 70B, 8B)、Llama 2模型。开源优化，本地部署规划，自定义微调支持。'
        },
        features: {
            en: ['Open source optimization', 'Local deployment support', 'Custom fine-tuning ready', 'Resource planning tools'],
            zh: ['开源优化', '本地部署支持', '自定义微调准备', '资源规划工具']
        },
        useCases: {
            en: ['Local AI deployment', 'Custom model training', 'Research projects', 'Private cloud solutions'],
            zh: ['本地AI部署', '自定义模型训练', '研究项目', '私有云解决方案']
        },
        representativeModels: {
            en: ['Llama 3.1 405B', 'Llama 3.1 70B', 'Llama 3.1 8B', 'Llama 2 70B'],
            zh: ['Llama 3.1 405B', 'Llama 3.1 70B', 'Llama 3.1 8B', 'Llama 2 70B']
        },
        defaultModel: 'llama-3.1-70b'
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
            en: 'DeepSeek Token Counter: R1, V3 Reasoning Calculator',
            zh: 'DeepSeek Token计数器：DeepSeek-R1、DeepSeek-V3推理计算工具'
        },
        seoDescription: {
            en: 'Specialized DeepSeek token counter for R1 Reasoner, V3 Chat. Reasoning optimization, mathematical analysis, step-by-step logic counting.',
            zh: '专门的DeepSeek token计数器，支持DeepSeek-R1推理器、DeepSeek-V3聊天。推理任务优化，数学分析，分步逻辑计数。'
        },
        features: {
            en: ['Reasoning task optimization', 'Mathematical analysis support', 'Step-by-step logic counting', 'Cost-efficient calculations'],
            zh: ['推理任务优化', '数学分析支持', '分步逻辑计数', '成本效率计算']
        },
        useCases: {
            en: ['Mathematical reasoning', 'Logic problem solving', 'Code analysis', 'Research assistance'],
            zh: ['数学推理', '逻辑问题求解', '代码分析', '研究辅助']
        },
        representativeModels: {
            en: ['DeepSeek-R1', 'DeepSeek-V3 Chat'],
            zh: ['DeepSeek-R1', 'DeepSeek-V3 Chat']
        },
        defaultModel: 'deepseek-reasoner'
    },
    {
        slug: 'qwen',
        name: 'Qwen3',
        company: 'Alibaba',
        description: {
            en: 'Qwen3 token counter and tokenizer tool. Approximate token counting for Qwen models using advanced estimation.',
            zh: 'Qwen3 token计数器和tokenizer工具。使用先进估算算法为Qwen模型提供近似token计数。'
        },
        seoTitle: {
            en: 'Qwen Token Counter: Alibaba Qwen Calculator & Tokenizer',
            zh: 'Qwen3 Token计数器：阿里巴巴Qwen Token计算器和分词器'
        },
        seoDescription: {
            en: 'Professional Qwen token counter for Alibaba Qwen models. Accurate counting for Qwen-Plus, Qwen-Turbo with cost estimation.',
            zh: '专业的Qwen3 token计数器，支持阿里巴巴Qwen模型。精确计算Qwen-Plus、Qwen-Turbo等模型的token数量，提供成本估算。'
        },
        features: {
            en: ['MoE architecture support', 'Multilingual optimization', 'Cost-efficient counting', 'Chinese language specialized'],
            zh: ['MoE架构支持', '多语言优化', '成本效率计算', '中文语言专门优化']
        },
        useCases: {
            en: ['Chinese AI applications', 'Multilingual content', 'Cost optimization', 'Enterprise deployment'],
            zh: ['中文AI应用', '多语言内容', '成本优化', '企业级部署']
        },
        representativeModels: {
            en: ['Qwen3-235B-A22B', 'Qwen-Plus', 'Qwen-Turbo', 'Qwen-Max'],
            zh: ['Qwen3-235B-A22B', 'Qwen-Plus', 'Qwen-Turbo', 'Qwen-Max']
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