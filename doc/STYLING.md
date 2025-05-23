# 样式设计文档

## 设计系统概览

Token Sprint 采用现代化的设计系统，基于 Tailwind CSS 和 CSS 变量构建，支持主题切换和响应式设计。

## 技术栈

### 核心技术
- **Tailwind CSS 3.4.17** - 原子化 CSS 框架
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - 自动添加浏览器前缀
- **CSS Variables** - 动态主题变量
- **Class Variance Authority** - 组件变体管理

### 设计工具
- **shadcn/ui** - 设计系统基础
- **Radix UI** - 无样式组件库
- **Lucide React** - 图标系统

## 颜色系统

### 主色调定义

```css
/* app/globals.css */
:root {
  /* 背景色 */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  /* 卡片 */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  
  /* 弹出层 */
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  
  /* 主色 */
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  
  /* 次要色 */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  
  /* 静音色 */
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  /* 强调色 */
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  
  /* 破坏性操作 */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  
  /* 边框 */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  
  /* 焦点环 */
  --ring: 222.2 84% 4.9%;
  
  /* 圆角 */
  --radius: 0.5rem;
}
```

### 暗色主题

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  
  --ring: 212.7 26.8% 83.9%;
}
```

### 语义化颜色

```css
/* 功能性颜色 */
:root {
  /* 成功 */
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  
  /* 警告 */
  --warning: 32.5 94.6% 43.7%;
  --warning-foreground: 355.7 100% 97.3%;
  
  /* 信息 */
  --info: 221.2 83.2% 53.3%;
  --info-foreground: 210 40% 98%;
  
  /* 错误 */
  --error: 0 84.2% 60.2%;
  --error-foreground: 210 40% 98%;
}
```

## 字体系统

### 字体族定义

```css
/* 系统字体栈 */
.font-sans {
  font-family: 
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
}

/* 等宽字体 */
.font-mono {
  font-family: 
    ui-monospace,
    SFMono-Regular,
    "SF Mono",
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
}
```

### 字体大小规范

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    }
  }
}
```

### 字重系统

```css
.font-thin { font-weight: 100; }
.font-extralight { font-weight: 200; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
.font-black { font-weight: 900; }
```

## 间距系统

### 基础间距

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    spacing: {
      px: '1px',
      0: '0px',
      0.5: '0.125rem',  // 2px
      1: '0.25rem',     // 4px
      1.5: '0.375rem',  // 6px
      2: '0.5rem',      // 8px
      2.5: '0.625rem',  // 10px
      3: '0.75rem',     // 12px
      3.5: '0.875rem',  // 14px
      4: '1rem',        // 16px
      5: '1.25rem',     // 20px
      6: '1.5rem',      // 24px
      7: '1.75rem',     // 28px
      8: '2rem',        // 32px
      9: '2.25rem',     // 36px
      10: '2.5rem',     // 40px
      11: '2.75rem',    // 44px
      12: '3rem',       // 48px
      14: '3.5rem',     // 56px
      16: '4rem',       // 64px
      20: '5rem',       // 80px
      24: '6rem',       // 96px
      28: '7rem',       // 112px
      32: '8rem',       // 128px
      36: '9rem',       // 144px
      40: '10rem',      // 160px
      44: '11rem',      // 176px
      48: '12rem',      // 192px
      52: '13rem',      // 208px
      56: '14rem',      // 224px
      60: '15rem',      // 240px
      64: '16rem',      // 256px
      72: '18rem',      // 288px
      80: '20rem',      // 320px
      96: '24rem',      // 384px
    }
  }
}
```

### 语义化间距

```css
/* 组件内部间距 */
.space-component-xs { gap: 0.25rem; }  /* 4px */
.space-component-sm { gap: 0.5rem; }   /* 8px */
.space-component-md { gap: 0.75rem; }  /* 12px */
.space-component-lg { gap: 1rem; }     /* 16px */
.space-component-xl { gap: 1.5rem; }   /* 24px */

