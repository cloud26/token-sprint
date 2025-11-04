export type Language = "en" | "zh" | "zh-tw" | "ru" | "ja" | "de" | "ar" | "es"

// 中心化语言配置
export const LANGUAGE_CONFIG = {
  // 支持的语言列表
  SUPPORTED_LANGUAGES: ['en', 'zh', 'zh-tw', 'ru', 'ja', 'de', 'ar', 'es'] as const,

  // 默认语言
  DEFAULT_LANGUAGE: 'en' as const,

  // 语言到OpenGraph locale的映射
  LOCALE_MAP: {
    'en': 'en_US',
    'zh': 'zh_CN',
    'zh-tw': 'zh_TW',
    'ru': 'ru_RU',
    'ja': 'ja_JP',
    'de': 'de_DE',
    'ar': 'ar_SA',
    'es': 'es_ES'
  } as const,

  // 语言标签（用于UI显示）
  LANGUAGE_LABELS: {
    'en': 'English',
    'zh': '简体中文',
    'zh-tw': '繁體中文',
    'ru': 'Русский',
    'ja': '日本語',
    'de': 'Deutsch',
    'ar': 'العربية',
    'es': 'Español'
  } as const,

  // 语言代码到全名的映射
  LANGUAGE_NAMES: {
    'en': 'English',
    'zh': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'ru': 'Russian',
    'ja': 'Japanese',
    'de': 'German',
    'ar': 'Arabic',
    'es': 'Spanish'
  } as const,

  // hreflang 映射
  HREFLANG_MAP: {
    'en': 'en',
    'zh': 'zh-CN',
    'zh-tw': 'zh-TW',
    'ru': 'ru',
    'ja': 'ja',
    'de': 'de',
    'ar': 'ar',
    'es': 'es'
  } as const,

  // RTL 语言列表（从右到左）
  RTL_LANGUAGES: ['ar'] as const
} as const

// 辅助函数：获取所有语言
export const getAllLanguages = () => LANGUAGE_CONFIG.SUPPORTED_LANGUAGES

// 辅助函数：获取语言的OpenGraph locale
export const getLocaleForLanguage = (lang: Language) => LANGUAGE_CONFIG.LOCALE_MAP[lang]

// 辅助函数：获取语言的hreflang属性
export const getHreflangForLanguage = (lang: Language) => LANGUAGE_CONFIG.HREFLANG_MAP[lang]

// 辅助函数：获取语言的 HTML lang 属性值
// HTML lang 属性通常使用 ISO 639-1 格式，与 hreflang 略有不同
export const getHtmlLangForLanguage = (lang: Language): string => {
  // HTML lang 属性映射（ISO 639-1 格式）
  const HTML_LANG_MAP: Record<Language, string> = {
    'en': 'en',
    'zh': 'zh-CN',
    'zh-tw': 'zh-TW',
    'ru': 'ru',
    'ja': 'ja',
    'de': 'de',
    'ar': 'ar',
    'es': 'es'
  }
  return HTML_LANG_MAP[lang]
}

// 辅助函数：判断语言是否为 RTL（从右到左）
export const isRtlLanguage = (lang: Language): boolean => {
  return LANGUAGE_CONFIG.RTL_LANGUAGES.includes(lang as any)
}

// 辅助函数：获取语言的文本方向
export const getTextDirection = (lang: Language): 'ltr' | 'rtl' => {
  return isRtlLanguage(lang) ? 'rtl' : 'ltr'
}

// 辅助函数：生成多语言URL映射（用于alternates.languages）
// baseUrl: 基础URL（包含协议和域名），例如 "https://app.linpp2009.com"
// path: 路径（可选），例如 "token-counter-visualizer" 或 "token-counter-visualizer/gpt-4"
// 函数会在域名后、路径前插入语言代码，生成 ${baseUrl}/${lang}/${path}
export const generateLanguageAlternates = (baseUrl: string, path?: string) => {
  const alternates: Record<string, string> = {}

  // 确保 path 格式正确：去除前导斜杠（如果存在），然后添加单个前导斜杠
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : ''

  LANGUAGE_CONFIG.SUPPORTED_LANGUAGES.forEach(lang => {
    // 所有语言都包含语言前缀，包括英语
    // URL 格式：${baseUrl}/${lang}${normalizedPath}
    alternates[getHreflangForLanguage(lang)] = `${baseUrl}/${lang}${normalizedPath}`
  })

  // 添加 x-default
  alternates['x-default'] = `${baseUrl}/en${normalizedPath}`

  return alternates
}

// 辅助函数：获取规范URL
// baseUrl: 基础URL（包含协议和域名），例如 "https://app.linpp2009.com"
// path: 路径（可选），例如 "token-counter-visualizer" 或 "token-counter-visualizer/gpt-4"
// 函数会在域名后、路径前插入语言代码，生成 ${baseUrl}/${lang}/${path}
export const getCanonicalUrl = (baseUrl: string, lang: Language, path?: string) => {
  // 确保 path 格式正确：去除前导斜杠（如果存在），然后添加单个前导斜杠
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : ''

  // 所有语言都包含语言前缀，包括英语
  // URL 格式：${baseUrl}/${lang}${normalizedPath}
  return `${baseUrl}/${lang}${normalizedPath}`
}

export const tools = {
  tokenSpeedVisualizer: {
    path: "token-generation-speed-visualizer"
  },
  llmGpuCalculator: {
    path: "llm-gpu-memory-calculator"
  },
  tokenCounter: {
    path: "token-counter-visualizer"
  }
}

