import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 通常对应于 `[locale]` 段
  const locale = await requestLocale;
  
  // 验证传入的locale是否受支持
  if (!locale || !routing.locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 