export type Language = "en" | "zh" | "ru" | "ja"

// 中心化语言配置
export const LANGUAGE_CONFIG = {
  // 支持的语言列表
  SUPPORTED_LANGUAGES: ['en', 'zh', 'ru', 'ja'] as const,
  
  // 默认语言
  DEFAULT_LANGUAGE: 'en' as const,
  
  // 语言到OpenGraph locale的映射
  LOCALE_MAP: {
    'en': 'en_US',
    'zh': 'zh_CN', 
    'ru': 'ru_RU',
    'ja': 'ja_JP'
  } as const,
  
  // 语言标签（用于UI显示）
  LANGUAGE_LABELS: {
    'en': 'English',
    'zh': '中文',
    'ru': 'Русский', 
    'ja': '日本語'
  } as const,
  
  // 语言代码到全名的映射
  LANGUAGE_NAMES: {
    'en': 'English',
    'zh': 'Chinese',
    'ru': 'Russian',
    'ja': 'Japanese'
  } as const,
  
  // hreflang 映射
  HREFLANG_MAP: {
    'en': 'en',
    'zh': 'zh-CN',
    'ru': 'ru',
    'ja': 'ja'
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

export const common = {
    backToHome: {
        zh: "返回主页",
        en: "Back to Home"
    },
    languageLabels: {
        zh: "中文",
        en: "English",
        ru: "Русский",
        ja: "日本語"
    }
}

export const home = {
    title: {
        zh: "专业AI开发工具集",
        en: "Professional AI Development Tools"
    },
    description: {
        zh: "精选实用的AI开发与分析工具，助力您的AI项目",
        en: "Curated collection of practical AI development and analysis tools for your projects"
    },
    metadata: {
        title: {
            zh: "专业AI开发工具集 | Token计数器 | GPU计算器 | 免费在线工具",
            en: "AI Development Tools | Token Counter | GPU Calculator"
        },
        description: {
            zh: "免费的专业AI开发工具集，包含智能Token计数器、大模型GPU计算器、AI生成速度体验器等实用工具。助力AI开发者提升效率，优化项目成本。",
            en: "Free professional AI development tools including smart token counter, LLM GPU calculator, and AI generation speed simulator. Essential tools for AI developers to optimize efficiency and project costs."
        }
    }
} 