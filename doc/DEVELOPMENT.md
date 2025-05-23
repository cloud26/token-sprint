# 开发指南

## 开发环境设置

### 系统要求

- **Node.js**: 18.17.0 或更高版本
- **pnpm**: 8.0.0 或更高版本（推荐）
- **Git**: 2.30.0 或更高版本

### 环境安装

```bash
# 1. 克隆项目
git clone <repository-url>
cd token-sprint

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 在浏览器中打开
# http://localhost:3000
```

### 环境变量配置

创建 `.env.local` 文件：

```bash
# 网站基础 URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 开发环境标识
NODE_ENV=development

# 可选：分析工具配置
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

## 项目结构详解

```
token-sprint/
├── app/                    # Next.js App Router
│   ├── [lang]/            # 国际化路由
│   │   ├── page.tsx       # 主页（显存计算器）
│   │   ├── layout.tsx     # 语言布局
│   │   ├── llm-gpu-memory-calculator/
│   │   │   └── page.tsx   # GPU 计算器页面
│   │   └── token-generation-speed-visualizer/
│   │       └── page.tsx   # Token 可视化器页面
│   ├── api/               # API 路由
│   │   └── log/
│   │       └── route.ts   # 日志记录 API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 根页面（重定向）
│   └── sitemap.ts         # 站点地图
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   └── ...
│   ├── token-speed-demo.tsx      # Token 生成演示组件
│   ├── llm-memory-calculator.tsx # LLM 内存计算器组件
│   ├── side-nav.tsx              # 侧边导航
│   ├── language-switcher.tsx     # 语言切换器
│   ├── theme-provider.tsx        # 主题提供者
│   ├── footer.tsx                # 页脚
│   └── back-to-home.tsx          # 返回主页按钮
├── config/               # 配置文件
│   ├── languages.ts      # 多语言配置
│   └── calculator.ts     # 计算器文本配置
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具库
│   └── utils.ts          # 通用工具函数
├── utils/                # 工具函数
│   ├── calculations.ts   # 计算逻辑
│   └── constants.ts      # 常量定义
├── styles/               # 样式文件
├── public/               # 静态资源
├── doc/                  # 项目文档
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.ts    # Tailwind CSS 配置
├── postcss.config.mjs    # PostCSS 配置
├── next.config.mjs       # Next.js 配置
├── components.json       # shadcn/ui 配置
└── middleware.ts         # Next.js 中间件
```

## 开发流程

### 1. 功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发功能
# - 编写代码
# - 添加测试
# - 更新文档

# 3. 提交代码
git add .
git commit -m "feat: add new feature"

# 4. 推送分支
git push origin feature/new-feature

# 5. 创建 Pull Request
```

### 2. 添加新工具的流程

#### 步骤 1: 配置路由和多语言

```typescript
// config/languages.ts
export const tools = {
  // 现有工具...
  newTool: {
    path: "new-tool",
    title: {
      zh: "新工具",
      en: "New Tool"
    },
    description: {
      zh: "新工具的描述",
      en: "Description of the new tool"
    },
    metadata: {
      title: {
        zh: "新工具 | AI 工具集",
        en: "New Tool | AI Tools"
      },
      description: {
        zh: "新工具的详细描述",
        en: "Detailed description of the new tool"
      }
    }
  }
}
```

#### 步骤 2: 创建页面路由

```bash
# 创建页面目录
mkdir -p app/[lang]/new-tool

# 创建页面文件
touch app/[lang]/new-tool/page.tsx
```

