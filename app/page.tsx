"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [language, setLanguage] = useState<"en" | "zh">("zh")

  const tools = [
    {
      title: {
        zh: "Token 生成速度可视化",
        en: "Token Generation Speed Visualizer"
      },
      description: {
        zh: "实时体验不同的 token 生成速度",
        en: "Experience different token generation speeds in real-time"
      },
      path: "/token-generation-speed-visualizer"
    },
    {
      title: {
        zh: "大模型推理显存与GPU数量计算器",
        en: "LLM GPU Memory Calculator"
      },
      description: {
        zh: "计算大语言模型推理所需的显存和GPU数量",
        en: "Calculate GPU memory requirements and GPU count for LLM inference"
      },
      path: "/llm-gpu-memory-calculator"
    }
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-2 md:p-8 md:pt-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-col items-center gap-1 mt-16">
          <Tabs value={language} onValueChange={(value) => setLanguage(value as "en" | "zh")} className="mb-1">
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="zh">中文</TabsTrigger>
              <TabsTrigger value="en">EN</TabsTrigger>
            </TabsList>
          </Tabs>
          <h1 className="text-3xl font-bold text-center">
            {language === "zh" ? "AI 工具集" : "AI Tools Collection"}
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            {language === "zh"
              ? "一系列实用的 AI 相关工具"
              : "A collection of useful AI-related tools"}
          </p>
        </div>

        <div className="grid gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="group flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{tool.title[language]}</h2>
                <p className="text-sm text-muted-foreground">{tool.description[language]}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
