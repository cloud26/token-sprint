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
                zh: "LLM GPU需求计算器 | 支持最新AI大模型 | Qwen3 DeepSeek Llama等",
                en: "LLM GPU Requirements Calculator | Latest AI Models | Qwen3 DeepSeek Llama Claude"
            },
            description: {
                zh: "免费的大语言模型GPU需求计算器，支持最新AI模型包括Qwen3-235B、DeepSeek-R1、Llama 3.1等。精确计算GPU显存需求，支持H100、A100、RTX 4090等GPU型号，提供专业硬件配置建议。",
                en: "Free LLM GPU requirements calculator supporting latest AI models including Qwen3-235B, DeepSeek-R1, Llama 3.1, and more. Calculate precise VRAM requirements for H100, A100, RTX 4090. Professional hardware planning tool for AI infrastructure."
            }
        }
    },
    tokenCounter: {
        path: "token-counter-visualizer",
        title: {
            zh: "AI Token 计数器",
            en: "AI Token Counter"
        },
        description: {
            zh: "多模型Token精确计数，可视化分析",
            en: "Accurate token counting for multiple AI models with visualization"
        },
        metadata: {
            title: {
                zh: "Token Counter & Tokenizer | AI Token 计数器 | GPT Claude Gemini DeepSeek",
                en: "Token Counter & Tokenizer | AI Token Counter for GPT Claude Gemini DeepSeek Llama"
            },
            description: {
                zh: "免费的Token Counter和Tokenizer工具，支持GPT、Claude、Gemini、DeepSeek、Llama等主流LLM模型的token计数。提供精确计数、可视化分解和模型对比功能。",
                en: "Free token counter and tokenizer for GPT, Claude, Gemini, DeepSeek, Llama and other LLM models. Professional AI token counter with accurate counting, visual breakdown, and model comparison features."
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