import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "LLM GPU Memory Calculator | AI Tools Collection",
    description: "Calculate GPU memory requirements and GPU count for LLM inference. Estimate the resources needed for running large language models.",
    generator: "linpp2009.com",
}

export default function LLMGPUMemoryCalculatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 