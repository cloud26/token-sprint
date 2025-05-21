"use client"

import { useState } from "react"
import TokenSpeedDemo from "@/components/token-speed-demo"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [language, setLanguage] = useState<"en" | "zh">("zh")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Tabs value={language} onValueChange={(value) => setLanguage(value as "en" | "zh")} className="mb-2">
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="zh">中文</TabsTrigger>
              <TabsTrigger value="en">EN</TabsTrigger>
            </TabsList>
          </Tabs>
          <h1 className="text-3xl font-bold text-center">{language === "zh" ? "Token 冲刺" : "Token Sprint"}</h1>
          <p className="text-center text-muted-foreground">
            {language === "zh"
              ? "实时体验不同的 token 生成速度"
              : "Experience different token generation speeds in real-time"}
          </p>
        </div>
        <TokenSpeedDemo initialLanguage={language} />
      </div>
    </main>
  )
}