/* 布局间距 */
.space-layout-xs { gap: 1rem; }        /* 16px */
.space-layout-sm { gap: 1.5rem; }      /* 24px */
.space-layout-md { gap: 2rem; }        /* 32px */
.space-layout-lg { gap: 3rem; }        /* 48px */
.space-layout-xl { gap: 4rem; }        /* 64px */
```

## 圆角系统

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0.125rem',    // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem',    // 6px
      lg: '0.5rem',      // 8px
      xl: '0.75rem',     // 12px
      '2xl': '1rem',     // 16px
      '3xl': '1.5rem',   // 24px
      full: '9999px',
    }
  }
}
```

## 阴影系统

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    boxShadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: 'none',
    }
  }
}
```

## 组件变体系统

### Button 变体

```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

### Card 变体

```typescript
// components/ui/card.tsx
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-md",
        outlined: "border-2",
        filled: "bg-muted",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## 响应式设计

### 断点系统

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // 小屏幕
      'md': '768px',   // 中等屏幕
      'lg': '1024px',  // 大屏幕
      'xl': '1280px',  // 超大屏幕
      '2xl': '1536px', // 超超大屏幕
    }
  }
}
```

### 响应式工具类

```css
/* 移动优先的响应式设计 */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}
```

### 响应式组件示例

```typescript
// 响应式导航栏
<nav className="
  fixed left-0 top-0 h-full w-64 
  bg-white border-r border-gray-200 
  p-6
  md:block hidden
">
  {/* 桌面端导航 */}
</nav>

<nav className="
  fixed bottom-0 left-0 right-0 
  bg-white border-t border-gray-200 
  p-4
  md:hidden block
">
  {/* 移动端导航 */}
</nav>
```

## 动画系统

### 基础动画

```css
/* app/globals.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 工具类 */
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### 过渡效果

```css
/* 通用过渡 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

## 主题切换系统

### 主题提供者

```typescript
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 主题切换组件

```typescript
// components/theme-toggle.tsx
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

## 自定义样式

### 全局样式

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
  
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-muted;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }
}

@layer components {
  /* 自定义组件样式 */
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90 
           px-4 py-2 rounded-md font-medium transition-colors
           focus-visible:outline-none focus-visible:ring-2 
           focus-visible:ring-ring focus-visible:ring-offset-2;
  }
  
  .card-elevated {
    @apply bg-card text-card-foreground rounded-lg border shadow-lg;
  }
  
  .input-field {
    @apply flex h-10 w-full rounded-md border border-input 
           bg-background px-3 py-2 text-sm ring-offset-background 
           placeholder:text-muted-foreground 
           focus-visible:outline-none focus-visible:ring-2 
           focus-visible:ring-ring focus-visible:ring-offset-2 
           disabled:cursor-not-allowed disabled:opacity-50;
  }
}

@layer utilities {
  /* 自定义工具类 */
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 组件特定样式

```css
/* Token 生成器特定样式 */
.token-display {
  @apply min-h-[400px] max-h-[600px] overflow-y-auto 
         p-4 bg-muted rounded-lg font-mono text-sm 
         leading-relaxed whitespace-pre-wrap;
}

.token-cursor {
  @apply animate-pulse;
}

/* 计算器特定样式 */
.calculator-result {
  @apply bg-muted/50 p-4 rounded-lg space-y-3;
}

.result-item {
  @apply space-y-1;
}

.result-label {
  @apply text-muted-foreground text-sm;
}

.result-value {
  @apply text-xl font-semibold;
}
```

## 打印样式

```css
/* 打印样式 */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  body {
    @apply text-black bg-white;
  }
  
  .card {
    @apply border border-gray-300 shadow-none;
  }
  
  .button {
    @apply border border-gray-300 bg-white text-black;
  }
}
```

## 性能优化

### CSS 优化

```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 启用 JIT 模式
  mode: 'jit',
  // 清除未使用的样式
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
  },
}
```

### 关键 CSS 内联

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
```

## 可访问性样式

### 焦点样式

```css
/* 高对比度焦点环 */
.focus-visible\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* 跳过链接 */
.skip-link {
  @apply absolute -top-10 left-4 z-50 bg-primary text-primary-foreground 
         px-4 py-2 rounded-md font-medium transition-all
         focus:top-4;
}
```

### 高对比度模式

```css
@media (prefers-contrast: high) {
  :root {
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 0 0% 20%;
  }
  
  .dark {
    --border: 0 0% 80%;
    --input: 0 0% 80%;
    --ring: 0 0% 80%;
  }
}
```

### 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
``` 