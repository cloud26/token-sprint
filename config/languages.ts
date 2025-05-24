export type Language = "en" | "zh"

export const tools = {
    tokenSpeedVisualizer: {
        path: "token-generation-speed-visualizer",
        title: {
            zh: "Token 生成速度可视化",
            en: "Token Generation Speed Visualizer"
        },
        description: {
            zh: "实时体验不同的 token 生成速度",
            en: "Experience different token generation speeds in real-time"
        },
        metadata: {
            title: {
                zh: "Token 生成速度可视化 | AI 工具集",
                en: "Token Generation Speed Visualizer | AI Tools"
            },
            description: {
                zh: "通过这个可视化工具，你可以实时体验和理解不同的 token 生成速度对用户体验的影响。",
                en: "Experience and understand how different token generation speeds affect user experience through this interactive visualization tool."
            }
        }
    },
    llmGpuCalculator: {
        path: "llm-gpu-memory-calculator",
        title: {
            zh: "大模型推理显存与GPU数量计算器",
            en: "LLM Inference Hardware Calculator"
        },
        description: {
            zh: "计算大语言模型推理所需的显存和GPU数量",
            en: "Calculate GPU memory requirements for large language model inference and hardware planning"
        },
        metadata: {
            title: {
                zh: "大模型推理显存计算器 | AI 工具集",
                en: "LLM Inference Hardware Calculator - GPU Memory Requirements Tool"
            },
            description: {
                zh: "帮助你计算和规划大语言模型推理所需的GPU显存和数量，优化资源配置。",
                en: "Free LLM inference hardware calculator. Calculate GPU memory requirements, VRAM usage, and optimal hardware configuration for large language model deployment. Support for NVIDIA H100, A100, RTX series GPUs."
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
        zh: "AI 工具集",
        en: "AI Tools Collection"
    },
    description: {
        zh: "一系列实用的 AI 相关工具",
        en: "A collection of useful AI-related tools"
    },
    metadata: {
        title: {
            zh: "AI 工具集 | 实用工具合集",
            en: "AI Tools Collection | Useful Tools"
        },
        description: {
            zh: "发现并使用我们精心打造的 AI 相关工具集，包括 Token 生成速度可视化和大模型推理显存计算器等。",
            en: "Discover and use our carefully crafted collection of AI-related tools, including Token Generation Speed Visualizer and LLM GPU Memory Calculator."
        }
    }
} 