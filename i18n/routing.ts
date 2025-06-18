import { LANGUAGE_CONFIG } from '@/config/languages';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 支持的语言列表
  // locales: ['en', 'zh', 'ru', 'ja', 'de'],
  locales: LANGUAGE_CONFIG.SUPPORTED_LANGUAGES,
  // 默认语言
  defaultLocale: LANGUAGE_CONFIG.DEFAULT_LANGUAGE
}); 