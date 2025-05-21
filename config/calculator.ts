import { Language } from "./languages"

export const calculatorText = {
    title: {
        zh: "大模型推理显存与GPU数量计算器",
        en: "LLM GPU Memory Calculator"
    },
    parameters: {
        label: {
            zh: "模型参数量（单位：十亿）",
            en: "Model Parameters (Billions)"
        },
        tooltip: {
            zh: "模型的参数量，例如：7B (Llama 2)、13B、70B、175B (GPT-3)",
            en: "Model size in billions of parameters, e.g., 7B (Llama 2), 13B, 70B, 175B (GPT-3)"
        },
        selectPlaceholder: {
            zh: "选择预设模型",
            en: "Select a model"
        }
    },
    precision: {
        label: {
            zh: "计算精度",
            en: "Precision"
        },
        tooltip: {
            zh: "不同的计算精度会影响显存使用量，FP32最高，FP8最低",
            en: "Different precisions affect memory usage, FP32 highest, FP8 lowest"
        }
    },
    gpu: {
        label: {
            zh: "GPU型号",
            en: "GPU Model"
        },
        searchPlaceholder: {
            zh: "搜索GPU型号...",
            en: "Search GPU models..."
        },
        notFound: {
            zh: "未找到匹配的GPU型号",
            en: "No GPU model found"
        }
    },
    results: {
        modelMemory: {
            zh: "模型显存占用",
            en: "Model Memory"
        },
        inferenceMemory: {
            zh: "推理额外显存",
            en: "Inference Memory"
        },
        totalMemory: {
            zh: "总显存需求",
            en: "Total Memory Required"
        },
        requiredGPUs: {
            zh: "所需GPU数量",
            en: "Required GPUs"
        },
        unit: {
            zh: "块",
            en: "x"
        }
    },
    footer: {
        supportText: {
            zh: "如果这个工具对你有帮助，欢迎请我喝杯咖啡 ☕",
            en: "If you find this tool helpful, consider buying me a coffee ☕"
        }
    }
} as const 