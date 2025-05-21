import { ReactNode } from "react"

export default function Layout({
    children,
    params,
}: {
    children: ReactNode
    params: { lang: string }
}) {
    return children
}

// 定义支持的语言
export async function generateStaticParams() {
    return [
        { lang: "en" },
        { lang: "zh" },
    ]
} 