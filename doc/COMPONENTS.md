# 组件设计文档

## 组件架构概览

Token Sprint 采用分层的组件架构，从底层的 UI 基础组件到顶层的页面组件，确保代码的可维护性和可复用性。

## 组件分层

```
页面组件 (Pages)
    ↓
布局组件 (Layouts)
    ↓
业务组件 (Business Components)
    ↓
UI 基础组件 (UI Components)
    ↓
原子组件 (Primitives)
```

## UI 基础组件层

### 设计原则
- 基于 shadcn/ui（内置 Radix UI）
- 无业务逻辑，纯 UI 展示
- 高度可定制和可复用
- 支持主题和变体

### 核心组件

#### Button 组件
```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

**特性**:
- 支持多种视觉变体
- 可作为其他元素的容器 (asChild)
- 完整的可访问性支持
- TypeScript 类型安全

#### Card 组件
```typescript
// components/ui/card.tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
)

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
```

**组合模式**:
- Card + CardHeader + CardContent + CardFooter
- 灵活的内容组织
- 一致的视觉样式

#### Input 组件
```typescript
// components/ui/input.tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 复合组件

#### Select 组件
```typescript
// components/ui/select.tsx
const Select = SelectPrimitive.Root
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </SelectPrimitive.Trigger>
))
```

**使用示例**:
```typescript
<Select value={precision} onValueChange={setPrecision}>
  <SelectTrigger className="text-lg">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {precisions.map((p) => (
      <SelectItem key={p.value} value={p.value}>
        {p.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## 业务组件层

### 设计原则
- 包含具体的业务逻辑
- 组合多个 UI 组件
- 处理状态管理和用户交互
- 可配置和可扩展

### 核心业务组件

#### TokenSpeedDemo 组件

**功能**: Token 生成速度可视化演示

**状态管理**:
```typescript
const [speed, setSpeed] = useState<number>(5)
const [language, setLanguage] = useState<"en" | "zh">(initialLanguage)
const [isGenerating, setIsGenerating] = useState<boolean>(false)
const [generatedText, setGeneratedText] = useState<string>("")
const [elapsedTime, setElapsedTime] = useState<number>(0)
const [tokenCount, setTokenCount] = useState<number>(0)
```

**核心逻辑**:
```typescript
// Token 生成逻辑
const generateTokens = () => {
  if (positionRef.current < tokensRef.current.length) {
    const displayText = displayTextRef.current[positionRef.current]
    setGeneratedText((prev) => prev + displayText)
    setTokenCount((prev) => prev + 1)
    positionRef.current += 1
    setElapsedTime((Date.now() - startTimeRef.current) / 1000)
    setTimeout(scrollToBottom, 0)
  } else {
    // 生成完成
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsGenerating(false)
  }
}
```

**组件结构**:
```typescript
return (
  <div className="space-y-6">
    {/* 控制面板 */}
    <Card className="p-6">
      <CardContent className="space-y-4">
        {/* 速度控制 */}
        <div className="space-y-2">
          <Label>生成速度: {speed} tokens/秒</Label>
          <Slider
            value={[speed]}
            onValueChange={handleSpeedChange}
            max={50}
            min={1}
            step={1}
          />
        </div>
        
        {/* 语言切换 */}
        <div className="flex gap-2">
          <Button
            variant={language === "zh" ? "default" : "outline"}
            onClick={() => setLanguage("zh")}
          >
            中文
          </Button>
          <Button
            variant={language === "en" ? "default" : "outline"}
            onClick={() => setLanguage("en")}
          >
            English
          </Button>
        </div>
        
        {/* 控制按钮 */}
        <Button onClick={toggleGeneration} className="w-full">
          {isGenerating ? "停止生成" : "开始生成"}
        </Button>
      </CardContent>
    </Card>

    {/* 文本显示区域 */}
    <Card className="p-6">
      <CardContent>
        <div
          ref={textContainerRef}
          className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-gray-50 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap"
        >
          {generatedText}
          {isGenerating && <span className="animate-pulse">|</span>}
        </div>
      </CardContent>
    </Card>

    {/* 统计信息 */}
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4">
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-blue-600">{speed}</div>
          <div className="text-sm text-gray-600">tokens/秒</div>
        </CardContent>
      </Card>
      <Card className="p-4">
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-green-600">{tokenCount}</div>
          <div className="text-sm text-gray-600">已生成 tokens</div>
        </CardContent>
      </Card>
      <Card className="p-4">
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-purple-600">{elapsedTime.toFixed(1)}s</div>
          <div className="text-sm text-gray-600">已用时间</div>
        </CardContent>
      </Card>
    </div>
  </div>
)
```

#### LLMMemoryCalculator 组件

**功能**: 大模型推理显存计算

**状态管理**:
```typescript
const [parameters, setParameters] = useState<string>("671")
const [precision, setPrecision] = useState<string>("FP8")
const [gpuModel, setGpuModel] = useState<string>("NVIDIA H100")
const [selectedModel, setSelectedModel] = useState<string>("DeepSeek-R1")
```

**计算逻辑**:
```typescript
const selectedGpu = gpuModels.find((gpu) => `${gpu.name} (${gpu.memory}GB)` === gpuModel)
const gpuMemory = selectedGpu ? selectedGpu.memory : 80
const memory = calculateInferenceMemory(Number(parameters), precision, gpuMemory)
```

**表单验证**:
```typescript
const handleParameterChange = (value: string) => {
  setParameters(value.replace(/[^0-9.]/g, ""))
}
```

### 布局组件

#### SideNav 组件

**功能**: 侧边导航栏

```typescript
interface SideNavProps {
  language: Language
  currentPath: string
}

