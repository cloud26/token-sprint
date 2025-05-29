"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Language } from '@/config/languages'
import { encodingForModel } from "js-tiktoken"

interface TokenCounterProps {
    language: Language
}

interface ModelInfo {
    value: string
    label: string
    encoding: string
    currency?: 'USD' | 'CNY'
}

const models: ModelInfo[] = [
    // OpenAI GPT 系列
    { value: "gpt-4o", label: "GPT-4o", encoding: "gpt-4o", currency: 'USD' },
    { value: "gpt-4", label: "GPT-4", encoding: "gpt-4", currency: 'USD' },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo", encoding: "gpt-4-turbo", currency: 'USD' },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", encoding: "gpt-3.5-turbo", currency: 'USD' },
    { value: "text-davinci-003", label: "GPT-3 Davinci", encoding: "text-davinci-003", currency: 'USD' },
    
    // Google Gemini 系列 (近似估算)
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "gemini-pro", label: "Gemini Pro ⚠️", encoding: "gpt-4", currency: 'USD' },
    
    // Meta Llama 系列 (近似估算)
    { value: "llama-3.1-405b", label: "Llama 3.1 405B ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "llama-3.1-70b", label: "Llama 3.1 70B ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "llama-3.1-8b", label: "Llama 3.1 8B ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "llama-2-70b", label: "Llama 2 70B ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "llama-2-13b", label: "Llama 2 13B ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "llama-2-7b", label: "Llama 2 7B ⚠️", encoding: "gpt-4", currency: 'USD' },
    
    // DeepSeek 系列 (近似估算)
    { value: "deepseek-chat", label: "DeepSeek-V3 Chat ⚠️", encoding: "gpt-4", currency: 'CNY' },
    { value: "deepseek-reasoner", label: "DeepSeek-R1 Reasoner ⚠️", encoding: "gpt-4", currency: 'CNY' },
    
    // Claude 系列 (近似估算)
    { value: "claude-4-opus", label: "Claude 4 Opus ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "claude-4-sonnet", label: "Claude 4 Sonnet ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "claude-3.5-haiku", label: "Claude 3.5 Haiku ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "claude-3-opus", label: "Claude 3 Opus ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "claude-3-sonnet", label: "Claude 3 Sonnet ⚠️", encoding: "gpt-4", currency: 'USD' },
    { value: "claude-3-haiku", label: "Claude 3 Haiku ⚠️", encoding: "gpt-4", currency: 'USD' },
]

