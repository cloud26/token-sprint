export type Language = "en" | "zh" | "ru" | "ja" | "de"

// 中心化语言配置
export const LANGUAGE_CONFIG = {
  // 支持的语言列表
  SUPPORTED_LANGUAGES: ['en', 'zh', 'ru', 'ja', 'de'] as const,
  
  // 默认语言
  DEFAULT_LANGUAGE: 'en' as const,
  
  // 语言到OpenGraph locale的映射
  LOCALE_MAP: {
    'en': 'en_US',
    'zh': 'zh_CN', 
    'ru': 'ru_RU',
    'ja': 'ja_JP',
    'de': 'de_DE'
  } as const,
  
  // 语言标签（用于UI显示）
  LANGUAGE_LABELS: {
    'en': 'English',
    'zh': '中文',
    'ru': 'Русский', 
    'ja': '日本語',
    'de': 'Deutsch'
  } as const,
  
  // 语言代码到全名的映射
  LANGUAGE_NAMES: {
    'en': 'English',
    'zh': 'Chinese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'de': 'German'
  } as const,
  
  // hreflang 映射
  HREFLANG_MAP: {
    'en': 'en',
    'zh': 'zh-CN',
    'ru': 'ru',
    'ja': 'ja',
    'de': 'de'
  } as const
} as const

// 辅助函数：获取所有语言
export const getAllLanguages = () => LANGUAGE_CONFIG.SUPPORTED_LANGUAGES

// 辅助函数：获取语言的OpenGraph locale
export const getLocaleForLanguage = (lang: Language) => LANGUAGE_CONFIG.LOCALE_MAP[lang]

// 辅助函数：获取语言的hreflang属性
export const getHreflangForLanguage = (lang: Language) => LANGUAGE_CONFIG.HREFLANG_MAP[lang]

// 辅助函数：生成多语言URL映射（用于alternates.languages）
export const generateLanguageAlternates = (baseUrl: string, currentLang?: Language) => {
  const alternates: Record<string, string> = {}
  
  LANGUAGE_CONFIG.SUPPORTED_LANGUAGES.forEach(lang => {
    alternates[getHreflangForLanguage(lang)] = lang === 'en' ? `${baseUrl}/en` : `${baseUrl}/${lang}`
  })
  
  // 添加 x-default
  alternates['x-default'] = `${baseUrl}/en`
  
  return alternates
}

// 辅助函数：获取规范URL
export const getCanonicalUrl = (baseUrl: string, lang: Language) => {
  return lang === 'en' ? baseUrl : `${baseUrl}/${lang}`
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

