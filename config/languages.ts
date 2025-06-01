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
                en: "AI Token Speed Simulator | Real AI Chat Experience"
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
            zh: "AI大模型显卡需求计算器",
            en: "LLM GPU Calculator: Estimate GPU Count & VRAM"
        },
        description: {
            zh: "精确计算部署AI大模型需要多少张显卡，支持NVIDIA/AMD/华为昇腾/Mac M系列全平台",
            en: "Accurately calculate how many GPUs you need to deploy LLMs. Supports NVIDIA, AMD, Huawei Ascend, Mac M-series. Get instant hardware recommendations."
        },
        metadata: {
            title: {
                zh: "AI显卡计算器 | 精确计算GPU数量与显存 | 支持最新大模型",
                en: "AI GPU Calculator: Estimate GPUs for LLM Deployment"
            },
            description: {
                zh: "免费AI大模型显卡需求计算工具，精确计算本地部署Qwen3-235B、DeepSeek-R1、Llama 3.1等模型需要多少张显卡。支持NVIDIA H100/A100、AMD、华为昇腾910B、Mac M1/M2/M3/M4系列，提供专业级硬件配置方案。",
                en: "Free AI GPU calculator for LLM deployment. Calculate exact GPU count and VRAM requirements for Qwen3-235B, DeepSeek-R1, Llama 3.1, and more models. Supports NVIDIA H100/A100/RTX 4090, AMD GPUs, Huawei Ascend 910B, Mac M1/M2/M3/M4 series. Professional hardware planning tool."
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
                zh: "AI Token计数器 | GPT Claude Gemini DeepSeek Llama",
                en: "AI Token Counter | GPT Claude Gemini DeepSeek Llama"
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
            en: "AI Development Tools | Token Counter | GPU Calculator"
        },
        description: {
            zh: "免费的专业AI开发工具集，包含智能Token计数器、大模型GPU计算器、AI生成速度体验器等实用工具。助力AI开发者提升效率，优化项目成本。",
            en: "Free professional AI development tools including smart token counter, LLM GPU calculator, and AI generation speed simulator. Essential tools for AI developers to optimize efficiency and project costs."
        }
    }
} 