```typescript
// app/[lang]/new-tool/page.tsx
import { use } from "react"
import { tools, type Language } from "@/config/languages"
import { Metadata } from "next"
import { SideNav } from "@/components/side-nav"
import NewToolComponent from "@/components/new-tool"
import LanguageSwitcher from "@/components/language-switcher"
import { Footer } from "@/components/footer"

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }): Promise<Metadata> {
    const { lang } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    return {
        title: tools.newTool.metadata.title[lang],
        description: tools.newTool.metadata.description[lang],
        alternates: {
            canonical: `${baseUrl}/${lang}/new-tool`,
            languages: {
                'en': `${baseUrl}/en/new-tool`,
                'zh': `${baseUrl}/zh/new-tool`,
            },
        },
    }
}

export default function NewToolPage({
    params,
}: {
    params: Promise<{ lang: Language }>
}) {
    const { lang: language } = use(params)

    return (
        <div className="min-h-screen flex flex-col">
            <LanguageSwitcher language={language} className="fixed top-4 right-4 z-50" />
            <SideNav language={language} currentPath={`/${language}/new-tool`} />
            
            <main className="ml-64 flex-1 flex flex-col items-center p-4 pt-2 md:p-8 md:pt-4">
                <div className="w-full max-w-4xl space-y-2 flex-1">
                    <div className="flex flex-col items-center gap-1 mt-8">
                        <h1 className="text-2xl font-bold text-center">
                            {tools.newTool.title[language]}
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            {tools.newTool.description[language]}
                        </p>
                    </div>
                    <NewToolComponent language={language} />
                </div>
                <Footer />
            </main>
        </div>
    )
}
```

#### 步骤 3: 创建组件

```typescript
// components/new-tool.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Language } from '@/config/languages'

interface NewToolProps {
    language: Language
}

export default function NewTool({ language }: NewToolProps) {
    const [state, setState] = useState("")

    return (
        <Card className="p-6">
            <CardContent className="space-y-6">
                {/* 工具内容 */}
                <div className="space-y-4">
                    {/* 实现工具功能 */}
                </div>
            </CardContent>
        </Card>
    )
}
```

### 3. 添加新语言支持

#### 步骤 1: 更新类型定义

```typescript
// config/languages.ts
export type Language = "en" | "zh" | "ja" // 添加新语言
```

#### 步骤 2: 更新所有配置对象

```typescript
export const tools = {
  tokenSpeedVisualizer: {
    title: {
      zh: "Token 生成速度可视化",
      en: "Token Generation Speed Visualizer",
      ja: "トークン生成速度可視化" // 添加日语翻译
    }
    // ... 其他配置
  }
}
```

#### 步骤 3: 更新中间件

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh', 'ja'] // 添加新语言

export function middleware(request: NextRequest) {
  // 检查路径中是否已包含支持的语言
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 如果缺少语言前缀，重定向到默认语言
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/zh${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

## 代码规范

### TypeScript 规范

```typescript
// 1. 使用明确的类型定义
interface ComponentProps {
  title: string
  description?: string
  onAction: (id: string) => void
}

// 2. 使用联合类型而非枚举
type Status = "loading" | "success" | "error"

// 3. 使用泛型提高复用性
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// 4. 导出类型定义
export type { ComponentProps, Status, ApiResponse }
```

### React 组件规范

```typescript
// 1. 使用函数组件和 Hooks
export default function MyComponent({ title, onAction }: ComponentProps) {
  const [state, setState] = useState<string>("")
  
  // 2. 使用 useCallback 优化性能
  const handleClick = useCallback((id: string) => {
    onAction(id)
  }, [onAction])
  
  // 3. 早期返回处理边界情况
  if (!title) {
    return <div>No title provided</div>
  }
  
  return (
    <div className="component-container">
      <h1>{title}</h1>
      <button onClick={() => handleClick("test")}>
        Action
      </button>
    </div>
  )
}
```

### CSS/Tailwind 规范

```typescript
// 1. 使用 cn 函数合并类名
import { cn } from "@/lib/utils"

const Button = ({ className, variant, ...props }) => {
  return (
    <button
      className={cn(
        "base-button-classes",
        variant === "primary" && "primary-variant-classes",
        className
      )}
      {...props}
    />
  )
}

// 2. 按逻辑分组类名
<div className={cn(
  // 布局
  "flex items-center justify-between",
  // 间距
  "p-4 m-2",
  // 样式
  "bg-white border rounded-lg shadow-sm",
  // 状态
  "hover:shadow-md focus:outline-none",
  // 响应式
  "md:p-6 lg:p-8"
)}>
```

### 文件命名规范

```
# 组件文件
components/
├── ui/
│   ├── button.tsx          # kebab-case
│   ├── input-field.tsx
│   └── data-table.tsx
├── business/
│   ├── user-profile.tsx
│   └── order-summary.tsx

# 页面文件
app/
├── [lang]/
│   ├── page.tsx           # Next.js 约定
│   ├── layout.tsx
│   └── loading.tsx

# 工具文件
utils/
├── calculations.ts        # kebab-case
├── api-helpers.ts
└── date-formatters.ts

# 配置文件
config/
├── languages.ts          # kebab-case
├── database.ts
└── auth-config.ts
```

### Git 提交规范

```bash
# 提交消息格式
<type>(<scope>): <description>

# 类型
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式调整
refactor: 代码重构
test:     测试相关
chore:    构建过程或辅助工具的变动

# 示例
feat(calculator): add GPU memory calculation
fix(ui): resolve button hover state issue
docs(readme): update installation instructions
style(components): format code with prettier
refactor(utils): extract common validation logic
test(calculator): add unit tests for memory calculation
chore(deps): update dependencies to latest versions
```

## 测试策略

### 单元测试

```typescript
// __tests__/utils/calculations.test.ts
import { calculateInferenceMemory } from '@/utils/calculations'

describe('calculateInferenceMemory', () => {
  it('should calculate memory correctly for FP16 precision', () => {
    const result = calculateInferenceMemory(7, 'FP16', 80)
    
    expect(result.modelMemory).toBe(14)
    expect(result.inferenceMemory).toBe(21)
    expect(result.totalMemory).toBe(35)
  })

  it('should handle edge cases', () => {
    const result = calculateInferenceMemory(0, 'FP32', 80)
    
    expect(result.modelMemory).toBe(0)
    expect(result.requiredGPUs).toBe(0)
  })
})
```

### 组件测试

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })
})
```

### E2E 测试

```typescript
// e2e/calculator.spec.ts
import { test, expect } from '@playwright/test'

