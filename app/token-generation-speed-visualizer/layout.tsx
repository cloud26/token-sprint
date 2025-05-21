import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Token Generation Speed Visualizer | AI Tools Collection",
    description: "Experience different token generation speeds in real-time. Compare and visualize the token generation speed of various AI models.",
    generator: "linpp2009.com",
}

export default function TokenGenerationSpeedVisualizerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 