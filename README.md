# Token Sprint - AI 工具集

基于 Next.js 15 + shadcn/ui 构建的现代化 AI 工具集，提供 Token 生成速度可视化和 LLM 显存计算功能。

## 快速开始

\`\`\`bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 在浏览器中打开
# http://localhost:3000
\`\`\`

## 核心功能

- **Token 生成速度可视化器** - 实时体验不同的 token 生成速度对用户体验的影响
- **大模型推理显存计算器** - 计算大语言模型推理所需的 GPU 显存和数量

## 技术栈

- Next.js 15 (App Router)
- React 19 + TypeScript
- shadcn/ui + Tailwind CSS
- 支持中英文双语
- Datadog 日志监控（可选）

## 日志监控（可选）

项目集成了 Datadog 日志监控功能，可以帮助你：

- 监控用户使用情况和计算结果
- 跟踪性能指标和错误信息
- 分析用户行为和使用模式

### 快速配置

1. 创建 `.env.local` 文件
2. 添加你的 Datadog Client Token：
   \`\`\`env
   NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=your_token_here
   \`\`\`
3. 重启开发服务器

详细配置说明请查看 [Datadog 设置指南](./doc/DATADOG_SETUP.md)

### 测试配置

\`\`\`bash
# 运行配置检查脚本
node scripts/test-datadog.js
\`\`\`

> **注意**: 如果不配置 Datadog，应用仍会正常工作，日志将输出到控制台。

## 文档

详细文档请查看 [doc/](./doc/) 目录：

- [项目概述](./doc/README.md)
- [技术架构](./doc/ARCHITECTURE.md)
- [组件设计](./doc/COMPONENTS.md)
- [样式设计](./doc/STYLING.md)
- [开发指南](./doc/DEVELOPMENT.md)
- [Datadog 设置指南](./doc/DATADOG_SETUP.md)