export function SideNav({ language, currentPath }: SideNavProps) {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{home.title[language]}</h2>
        
        <div className="space-y-2">
          {Object.values(tools).map((tool) => (
            <Link
              key={tool.path}
              href={`/${language}/${tool.path}`}
              className={cn(
                "block p-3 rounded-lg transition-colors",
                currentPath.includes(tool.path)
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              )}
            >
              <div className="font-medium">{tool.title[language]}</div>
              <div className="text-sm text-gray-600">{tool.description[language]}</div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
```

#### LanguageSwitcher 组件

**功能**: 语言切换器

```typescript
interface LanguageSwitcherProps {
  language: Language
  className?: string
}

export default function LanguageSwitcher({ language, className }: LanguageSwitcherProps) {
  const pathname = usePathname()
  
  const switchLanguage = (newLang: Language) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {(['zh', 'en'] as Language[]).map((lang) => (
        <Button
          key={lang}
          variant={language === lang ? "default" : "outline"}
          size="sm"
          onClick={() => switchLanguage(lang)}
        >
          {common.languageLabels[lang]}
        </Button>
      ))}
    </div>
  )
}
```

## 组件设计模式

### 1. 组合模式 (Composition Pattern)

**Card 组件系列**:
```typescript
// 基础组件
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述</CardDescription>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
  <CardFooter>
    底部操作
  </CardFooter>
</Card>
```

### 2. 渲染属性模式 (Render Props Pattern)

**Tooltip 组件**:
```typescript
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>提示内容</p>
  </TooltipContent>
</Tooltip>
```

### 3. 高阶组件模式 (HOC Pattern)

**forwardRef 包装**:
```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
```

### 4. 受控/非受控组件模式

**Select 组件**:
```typescript
// 受控模式
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="选择选项" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">选项1</SelectItem>
  </SelectContent>
</Select>

// 非受控模式
<Select defaultValue="option1">
  {/* ... */}
</Select>
```

## 样式设计系统

### CSS 变量系统

```css
:root {
  /* 颜色系统 */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  
  /* 间距系统 */
  --radius: 0.5rem;
}
```

### 组件变体系统

```typescript
// 使用 class-variance-authority
const buttonVariants = cva(
  // 基础样式
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
```

## 可访问性设计

### ARIA 属性
```typescript
<button
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-labelledby="select-label"
  role="combobox"
>
  选择选项
</button>
```

### 键盘导航
```typescript
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      toggleOpen()
      break
    case 'Escape':
      setOpen(false)
      break
  }
}
```

### 焦点管理
```typescript
useEffect(() => {
  if (isOpen && triggerRef.current) {
    triggerRef.current.focus()
  }
}, [isOpen])
```

## 性能优化

### React.memo 优化
```typescript
const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* 复杂渲染逻辑 */}</div>
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id
})
```

### useCallback 优化
```typescript
const handleClick = useCallback((id: string) => {
  // 处理点击事件
}, [dependency])
```

### 懒加载组件
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## 测试策略

### 组件单元测试
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 可访问性测试
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should not have any accessibility violations', async () => {
  const { container } = render(<Button>Accessible button</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
``` 