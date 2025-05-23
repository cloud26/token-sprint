# 技术架构文档

## 架构概览

Token Sprint 采用现代化的前端架构，基于 Next.js 15 App Router 构建，遵循组件化、模块化的设计原则。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                              │
├─────────────────────────────────────────────────────────────┤
│  Components (React 组件)                                     │
│  ├── UI Components (shadcn/ui 组件)                        │
│  ├── Business Components (功能组件)                         │
│  └── Layout Components (布局组件)                           │
├─────────────────────────────────────────────────────────────┤
│  App Router (Next.js 15)                                   │
│  ├── [lang] (国际化路由)                                     │
│  ├── API Routes (服务端 API)                               │
│  └── Middleware (中间件)                                    │
├─────────────────────────────────────────────────────────────┤
│  Utils & Config (工具层)                                    │
│  ├── Calculations (计算逻辑)                                │
│  ├── Constants (常量定义)                                   │
│  ├── Languages (多语言配置)                                 │
│  └── Hooks (自定义 Hooks)                                  │
├─────────────────────────────────────────────────────────────┤
│  Styling (样式层)                                           │
│  ├── Tailwind CSS (原子化 CSS)                             │
│  ├── CSS Variables (主题变量)                              │
│  └── Component Variants (组件变体)                         │
└─────────────────────────────────────────────────────────────┘
```

## 核心架构决策

### 1. Next.js App Router 选择

**决策**: 使用 Next.js 15 App Router 而非 Pages Router

**原因**:
- 更好的性能优化（流式渲染、并行路由）
- 原生支持服务端组件
- 更灵活的布局系统
- 更好的 TypeScript 集成
- 面向未来的架构

**实现**:
```typescript
// app/[lang]/layout.tsx - 语言级别布局
export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Language }
}) {
  return <>{children}</>
}
```

### 2. 国际化架构

**决策**: 基于动态路由的国际化实现

**架构**:
```
/[lang]/                           # 语言根路径
├── page.tsx                       # 主页
├── token-generation-speed-visualizer/
│   └── page.tsx                   # Token 可视化器
└── llm-gpu-memory-calculator/
    └── page.tsx                   # GPU 计算器
```

**配置系统**:
```typescript
// config/languages.ts
export type Language = "en" | "zh"

export const tools = {
  tokenSpeedVisualizer: {
    path: "token-generation-speed-visualizer",
    title: {
      zh: "Token 生成速度可视化",
      en: "Token Generation Speed Visualizer"
    }
  }
}
```

### 3. 组件架构

**分层设计**:

1. **UI 基础组件层** (`components/ui/`)
   - 基于 shadcn/ui（内置 Radix UI）
   - 无业务逻辑的纯 UI 组件
   - 高度可复用和可定制

2. **业务组件层** (`components/`)
   - 包含业务逻辑的功能组件
   - 组合多个 UI 组件
   - 处理状态管理和用户交互

3. **布局组件层**
   - 页面级别的布局组件
   - 导航和通用 UI 元素

**示例**:
```typescript
// 业务组件
export default function TokenSpeedDemo({ initialLanguage }: Props) {
  // 业务逻辑
  const [speed, setSpeed] = useState<number>(5)
  
  return (
    <Card className="p-6">
      <CardContent>
        {/* UI 组件组合 */}
        <Slider value={[speed]} onValueChange={handleSpeedChange} />
        <Button onClick={toggleGeneration}>
          {isGenerating ? "停止" : "开始"}
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 4. 状态管理策略

**决策**: 使用 React 内置状态管理 + 自定义 Hooks

**原因**:
- 应用状态相对简单
- 避免过度工程化
- 更好的性能和包大小

**实现模式**:
```typescript
// 组件内状态
const [speed, setSpeed] = useState<number>(5)
const [isGenerating, setIsGenerating] = useState<boolean>(false)

// 复杂逻辑抽取到自定义 Hook
const useTokenGeneration = (speed: number) => {
  // 复杂的生成逻辑
}
```

### 5. 样式架构

**决策**: Tailwind CSS + CSS-in-JS 混合方案

**架构**:
```
styles/
├── globals.css              # 全局样式和 CSS 变量
├── components.css           # 组件特定样式
└── utilities.css            # 工具类扩展
```

**主题系统**:
```css
/* CSS 变量定义 */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

**组件变体管理**:
```typescript
// 使用 class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    }
  }
)
```

## 性能优化策略

### 1. 代码分割

- **路由级别分割**: 每个页面自动分割
- **组件级别分割**: 大型组件使用动态导入
- **第三方库分割**: 按需加载重型依赖

### 2. 渲染优化

- **服务端渲染**: 首屏快速加载
- **静态生成**: 预构建静态页面
- **流式渲染**: 渐进式内容加载

### 3. 资源优化

- **图片优化**: Next.js Image 组件
- **字体优化**: 本地字体文件
- **CSS 优化**: Tailwind CSS 的 PurgeCSS

## 数据流架构

### 1. 组件间通信

```typescript
// 父子组件通信
<TokenSpeedDemo 
  initialLanguage={language}
  onSpeedChange={handleSpeedChange}
/>

// 兄弟组件通信（通过共同父组件）
const [globalState, setGlobalState] = useState()
```

### 2. API 数据流

```typescript
// API 路由
// app/api/log/route.ts
export async function POST(request: Request) {
  const data = await request.json()
  // 处理数据
  return Response.json({ success: true })
}

// 客户端调用
const logCalculation = async () => {
  await fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
```

## 错误处理架构

### 1. 错误边界

```typescript
// app/error.tsx - 全局错误处理
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### 2. 表单验证

```typescript
// 使用 Zod + React Hook Form
const schema = z.object({
  parameters: z.string().min(1, "参数不能为空")
})

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
})
```

## 测试架构

### 1. 单元测试
- Jest + React Testing Library
- 组件测试和工具函数测试

### 2. 集成测试
- Playwright 端到端测试
- API 路由测试

### 3. 类型检查
- TypeScript 严格模式
- 编译时类型检查

## 部署架构

### 1. 构建优化
```json
// next.config.mjs
export default {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}
```

### 2. 环境配置
- 开发环境：本地开发服务器
- 生产环境：Vercel 部署
- 环境变量管理

## 可扩展性设计

### 1. 新工具添加
1. 在 `config/languages.ts` 添加工具配置
2. 创建对应的页面路由
3. 实现业务组件
4. 更新导航菜单

### 2. 新语言支持
1. 在 `Language` 类型中添加新语言
2. 更新所有配置文件的语言对象
3. 添加对应的翻译内容

### 3. 新功能模块
- 遵循现有的目录结构
- 使用统一的组件模式
- 保持配置驱动的设计