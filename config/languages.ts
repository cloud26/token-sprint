export type Language = "en" | "zh"

export const tools = {
    tokenSpeedVisualizer: {
        path: "token-generation-speed-visualizer",
        title: {
            zh: "AI Token 生成速度体验器",
            en: "AI Token Generation Speed Simulator"
        },
        description: {
            zh: "直观体验不同速度的 AI 文本生成效果，感受真实的对话体验",
            en: "Experience realistic AI text generation at different speeds and understand the impact on user experience"
        },
        metadata: {
            title: {
                zh: "AI Token 生成速度体验器 | 模拟真实AI对话体验",
                en: "AI Token Generation Speed Simulator | Experience Real AI Conversation"
            },
            description: {
                zh: "通过这个交互式可视化工具，直观体验不同 token 生成速度对 AI 对话体验的影响，帮助开发者优化用户体验设计。",
                en: "Interactive AI text generation speed simulator. Experience how different token generation speeds affect user experience in AI conversations. Perfect for developers optimizing AI chat interfaces."
            }
        }
    },
    llmGpuCalculator: {
        path: "llm-gpu-memory-calculator",
        title: {
            zh: "大模型部署GPU计算器",
            en: "LLM GPU Requirements Calculator"
        },
        description: {
            zh: "精确计算大语言模型部署所需的GPU显存和硬件配置",
            en: "Calculate precise GPU memory and hardware requirements for deploying large language models"
        },
        metadata: {
            title: {
                zh: "大模型部署GPU计算器 | 精确计算显存需求",
                en: "LLM GPU Requirements Calculator - Precise Memory & Hardware Planning"
            },
            description: {
                zh: "免费的大语言模型GPU计算器，精确计算模型部署所需的显存、GPU数量和最优硬件配置。支持主流GPU型号，助力AI项目规划。",
                en: "Free LLM GPU calculator for precise hardware planning. Calculate VRAM requirements, optimal GPU configurations for model deployment. Supports NVIDIA H100, A100, RTX series. Essential for AI infrastructure planning."
            }
        }
    },
    tokenCounter: {
        path: "token-counter-visualizer",
        title: {
            zh: "智能Token计数与成本分析器",
            en: "Smart Token Counter & Cost Analyzer"
        },
        description: {
            zh: "多模型Token精确计数，可视化分析，实时成本估算",
            en: "Accurate token counting for multiple AI models with visualization and real-time cost estimation"
        },
        metadata: {
            title: {
                zh: "智能Token计数器 | 多模型支持 | 成本分析",
                en: "Smart Token Counter | Multi-Model Support | Cost Analysis Tool"
            },
            description: {
                zh: "专业的Token计数与成本分析工具，支持GPT、Claude、DeepSeek等主流模型。提供精确计数、可视化分解、成本估算和模型对比功能。",
                en: "Professional token counter and cost analyzer supporting GPT, Claude, DeepSeek and more. Features accurate counting, visual breakdown, cost estimation, and model comparison for AI development."
            }
        }
    }
}

export const common = {
    backToHome: {
        zh: "返回主页",
        en: "Back to Home"
    },
    languageLabels: {
        zh: "中文",
        en: "English"
    }
}

export const home = {
    title: {
        zh: "专业AI开发工具集",
        en: "Professional AI Development Tools"
    },
    description: {
        zh: "精选实用的AI开发与分析工具，助力您的AI项目",
        en: "Curated collection of practical AI development and analysis tools for your projects"
    },
    metadata: {
        title: {
            zh: "专业AI开发工具集 | Token计数器 | GPU计算器 | 免费在线工具",
            en: "Professional AI Development Tools | Token Counter | GPU Calculator | Free Online Tools"
        },
        description: {
            zh: "免费的专业AI开发工具集，包含智能Token计数器、大模型GPU计算器、AI生成速度体验器等实用工具。助力AI开发者提升效率，优化项目成本。",
            en: "Free professional AI development tools including smart token counter, LLM GPU calculator, and AI generation speed simulator. Essential tools for AI developers to optimize efficiency and project costs."
        }
    }
} 