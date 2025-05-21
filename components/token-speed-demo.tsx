"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface TokenSpeedDemoProps {
  initialLanguage?: "en" | "zh"
}

export default function TokenSpeedDemo({ initialLanguage = "zh" }: TokenSpeedDemoProps) {
  const [speed, setSpeed] = useState<number>(5)
  const [language, setLanguage] = useState<"en" | "zh">(initialLanguage)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedText, setGeneratedText] = useState<string>("")
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [tokenCount, setTokenCount] = useState<number>(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const positionRef = useRef<number>(0)
  const tokensRef = useRef<string[]>([])
  const displayTextRef = useRef<string[]>([])
  const textContainerRef = useRef<HTMLDivElement>(null)

  // Sample texts for different languages
  const texts = {
    zh: `在那遥远的维罗纳城邦，两个同样尊贵的家族，
因宿怨长存而再起纷争，血染古城墙。
命运的双星从这对世仇诞生，
一对恋人以死亡终结了父辈的仇恨。
他们悲剧性的爱情与父母的愤怒，
唯有他们的死亡才能平息这场争端，
这便是我们今日为您呈现的故事，
请静心聆听，我们将在这舞台上重现。
在这古老的街道上，荣誉与剑相伴，
年轻的心灵在命运的指引下相遇。
当朱丽叶的眼眸遇见罗密欧的凝视，
世间再无比这更纯粹的爱情。
然而命运弄人，他们的相爱注定坎坷，
家族的仇恨如高墙般将他们阻隔。
但爱情啊，它超越了所有的界限，
即使是死亡也无法将其消散。
请听这悲伤的故事，关于爱与恨，
关于生与死，关于和解与遗憾。
在这两个小时的旅程中，我们将展示，
那永恒的爱情如何战胜了一切。`,
    en: `Two households, both alike in dignity,
In fair Verona, where we lay our scene,
From ancient grudge break to new mutiny,
Where civil blood makes civil hands unclean.
From forth the fatal loins of these two foes
A pair of star-cross'd lovers take their life;
Whose misadventured piteous overthrows
Do with their death bury their parents' strife.
The fearful passage of their death-mark'd love,
And the continuance of their parents' rage,
Which, but their children's end, nought could remove,
Is now the two hours' traffic of our stage;
The which if you with patient ears attend,
What here shall miss, our toil shall strive to mend.
O, she doth teach the torches to burn bright!
It seems she hangs upon the cheek of night
Like a rich jewel in an Ethiope's ear;
Beauty too rich for use, for earth too dear!
So shows a snowy dove trooping with crows,
As yonder lady o'er her fellows shows.`,
  }

  // Get tokens based on language - more accurate tokenization
  const getTokens = (lang: "en" | "zh") => {
    if (lang === "zh") {
      // For Chinese, split by characters (each character is roughly a token)
      const tokens = texts.zh.match(/[\u4e00-\u9fa5]|[，。？！：；""''（）、]|[\n]/g) || []
      // Create display text that includes spaces for proper rendering
      const displayText = [...tokens]
      return { tokens, displayText }
    } else {
      // For English, approximate tokens by words and some punctuation
      // This is a simplification - real tokenizers are more complex
      const words = texts.en.split(/\s+/)
      const tokens = []
      const displayText = []

      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        // Add the word as a token
        tokens.push(word)

        // For display, add the word plus a space (except for the last word)
        if (i < words.length - 1) {
          displayText.push(word + " ")
        } else {
          displayText.push(word)
        }

        // Check if there's a newline after this word in the original text
        if (texts.en.indexOf(word + "\n") !== -1) {
          displayText[displayText.length - 1] = displayText[displayText.length - 1].trim() + "\n"
        }
      }

      return { tokens, displayText }
    }
  }

  // Function to scroll to bottom of text container
  const scrollToBottom = () => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight
    }
  }

  // Function to generate tokens
  const generateTokens = () => {
    if (positionRef.current < tokensRef.current.length) {
      const displayText = displayTextRef.current[positionRef.current]
      setGeneratedText((prev) => prev + displayText)
      setTokenCount((prev) => prev + 1)
      positionRef.current += 1
      setElapsedTime((Date.now() - startTimeRef.current) / 1000)

      // Schedule scroll after state update and render
      setTimeout(scrollToBottom, 0)
    } else {
      // Reached the end of the text
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsGenerating(false)
    }
  }

  // Start or stop token generation
  const toggleGeneration = () => {
    if (isGenerating) {
      // Stop generation
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsGenerating(false)
    } else {
      // Start generation
      setGeneratedText("")
      setTokenCount(0)
      setElapsedTime(0)
      positionRef.current = 0
      startTimeRef.current = Date.now()

      // Get tokens for the selected language
      const { tokens, displayText } = getTokens(language)
      tokensRef.current = tokens
      displayTextRef.current = displayText

      // Calculate interval in milliseconds based on tokens per second
      const interval = 1000 / speed

      // Start generating tokens
      intervalRef.current = setInterval(generateTokens, interval)
      setIsGenerating(true)
    }
  }

  // Reset when language changes
  useEffect(() => {
    setGeneratedText("")
    setTokenCount(0)
    setElapsedTime(0)
    positionRef.current = 0

    const { tokens, displayText } = getTokens(language)
    tokensRef.current = tokens
    displayTextRef.current = displayText

    if (isGenerating && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setIsGenerating(false)
    }
  }, [language])

  // Sync with parent language
  useEffect(() => {
    setLanguage(initialLanguage)
  }, [initialLanguage])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle speed change
  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0])
  }

  // Calculate actual tokens per second
  const actualTokensPerSecond = elapsedTime > 0 ? (tokenCount / elapsedTime).toFixed(2) : "0.00"

  return (
    <Card className="w-full">
      <CardContent className="p-3 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed-slider" className="text-sm font-medium">
              {language === "zh" ? "生成速度" : "Generation Speed"}: {speed} tokens/s
            </Label>
            <span className="text-sm text-muted-foreground">
              {language === "zh" ? "范围" : "Range"}: 1-100 tokens/s
            </span>
          </div>
          <Slider
            id="speed-slider"
            min={1}
            max={100}
            step={1}
            value={[speed]}
            onValueChange={handleSpeedChange}
            disabled={isGenerating}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{language === "zh" ? "慢" : "Slow"}</span>
            <span></span>
            <span>{language === "zh" ? "中等" : "Medium"}</span>
            <span></span>
            <span>{language === "zh" ? "快" : "Fast"}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Tokens: {tokenCount}</span>
            <span>Time: {elapsedTime.toFixed(2)}s</span>
            <span>Speed: {actualTokensPerSecond} tokens/s</span>
          </div>
          <div
            ref={textContainerRef}
            className="relative min-h-[220px] max-h-[220px] rounded-md border p-3 font-mono text-sm overflow-auto whitespace-pre-wrap"
          >
            {generatedText || (language === "zh" ? "生成的文本将显示在这里..." : "Generated text will appear here...")}
            {isGenerating && (
              <div className="absolute bottom-2 right-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            )}
          </div>
        </div>

        <Button
          onClick={toggleGeneration}
          className="w-full"
          variant={isGenerating ? "destructive" : "default"}
          disabled={isGenerating && positionRef.current >= tokensRef.current.length}
        >
          {isGenerating
            ? language === "zh"
              ? "停止生成"
              : "Stop Generation"
            : language === "zh"
              ? "开始生成"
              : "Start Generation"}
        </Button>
      </CardContent>
    </Card>
  )
}
