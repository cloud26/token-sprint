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
            en: "Llama Local Requirements Calculator | GPU Count for Llama 70B/405B"
        },
        seoDescription: {
            zh: "专业的Llama本地部署GPU计算器，精确计算Llama 3.1 70B/405B模型本地运行需要多少张显卡。支持NVIDIA H100/A100/RTX 4090、AMD、华为昇腾、Mac M系列，提供最优本地部署方案。",
            en: "Professional Llama local requirements calculator. Calculate exact GPU count needed for local deployment of Llama 3.1 70B/405B models. Supports NVIDIA H100/A100/RTX 4090, AMD GPUs, Huawei Ascend, Mac M-series. Get optimal local deployment recommendations."
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
            en: "DeepSeek R1 Local Requirements Calculator | 671B Model GPU Count"
        },
        seoDescription: {
            zh: "DeepSeek R1 (671B) 本地部署专用GPU计算器，精确计算超大规模模型运行需要的显卡数量。支持FP8优化部署，提供H100/A100集群配置方案，专业级推理部署规划。",
            en: "DeepSeek R1 (671B) local deployment GPU calculator. Calculate exact GPU requirements for this massive 671B parameter model. Supports FP8 optimized deployment with H100/A100 cluster configurations. Professional inference deployment planning."
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
            en: "Qwen3 Local Requirements Calculator | 235B MoE Model GPU Count"
        },
        seoDescription: {
            zh: "Qwen3-235B-A22B MoE模型本地部署GPU计算器，计算混合专家模型的精确显卡需求。235B总参数，22B激活参数，高效节省显存，提供专业MoE架构部署方案。",
            en: "Qwen3-235B-A22B MoE model local deployment calculator. Calculate precise GPU requirements for this mixture-of-experts architecture. 235B total with 22B active parameters, memory-efficient design. Professional MoE deployment planning."
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
            en: "Claude Local Requirements Calculator | Claude 3.5 GPU Count"
        },
        seoDescription: {
            zh: "Claude 3.5 Sonnet本地部署GPU计算器，计算Anthropic Claude模型的显卡配置需求。支持长上下文处理，提供专业的本地化部署方案和硬件配置建议。",
            en: "Claude 3.5 Sonnet local deployment GPU calculator. Calculate hardware requirements for Anthropic's Claude model with long context support. Professional local deployment solutions and hardware configuration recommendations."
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
            en: "Gemini Local Requirements Calculator | Gemini 1.5 Pro GPU Count"
        },
        seoDescription: {
            zh: "Gemini 1.5 Pro本地部署GPU计算器，计算Google Gemini模型的本地运行显卡需求。支持多模态处理，提供专业的GPU配置方案和部署建议。",
            en: "Gemini 1.5 Pro local deployment GPU calculator. Calculate local hardware requirements for Google's Gemini model with multimodal processing. Professional GPU configuration and deployment recommendations."
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