export default function TokenCounter({ language }: TokenCounterProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    
    // URL参数中的模型，如果没有则使用默认值
    const initialModel = searchParams.get('model') || "deepseek-chat"
    
    const [text, setText] = useState("")
    const [selectedModel, setSelectedModel] = useState(initialModel)
    const [debouncedText, setDebouncedText] = useState("")
    const [showTokenBreakdown, setShowTokenBreakdown] = useState(true)
    const [tokenDisplayMode, setTokenDisplayMode] = useState<'text' | 'ids'>('text')
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
    
    const currentModel = models.find(m => m.value === selectedModel) || models[0]

    // 更新URL参数
    const updateURLParams = (newModel: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (newModel && newModel !== "deepseek-chat") {
            params.set('model', newModel)
        } else {
            params.delete('model')
        }
        
        const queryString = params.toString()
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname
        
        // 使用replace避免在浏览器历史中创建过多条目
        router.replace(newUrl, { scroll: false })
    }

    // 当模型选择改变时更新URL
    const handleModelChange = (newModel: string) => {
        setSelectedModel(newModel)
        updateURLParams(newModel)
    }

    // 监听URL参数变化，更新选中的模型
    useEffect(() => {
        const urlModel = searchParams.get('model') || "deepseek-chat"
        
        // 只有当URL参数与当前状态不同时才更新，避免循环更新
        if (urlModel !== selectedModel) {
            setSelectedModel(urlModel)
        }
    }, [searchParams.get('model')])

    // 防抖处理文本输入
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }
        
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedText(text)
        }, 300) // 300ms 防抖延迟
        
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [text])

    // 缓存encoding实例
    const encoding = useMemo(() => {
        try {
            return encodingForModel(currentModel.encoding as any)
        } catch (error) {
            console.error("Error getting encoding:", error)
            return null
        }
    }, [currentModel.encoding])

    const tokenData = useMemo(() => {
        if (!debouncedText.trim() || !encoding) {
            // 快速预估，用于实时显示
            return {
                count: Math.ceil(text.length / 4),
                tokens: [],
                tokenIds: []
            }
        }
        
        try {
            const tokenIds = encoding.encode(debouncedText)
            const tokens = tokenIds.map(id => encoding.decode([id]))
            return {
                count: tokenIds.length,
                tokens: tokens,
                tokenIds: tokenIds
            }
        } catch (error) {
            console.error("Error encoding text:", error)
            // Fallback: rough estimation of 1 token per 4 characters
            return {
                count: Math.ceil(debouncedText.length / 4),
                tokens: [],
                tokenIds: []
            }
        }
    }, [debouncedText, encoding, text.length])

    const tokenCount = tokenData.count

    const characterCount = text.length
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

    // 记录使用日志 - 只在用户停止输入后记录
    useEffect(() => {
        if (debouncedText.trim() && tokenCount > 0) {
            const logUsage = async () => {
                try {
                    await fetch('/api/log', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            tool: 'token-counter-visualizer',
                            model: selectedModel,
                            tokenCount,
                            characterCount,
                            wordCount,
                            locale: language
                        }),
                    });
                } catch (error) {
                    console.error('Failed to log usage:', error);
                }
            };
            logUsage();
        }
    }, [debouncedText, selectedModel, tokenCount, characterCount, wordCount, language]);

    const texts = {
        input: {
            zh: "输入文本",
            en: "Input Text"
        },
        inputPlaceholder: {
            zh: "在此输入或粘贴您要计算token数量的文本...",
            en: "Enter or paste your text here to count tokens..."
        },
        model: {
            zh: "选择模型",
            en: "Select Model"
        },
        results: {
            zh: "统计结果",
            en: "Results"
        },
        tokens: {
            zh: "Token 数量",
            en: "Token Count"
        },
        characters: {
            zh: "字符数",
            en: "Characters"
        },
        words: {
            zh: "单词数",
            en: "Words"
        },
        calculating: {
            zh: "计算中...",
            en: "Calculating..."
        }
    }

    // 判断是否正在计算精确值
    const isCalculating = text !== debouncedText && text.trim().length > 0

    return (
        <Card className="w-full">
            <CardContent className="p-6 space-y-6">
                {/* 模型选择 */}
                <div className="space-y-2">
                    <Label>{texts.model[language]}</Label>
                    <Select value={selectedModel} onValueChange={handleModelChange}>
                        <SelectTrigger className="text-base">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                            {/* OpenAI GPT 系列 */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                                OpenAI GPT 系列
                            </div>
                            {models.filter(m => m.value.startsWith('gpt-') || m.value.startsWith('text-')).map((model) => (
                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="font-medium text-sm">{model.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                            
                            {/* Google Gemini 系列 */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 mt-1">
                                Google Gemini 系列
                            </div>
                            {models.filter(m => m.value.startsWith('gemini')).map((model) => (
                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="font-medium text-sm">{model.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                            
                            {/* Meta Llama 系列 */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 mt-1">
                                Meta Llama 系列
                            </div>
                            {models.filter(m => m.value.startsWith('llama')).map((model) => (
                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="font-medium text-sm">{model.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                            
                            {/* DeepSeek 系列 */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 mt-1">
                                DeepSeek 系列
                            </div>
                            {models.filter(m => m.value.startsWith('deepseek')).map((model) => (
                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="font-medium text-sm">{model.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                            
                            {/* Claude 4 系列 */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 mt-1">
                                Claude 4 系列
                            </div>
                            {models.filter(m => m.value.startsWith('claude-4')).map((model) => (
                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="font-medium text-sm">{model.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                            
                            {/* Claude 3.5 系列 */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 mt-1">
                                Claude 3.5 系列
                            </div>
                            {models.filter(m => m.value.startsWith('claude-3.5')).map((model) => (
                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="font-medium text-sm">{model.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                            
                            {/* Claude 3 系列 */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 mt-1">
                                Claude 3 系列
                            </div>
                            {models.filter(m => m.value.startsWith('claude-3') && !m.value.startsWith('claude-3.5')).map((model) => (
                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="font-medium text-sm">{model.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 文本输入 */}
                <div className="space-y-2">
                    <Label htmlFor="text-input">{texts.input[language]}</Label>
                    <Textarea
                        id="text-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={texts.inputPlaceholder[language]}
                        className="min-h-[200px] text-base resize-none"
                    />
                </div>

                {/* 示例演示 */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="text-sm text-amber-800 space-y-3">
                        <p className="font-medium">
                            {language === 'en' ? 'Examples:' : '示例：'}
                        </p>
                        <div className="space-y-2">
                            {language === 'en' ? (
                                <>
                                    <div className="flex gap-2">
                                        <button 
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setText("系列")
                                                setShowTokenBreakdown(true)
                                            }}
                                        >
                                            Test "系列"
                                        </button>
                                        <button 
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setText("GPT-4模型系列")
                                                setShowTokenBreakdown(true)
                                            }}
                                        >
                                            Test "GPT-4模型系列"
                                        </button>
                                        <button 
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setText("人工智能技术发展")
                                                setShowTokenBreakdown(true)
                                            }}
                                        >
                                            Test "人工智能技术发展"
                                        </button>
                                    </div>
                                    <p className="text-xs italic">
                                        Try these examples and switch between different models to see how the same text produces different token counts!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-2 flex-wrap">
                                        <button 
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setText("系列")
                                                setShowTokenBreakdown(true)
                                            }}
                                        >
                                            测试"系列"
                                        </button>
                                        <button 
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setText("GPT-4模型系列")
                                                setShowTokenBreakdown(true)
                                            }}
                                        >
                                            测试"GPT-4模型系列"
                                        </button>
                                        <button 
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setText("人工智能技术发展")
                                                setShowTokenBreakdown(true)
                                            }}
                                        >
                                            测试"人工智能技术发展"
                                        </button>
                                        <button 
                                            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-xs transition-colors"
                                            onClick={() => {
                                                setText("Machine learning algorithms")
                                                setShowTokenBreakdown(true)
                                            }}
                                        >
                                            测试英文文本
                                        </button>
                                    </div>
                                    <p className="text-xs italic">
                                        试试这些示例并在不同模型间切换，看看相同文本在不同tokenizer下的token数量差异！
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* 统计结果 */}
                <div className="space-y-2">
                    <Label className="text-base font-semibold">
                        {texts.results[language]}
                        {isCalculating && (
                            <span className="text-xs text-gray-500 ml-2">
                                ({texts.calculating[language]})
                            </span>
                        )}
                    </Label>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="text-center">
                                <Label className="text-gray-600 text-xs block mb-1">{texts.tokens[language]}</Label>
                                <p className={`text-lg font-bold ${isCalculating ? 'text-gray-400' : 'text-blue-600'}`}>
                                    {tokenCount.toLocaleString()}
                                    {isCalculating && <span className="text-xs">*</span>}
                                </p>
                            </div>
                            <div className="text-center">
                                <Label className="text-gray-600 text-xs block mb-1">{texts.characters[language]}</Label>
                                <p className="text-lg font-semibold text-green-600">{characterCount.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <Label className="text-gray-600 text-xs block mb-1">{texts.words[language]}</Label>
                                <p className="text-lg font-semibold text-purple-600">{wordCount.toLocaleString()}</p>
                            </div>
                        </div>
                        {isCalculating && (
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                {language === 'en' ? 'Approximate count, precise calculation in progress...' : '近似计数，精确计算中...'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Token 可视化 */}
                {text.trim() && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">
                                {language === 'en' ? 'Token Breakdown' : 'Token 分解'}
                            </Label>
                            <button
                                onClick={() => setShowTokenBreakdown(!showTokenBreakdown)}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {showTokenBreakdown ? 
                                    (language === 'en' ? 'Hide' : '隐藏') : 
                                    (language === 'en' ? 'Show' : '显示')
                                }
                            </button>
                        </div>
                        
                        {showTokenBreakdown && tokenData.tokens.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                {/* 切换显示模式 */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setTokenDisplayMode('text')}
                                        className={`px-3 py-1 rounded text-sm transition-colors ${
                                            tokenDisplayMode === 'text' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {language === 'en' ? 'Text' : '文本'}
                                    </button>
                                    <button
                                        onClick={() => setTokenDisplayMode('ids')}
                                        className={`px-3 py-1 rounded text-sm transition-colors ${
                                            tokenDisplayMode === 'ids' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {language === 'en' ? 'Token IDs' : 'Token ID'}
                                    </button>
                                </div>
                                
                                {/* Token 显示区域 */}
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-600 mb-2">
                                        {language === 'en' ? 
                                            `${tokenData.tokens.length} tokens found:` : 
                                            `发现 ${tokenData.tokens.length} 个 tokens：`
                                        }
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {tokenData.tokens.map((token, index) => {
                                            // 为不同token添加不同颜色，循环使用
                                            const colors = [
                                                'bg-blue-100 text-blue-800 hover:bg-blue-200',
                                                'bg-green-100 text-green-800 hover:bg-green-200', 
                                                'bg-purple-100 text-purple-800 hover:bg-purple-200',
                                                'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                                                'bg-pink-100 text-pink-800 hover:bg-pink-200',
                                                'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                                            ]
                                            const colorClass = colors[index % colors.length]
                                            
                                            return (
                                                <span
                                                    key={index}
                                                    className={`inline-block px-2 py-1 ${colorClass} rounded text-sm font-mono border transition-colors cursor-default`}
                                                    title={`Token ${index + 1}: "${token}" (ID: ${tokenData.tokenIds[index]})`}
                                                >
                                                    {tokenDisplayMode === 'text' ? (
                                                        token.replace(/\s/g, '⎵') // 显示空格为可见字符
                                                    ) : (
                                                        tokenData.tokenIds[index]
                                                    )}
                                                </span>
                                            )
                                        })}
                                    </div>
                                    
                                    {/* 说明文字 */}
                                    <div className="text-xs text-gray-500 mt-3">
                                        {language === 'en' ? (
                                            <div>
                                                <p>• Each colored block represents one token</p>
                                                <p>• Hover over tokens to see their IDs</p>
                                                <p>• ⎵ represents spaces</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p>• 每个彩色块代表一个 token</p>
                                                <p>• 悬停在 token 上查看其 ID</p>
                                                <p>• ⎵ 代表空格</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 使用提示 */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800 space-y-2">
                        {language === 'en' ? (
                            <div>
                                <p className="font-medium">Important Notes:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li><strong>OpenAI models</strong> use accurate native tokenizers</li>
                                    <li><strong>Other models (⚠️)</strong> use GPT-4 tokenizer for approximation</li>
                                    <li>Punctuation, spaces, and special characters all affect token count</li>
                                    <li>Non-English text may use more tokens per character</li>
                                    <li>For precise counts of non-OpenAI models, use their official tokenizers</li>
                                </ul>
                            </div>
                        ) : (
                            <div>
                                <p className="font-medium">重要说明：</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li><strong>OpenAI模型</strong> 使用准确的原生分词器</li>
                                    <li><strong>其他模型 (⚠️)</strong> 使用GPT-4分词器进行近似估算</li>
                                    <li>标点符号、空格和特殊字符都会影响token数量</li>
                                    <li>非英语文本每个字符可能使用更多token</li>
                                    <li>要获得非OpenAI模型的精确计数，请使用其官方分词器</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>


            </CardContent>
        </Card>
    )
} 