test('LLM memory calculator works correctly', async ({ page }) => {
  await page.goto('/zh/llm-gpu-memory-calculator')
  
  // 输入参数
  await page.fill('[data-testid="parameters-input"]', '7')
  await page.selectOption('[data-testid="precision-select"]', 'FP16')
  
  // 检查计算结果
  await expect(page.locator('[data-testid="model-memory"]')).toContainText('14 GB')
  await expect(page.locator('[data-testid="inference-memory"]')).toContainText('21 GB')
})
```

## 性能优化

### 代码分割

```typescript
// 动态导入大型组件
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 图片优化

```typescript
// 使用 Next.js Image 组件
import Image from 'next/image'

function MyComponent() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // 首屏图片
      placeholder="blur" // 模糊占位符
    />
  )
}
```

### 缓存策略

```typescript
// API 路由缓存
// app/api/data/route.ts
export async function GET() {
  const data = await fetchData()
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

## 部署指南

### 构建优化

```bash
# 1. 安装依赖
pnpm install --frozen-lockfile

# 2. 构建项目
pnpm build

# 3. 启动生产服务器
pnpm start
```

### 环境变量

```bash
# 生产环境变量
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Vercel 部署

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["hkg1", "sfo1"]
}
```

## 故障排除

### 常见问题

#### 1. 依赖安装失败

```bash
# 清除缓存
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml

# 重新安装
pnpm install
```

#### 2. TypeScript 类型错误

```bash
# 重新生成类型
pnpm tsc --noEmit

# 检查 tsconfig.json 配置
```

#### 3. 样式不生效

```bash
# 检查 Tailwind CSS 配置
# 确保 content 路径正确
# 重启开发服务器
```

#### 4. 路由问题

```bash
# 检查 middleware.ts 配置
# 确认语言路由设置正确
# 检查 app 目录结构
```

### 调试工具

```typescript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', { state, props })
}

// React DevTools
// Next.js DevTools
// Tailwind CSS IntelliSense
```

## 贡献指南

### 提交 PR 前检查清单

- [ ] 代码符合项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 通过了所有测试
- [ ] 没有引入新的 linting 错误
- [ ] 提交消息符合规范

### 代码审查要点

- 功能是否正确实现
- 代码是否易于理解和维护
- 性能是否有优化空间
- 是否遵循了项目规范
- 测试覆盖率是否足够
- 文档是否完整准确 