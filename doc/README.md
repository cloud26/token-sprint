# Token Sprint - AI 工具集

## 项目概述

Token Sprint 是一个专注于 AI 相关工具的 Web 应用程序，主要提供两个核心功能：
1. **Token 生成速度可视化器** - 实时体验不同的 token 生成速度对用户体验的影响
2. **大模型推理显存计算器** - 计算大语言模型推理所需的 GPU 显存和数量

## 技术栈

### 前端框架
- **Next.js 15.2.4** - React 全栈框架，使用 App Router
- **React 19** - 用户界面库
- **TypeScript 5** - 类型安全的 JavaScript

### UI 组件库
- **shadcn/ui** - 基于 Radix UI 和 Tailwind CSS 的组件系统
- **Radix UI** - 无样式、可访问的 UI 组件库（shadcn/ui 的底层依赖）
- **Tailwind CSS 3.4.17** - 实用优先的 CSS 框架
- **Lucide React** - 图标库

### 状态管理与表单
- **React Hook Form 7.54.1** - 高性能表单库
- **Zod 3.24.1** - TypeScript 优先的模式验证

### 样式与动画
- **Tailwind CSS Animate** - Tailwind CSS 动画扩展
- **Class Variance Authority** - 组件变体管理
- **clsx & tailwind-merge** - 条件类名处理

### 数据可视化
- **Recharts 2.15.0** - React 图表库

### 其他功能
- **next-themes** - 主题切换支持
- **date-fns** - 日期处理库
- **Sonner** - Toast 通知组件
- **Embla Carousel** - 轮播组件

### 开发工具
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - CSS 自动前缀
- **pnpm** - 包管理器

## 项目特性

### 🌐 国际化支持
- 支持中文（zh）和英文（en）
- 基于 Next.js App Router 的动态路由实现
- 完整的多语言配置系统

### 🎨 现代化 UI 设计
- 响应式设计，支持移动端和桌面端
- 暗色/亮色主题切换
- 基于 shadcn/ui 的一致性设计系统
- 无障碍访问支持

### ⚡ 性能优化
- Next.js 15 App Router 架构
- 服务端渲染 (SSR)
- 静态生成 (SSG)
- 代码分割和懒加载

### 📊 数据分析
- Vercel Analytics 集成
- Vercel Speed Insights 性能监控
- 用户行为追踪

## 核心功能

### 1. Token 生成速度可视化器
- **路径**: `/[lang]/token-generation-speed-visualizer`
- **功能**: 
  - 模拟不同速度的 token 生成过程
  - 支持中英文文本展示
  - 实时显示生成统计（速度、时间、token 数量）
  - 可调节生成速度（1-50 tokens/秒）
  - 自动滚动到最新生成内容

### 2. 大模型推理显存计算器
- **路径**: `/[lang]/llm-gpu-memory-calculator`
- **功能**:
  - 计算模型推理所需显存
  - 支持多种精度格式（FP32, FP16, FP8, INT8, INT4）
  - 预设主流 GPU 型号选择
  - 预设常见模型参数（DeepSeek-R1, Llama 等）
  - 自动计算所需 GPU 数量
  - 详细的内存分配说明

## 项目结构

```
token-sprint/
├── app/                    # Next.js App Router
│   ├── [lang]/            # 国际化路由
│   │   ├── page.tsx       # 主页（显存计算器）
│   │   ├── layout.tsx     # 语言布局
│   │   ├── llm-gpu-memory-calculator/
│   │   └── token-generation-speed-visualizer/
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── sitemap.ts         # 站点地图
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── token-speed-demo.tsx
│   ├── llm-memory-calculator.tsx
│   ├── side-nav.tsx
│   ├── language-switcher.tsx
│   └── ...
├── config/               # 配置文件
│   ├── languages.ts      # 多语言配置
│   └── calculator.ts     # 计算器文本配置
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具库
├── utils/                # 工具函数
│   ├── calculations.ts   # 计算逻辑
│   └── constants.ts      # 常量定义
├── styles/               # 样式文件
├── public/               # 静态资源
└── doc/                  # 项目文档
```

## 设计理念

### 用户体验优先
- 直观的界面设计
- 实时反馈和交互
- 响应式布局适配各种设备
- 无障碍访问支持

### 性能与可维护性
- TypeScript 确保类型安全
- 组件化架构便于维护
- 配置化的多语言支持
- 清晰的代码结构和命名规范

### 可扩展性
- 模块化的组件设计
- 配置驱动的功能实现
- 易于添加新工具和功能
- 标准化的开发流程

## 部署与运行

### 开发环境
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 环境变量
- `NEXT_PUBLIC_BASE_URL`: 网站基础 URL
- `NODE_ENV`: 运行环境

## 浏览器支持
- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证
MIT License 