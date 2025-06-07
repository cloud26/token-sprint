import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export function useCurrentLocale() {
  return useLocale();
}

// 导出路由配置
export { routing };

// 工具路径映射
export const TOOL_PATHS = {
  tokenSpeedVisualizer: "token-generation-speed-visualizer",
  llmGpuCalculator: "llm-gpu-memory-calculator", 
  tokenCounter: "token-counter-visualizer"
} as const;

export type ToolPath = keyof typeof TOOL_PATHS; 