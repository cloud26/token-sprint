"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Language } from '@/config/languages'
import { encodingForModel } from "js-tiktoken"
import { useTranslations } from 'next-intl'
import { Loader2 } from "lucide-react"

// 使用 Hugging Face Transformers.js 进行本地 tokenization
// 支持多种模型的社区 tokenizer
let AutoTokenizer: any = null

// 动态导入 Transformers.js (仅在浏览器环境)
const loadTransformers = async () => {
    if (typeof window !== 'undefined' && !AutoTokenizer) {
        try {
            const transformers = await import('@huggingface/transformers')
            AutoTokenizer = transformers.AutoTokenizer
            return transformers.AutoTokenizer
        } catch (error) {
            console.warn('Failed to load @huggingface/transformers:', error)
            return null
        }
    }
    return AutoTokenizer
}

interface TokenCounterProps {
    language: Language
    defaultModel?: string
    preferredCompany?: string
    restrictToCompany?: boolean // 新增：是否只显示特定公司的模型
}

interface ModelInfo {
    value: string
    label: string
    encoding: string
    hub?: string  // Hugging Face Hub 模型路径
}

// 基于参考项目的模型配置，使用 Hugging Face 社区 tokenizer
const models: ModelInfo[] = [
    // OpenAI GPT 系列 - 使用原生 js-tiktoken
    { value: "gpt-4o", label: "GPT-4o", encoding: "gpt-4o" },
    { value: "gpt-4", label: "GPT-4", encoding: "gpt-4" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo", encoding: "gpt-4-turbo" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", encoding: "gpt-3.5-turbo" },
    { value: "text-davinci-003", label: "GPT-3 Davinci", encoding: "text-davinci-003" },

    // Claude 系列 - 使用 Hugging Face 社区 tokenizer
    { value: "claude-opus-4", label: "Claude 4 Opus 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-sonnet-4", label: "Claude 4 Sonnet 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-3.7-sonnet", label: "Claude 3.7 Sonnet 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-3.7-haiku", label: "Claude 3.7 Haiku 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-3.5-haiku", label: "Claude 3.5 Haiku 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-3-opus", label: "Claude 3 Opus 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-3-sonnet", label: "Claude 3 Sonnet 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },
    { value: "claude-3-haiku", label: "Claude 3 Haiku 🤗", encoding: "huggingface", hub: "Xenova/claude-tokenizer" },

    // Meta Llama 系列 - 使用 Hugging Face tokenizer
    { value: "llama-3.3", label: "Llama 3.3 🤗", encoding: "huggingface", hub: "unsloth/Llama-3.3-70B-Instruct" },
    { value: "llama-3.2", label: "Llama 3.2 🤗", encoding: "huggingface", hub: "Xenova/Llama-3.2-Tokenizer" },
    { value: "llama-3.1", label: "Llama 3.1 🤗", encoding: "huggingface", hub: "Xenova/Meta-Llama-3.1-Tokenizer" },
    { value: "llama-3", label: "Llama 3 🤗", encoding: "huggingface", hub: "Xenova/llama3-tokenizer-new" },
    { value: "llama-2", label: "Llama 2 🤗", encoding: "huggingface", hub: "Xenova/llama2-tokenizer" },
    { value: "code-llama", label: "Code Llama 🤗", encoding: "huggingface", hub: "Xenova/llama-code-tokenizer" },

    // DeepSeek 系列 - 使用官方 Hugging Face 模型
    { value: "deepseek-r1", label: "DeepSeek R1 🤗", encoding: "huggingface", hub: "deepseek-ai/DeepSeek-R1" },
    { value: "deepseek-v3", label: "DeepSeek V3 🤗", encoding: "huggingface", hub: "deepseek-ai/DeepSeek-V3" },
    { value: "deepseek-v2", label: "DeepSeek V2 🤗", encoding: "huggingface", hub: "deepseek-ai/DeepSeek-V2" },

    // Mistral 系列 - 使用 Hugging Face tokenizer
    { value: "mistral-large", label: "Mistral Large 🤗", encoding: "huggingface", hub: "Xenova/mistral-tokenizer-v3" },
    { value: "mistral-nemo", label: "Mistral Nemo 🤗", encoding: "huggingface", hub: "Xenova/Mistral-Nemo-Instruct-Tokenizer" },
    { value: "codestral", label: "Codestral 🤗", encoding: "huggingface", hub: "Xenova/mistral-tokenizer-v3" },

    // Google Gemini 系列 - 使用估算（因为没有官方 tokenizer）
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro ⚠️", encoding: "gpt-4" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash ⚠️", encoding: "gpt-4" },
    { value: "gemini-pro", label: "Gemini Pro ⚠️", encoding: "gpt-4" },

    // Qwen 系列 - 使用官方 tokenizer
    { value: "qwen3-coder-480b", label: "Qwen3-Coder-480B-A35B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen3-235b", label: "Qwen3-235B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen2.5-72b", label: "Qwen2.5-72B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen2.5-32b", label: "Qwen2.5-32B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwq-32b", label: "QwQ-32B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen2.5-14b", label: "Qwen2.5-14B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen2.5-7b", label: "Qwen2.5-7B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen2-72b", label: "Qwen2-72B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen2-7b", label: "Qwen2-7B 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen-plus", label: "Qwen-Plus 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen-turbo", label: "Qwen-Turbo 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
    { value: "qwen-max", label: "Qwen-Max 🤗", encoding: "huggingface", hub: "Qwen/Qwen-tokenizer" },
]

export default function TokenCounter({ language, defaultModel, preferredCompany, restrictToCompany }: TokenCounterProps) {
    const t = useTranslations('common.ui')
    const tc = useTranslations('common.ui.tokenCounter')
    const [text, setText] = useState("")
    const [selectedModel, setSelectedModel] = useState(defaultModel || "gpt-4o")
    const [debouncedText, setDebouncedText] = useState("")
    const [showTokenBreakdown, setShowTokenBreakdown] = useState(true)
    const [tokenDisplayMode, setTokenDisplayMode] = useState<'text' | 'ids'>('text')
    const [isLoadingHFTokenizer, setIsLoadingHFTokenizer] = useState(false)
    const [hfTokenizerError, setHfTokenizerError] = useState<string | null>(null)
    const [tokenizerCache, setTokenizerCache] = useState<Map<string, any>>(new Map())
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [loadingState, setLoadingState] = useState<'preparing' | 'downloading' | 'initializing' | 'ready' | 'error'>('preparing')

    // 根据优先公司重新排序模型列表，或者只显示特定公司的模型
    const sortedModels = useMemo(() => {
        if (!preferredCompany) return models

        const preferred: typeof models = []
        const others: typeof models = []

        models.forEach(model => {
            const modelValue = model.value.toLowerCase()
            const company = preferredCompany.toLowerCase()

            let isPreferred = false
            if (company === 'openai' && (modelValue.startsWith('gpt-') || modelValue.startsWith('text-'))) {
                isPreferred = true
            } else if (company === 'anthropic' && modelValue.startsWith('claude')) {
                isPreferred = true
            } else if (company === 'google' && modelValue.startsWith('gemini')) {
                isPreferred = true
            } else if (company === 'meta' && modelValue.startsWith('llama')) {
                isPreferred = true
            } else if (company === 'deepseek' && modelValue.startsWith('deepseek')) {
                isPreferred = true
            } else if (company === 'alibaba' && (modelValue.startsWith('qwen') || modelValue.startsWith('qwq'))) {
                isPreferred = true
            } else if (company === 'mistral' && (modelValue.startsWith('mistral') || modelValue.startsWith('codestral'))) {
                isPreferred = true
            }

            if (isPreferred) {
                preferred.push(model)
            } else {
                others.push(model)
            }
        })

        // 如果 restrictToCompany 为 true，只返回该公司的模型
        if (restrictToCompany) {
            return preferred
        }

        return [...preferred, ...others]
    }, [preferredCompany, restrictToCompany])

    const currentModel = sortedModels.find(m => m.value === selectedModel) || sortedModels[0]

    // 确保选中的模型在过滤后的列表中，如果不在就选择第一个
    useEffect(() => {
        if (sortedModels.length > 0 && !sortedModels.find(m => m.value === selectedModel)) {
            setSelectedModel(sortedModels[0].value)
        }
    }, [sortedModels, selectedModel])

    // 当模型选择改变时直接更新状态
    const handleModelChange = (newModel: string) => {
        setSelectedModel(newModel)
        setHfTokenizerError(null)
    }

    // 防抖处理文本输入
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            setDebouncedText(text)
        }, 300)

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [text])

    // 加载 Hugging Face tokenizer
    const loadHfTokenizer = async (hubPath: string) => {
        try {
            setIsLoadingHFTokenizer(true)
            setHfTokenizerError(null)
            setLoadingState('preparing')

            // Check cache
            if (tokenizerCache.has(hubPath)) {
                setLoadingState('ready')
                return tokenizerCache.get(hubPath)
            }

            const HFTokenizer = await loadTransformers()
            if (!HFTokenizer) {
                throw new Error('Failed to load Hugging Face Transformers')
            }

            setLoadingState('downloading')
            console.log(`Loading tokenizer: ${hubPath}`)

            setLoadingState('initializing')
            const tokenizer = await HFTokenizer.from_pretrained(hubPath)

            // Cache tokenizer
            setTokenizerCache(prev => new Map(prev).set(hubPath, tokenizer))
            setLoadingState('ready')
            return tokenizer

        } catch (error: any) {
            console.error('Failed to load HF tokenizer:', error)
            setHfTokenizerError(`Failed to load ${hubPath}: ${error.message}`)
            setLoadingState('error')
            return null
        } finally {
            setIsLoadingHFTokenizer(false)
        }
    }

    // js-tiktoken encoding for OpenAI models
    const jsTokenizerEncoding = useMemo(() => {
        if (currentModel.encoding === 'huggingface') {
            return null
        }

        try {
            return encodingForModel(currentModel.encoding as any)
        } catch (error) {
            console.error("Error getting js-tiktoken encoding:", error)
            return null
        }
    }, [currentModel.encoding])

    // Token 计算逻辑
    const tokenData = useMemo(() => {
        if (!debouncedText.trim()) {
            return {
                count: 0,
                tokens: [],
                tokenIds: [],
                isLoading: false
            }
        }

        // OpenAI 模型使用 js-tiktoken
        if (currentModel.encoding !== 'huggingface' && jsTokenizerEncoding) {
            try {
                const tokenIds = jsTokenizerEncoding.encode(debouncedText)
                const tokens = tokenIds.map(id => jsTokenizerEncoding.decode([id]))
                return {
                    count: tokenIds.length,
                    tokens: tokens,
                    tokenIds: tokenIds,
                    isLoading: false
                }
            } catch (error) {
                console.error("Error with js-tiktoken:", error)
            }
        }

        // Hugging Face 模型需要异步加载
        if (currentModel.encoding === 'huggingface' && currentModel.hub) {
            // 检查缓存
            if (tokenizerCache.has(currentModel.hub)) {
                try {
                    const tokenizer = tokenizerCache.get(currentModel.hub)
                    const encoded = tokenizer.encode(debouncedText)
                    const tokens = encoded.map((id: number) => tokenizer.decode([id]))
                    return {
                        count: encoded.length,
                        tokens: tokens,
                        tokenIds: encoded,
                        isLoading: false
                    }
                } catch (error) {
                    console.error("Error using cached HF tokenizer:", error)
                }
            }

            // 触发异步加载
            loadHfTokenizer(currentModel.hub)

            return {
                count: Math.ceil(debouncedText.length / 4), // 估算
                tokens: [],
                tokenIds: [],
                isLoading: true
            }
        }

        // 回退估算
        return {
            count: Math.ceil(debouncedText.length / 4),
            tokens: [],
            tokenIds: [],
            isLoading: false
        }
    }, [debouncedText, currentModel, jsTokenizerEncoding, tokenizerCache])

    const tokenCount = tokenData.count
    const characterCount = text.length
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

    // 记录使用日志
    useEffect(() => {
        if (debouncedText.trim() && tokenCount > 0 && !tokenData.isLoading) {
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
    }, [debouncedText, selectedModel, tokenCount, characterCount, wordCount, language, tokenData.isLoading]);



    // 判断是否正在计算精确值
    const isCalculating = (text !== debouncedText && text.trim().length > 0) ||
        isLoadingHFTokenizer || tokenData.isLoading

    return (
        <Card className="w-full">
            <CardContent className="p-6 space-y-6">
                {/* 模型选择 */}
                <div className="space-y-2">
                    <Label>{tc('model')}</Label>
                    <Select value={selectedModel} onValueChange={handleModelChange}>
                        <SelectTrigger className="text-base">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                            {(() => {
                                const modelGroups = [
                                    {
                                        name: tc('modelGroups.openai'),
                                        bgColor: 'bg-blue-50',
                                        filter: (m: ModelInfo) => m.value.startsWith('gpt-') || m.value.startsWith('text-')
                                    },
                                    {
                                        name: tc('modelGroups.claude'),
                                        bgColor: 'bg-purple-50',
                                        filter: (m: ModelInfo) => m.value.startsWith('claude')
                                    },
                                    {
                                        name: tc('modelGroups.llama'),
                                        bgColor: 'bg-orange-50',
                                        filter: (m: ModelInfo) => m.value.startsWith('llama') || m.value.startsWith('code-llama')
                                    },
                                    {
                                        name: tc('modelGroups.deepseek'),
                                        bgColor: 'bg-gray-50',
                                        filter: (m: ModelInfo) => m.value.startsWith('deepseek')
                                    },
                                    {
                                        name: tc('modelGroups.mistral'),
                                        bgColor: 'bg-indigo-50',
                                        filter: (m: ModelInfo) => m.value.startsWith('mistral') || m.value.startsWith('codestral')
                                    },
                                    {
                                        name: tc('modelGroups.gemini'),
                                        bgColor: 'bg-green-50',
                                        filter: (m: ModelInfo) => m.value.startsWith('gemini')
                                    },
                                    {
                                        name: tc('modelGroups.qwen'),
                                        bgColor: 'bg-yellow-50',
                                        filter: (m: ModelInfo) => m.value.startsWith('qwen')
                                    }
                                ];

                                return modelGroups.map((group, groupIndex) => {
                                    const groupModels = sortedModels.filter(group.filter);
                                    if (groupModels.length === 0) return null; // 不显示空分组

                                    return (
                                        <div key={group.name}>
                                            <div className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide ${group.bgColor}${groupIndex > 0 ? ' mt-1' : ''}`}>
                                                {group.name}
                                            </div>
                                            {groupModels.map((model) => (
                                                <SelectItem key={model.value} value={model.value} className="pl-6 pr-3 py-2.5 cursor-pointer">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="font-medium text-sm">{model.label}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </div>
                                    );
                                }).filter(Boolean); // 过滤掉 null 值
                            })()}
                        </SelectContent>
                    </Select>
                </div>

                {/* 文本输入 */}
                <div className="space-y-2">
                    <Label>{tc('input')}</Label>
                    <Textarea
                        placeholder={tc('inputPlaceholder')}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[120px] text-base"
                    />
                </div>

                {/* 生成示例文本按钮 */}
                <div className="bg-amber-50/50 px-3 py-2 rounded text-center border border-amber-200/50">
                    <button
                        className="px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded text-sm transition-colors font-medium"
                        onClick={() => {
                            setText(tc('exampleText'))
                            setShowTokenBreakdown(true)
                        }}
                    >
                        {t('generateExample')}
                    </button>
                </div>

                {/* 统计结果 */}
                <div className="space-y-2">
                    <Label className="text-base font-semibold">
                        {tc('results')}
                        {isCalculating && (
                            <span className="text-xs text-gray-500 ml-2">
                                ({tc('calculating')})
                            </span>
                        )}
                    </Label>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="text-center">
                                <Label className="text-gray-600 text-xs block mb-1">{tc('tokens')}</Label>
                                <p className={`text-lg font-bold ${isCalculating ? 'text-gray-400' : 'text-blue-600'}`}>
                                    {tokenCount.toLocaleString()}
                                    {isCalculating && <span className="text-xs">*</span>}
                                </p>
                                {hfTokenizerError && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {t('tokenizerError')}
                                    </p>
                                )}
                            </div>
                            <div className="text-center">
                                <Label className="text-gray-600 text-xs block mb-1">{tc('characters')}</Label>
                                <p className="text-lg font-semibold text-green-600">{characterCount.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <Label className="text-gray-600 text-xs block mb-1">{tc('words')}</Label>
                                <p className="text-lg font-semibold text-purple-600">{wordCount.toLocaleString()}</p>
                            </div>
                        </div>
                        {isCalculating && (
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                {currentModel.encoding === 'huggingface' ?
                                    t('loadingTokenizer') :
                                    t('approximateCount')
                                }
                            </p>
                        )}
                    </div>
                </div>

                {/* Token 可视化 - 显示 token 分解 */}
                {text.trim() && tokenData.tokens.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">
                                {t('tokenBreakdown')}
                            </Label>
                            <button
                                onClick={() => setShowTokenBreakdown(!showTokenBreakdown)}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {showTokenBreakdown ? t('hide') : t('show')}
                            </button>
                        </div>

                        {showTokenBreakdown && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                {/* 切换显示模式 */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setTokenDisplayMode('text')}
                                        className={`px-3 py-1 rounded text-sm transition-colors ${tokenDisplayMode === 'text'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {t('text')}
                                    </button>
                                    <button
                                        onClick={() => setTokenDisplayMode('ids')}
                                        className={`px-3 py-1 rounded text-sm transition-colors ${tokenDisplayMode === 'ids'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {t('tokenIds')}
                                    </button>
                                </div>

                                {/* Token 显示区域 */}
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-600 mb-2">
                                        {t('tokensFound', { count: tokenData.tokens.length })}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {tokenData.tokens.map((token: string, index: number) => {
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
                                                    title={t('tokenTooltip', {
                                                        index: index + 1,
                                                        token: token,
                                                        id: tokenData.tokenIds[index]
                                                    })}
                                                >
                                                    {tokenDisplayMode === 'text' ? (
                                                        token.replace(/\s/g, '⎵')
                                                    ) : (
                                                        tokenData.tokenIds[index]
                                                    )}
                                                </span>
                                            )
                                        })}
                                    </div>

                                    <div className="text-xs text-gray-500 mt-3">
                                        <div>
                                            <p>• {t('tokenGuide.colorBlocks')}</p>
                                            <p>• {t('tokenGuide.hover')}</p>
                                            <p>• {t('tokenGuide.spaces')}</p>
                                            <p>• {t('tokenGuide.hfModels')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Hugging Face 模型说明 */}
                {currentModel.encoding === 'huggingface' && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-sm text-purple-800 space-y-2">
                            <div>
                                <p className="font-medium flex items-center gap-2">
                                    <span>🤗</span> {t('hfSection.title')}
                                </p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li><strong>{t('hfSection.localProcessing.title')}</strong> - {t('hfSection.localProcessing.description')}</li>
                                    <li><strong>{t('hfSection.communityTokenizers.title')}</strong> - {t('hfSection.communityTokenizers.description')}</li>
                                    <li><strong>{t('hfSection.tokenBreakdown.title')}</strong> - {t('hfSection.tokenBreakdown.description')}</li>
                                    <li><strong>{t('hfSection.hubModel')}:</strong> {currentModel.hub}</li>
                                    <li>{t('hfSection.firstLoad')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* 使用提示 */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800 space-y-2">
                        <div>
                            <p className="font-medium">{t('usageTips.title')}</p>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                                <li><strong>{t('usageTips.openaiModels')}</strong> - {t('usageTips.nativeJs')}</li>
                                <li><strong>{t('usageTips.hfModels')}</strong> - {t('usageTips.communityTokenizers')}</li>
                                <li><strong>{t('usageTips.warningModels')}</strong> - {t('usageTips.gpt4Estimation')}</li>
                                <li>{t('usageTips.communityAccuracy')}</li>
                                <li>{t('usageTips.localRun')}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {isLoadingHFTokenizer && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t(`loadingStates.${loadingState}`)}</span>
                    </div>
                )}

            </CardContent>
        </Card>
    )
} 