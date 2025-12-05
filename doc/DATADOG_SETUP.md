# Datadog 日志集成设置指南

本文档介绍如何在 Token Sprint 项目中配置 Datadog 日志上报功能。

## 1. 获取 Datadog Client Token

1. 登录到你的 Datadog 账户
2. 导航到 **Organization Settings** > **Client Tokens**
3. 创建一个新的 Client Token 或使用现有的
4. 复制 Client Token 值

## 2. 环境变量配置

在你的项目根目录创建 `.env.local` 文件（如果不存在），并添加以下环境变量：

\`\`\`env
# Datadog Configuration
# 必需：从 Datadog 获取的 Client Token
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=your_datadog_client_token_here

# 可选：Datadog 站点配置（默认为 datadoghq.com）
NEXT_PUBLIC_DATADOG_SITE=datadoghq.com

# 可选：应用版本号
NEXT_PUBLIC_APP_VERSION=0.1.0
\`\`\`

### Datadog 站点选项

根据你的 Datadog 账户所在区域，选择合适的站点：

- **US1**: `datadoghq.com` (默认)
- **EU**: `datadoghq.eu`
- **US3**: `us3.datadoghq.com`
- **US5**: `us5.datadoghq.com`
- **AP1**: `ap1.datadoghq.com`
- **GOV**: `ddog-gov.com`

## 3. 功能特性

### 自动日志上报

当配置了 Datadog Client Token 后，系统会自动将以下日志发送到 Datadog：

- **LLM GPU 内存计算日志**：包含模型配置、计算结果、性能分析等
- **API 请求日志**：记录服务器端的请求处理情况
- **错误日志**：系统错误和异常信息

系统使用 Datadog HTTP API 直接发送日志，适用于 Next.js API 路由和服务器端组件。

### 日志结构

所有日志都包含以下标准字段：

\`\`\`json
{
  "message": "日志消息",
  "level": "info|warn|error|debug",
  "service": "token-sprint",
  "env": "development|production",
  "version": "0.1.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "tags": ["model:llama2", "precision:fp16", "locale:en"],
  "context": {
    "calculationType": "llm-gpu-memory",
    "parameters": {...},
    "results": {...}
  }
}
\`\`\`

### 特殊标签

系统会自动添加以下标签以便于日志分析：

- `calculation_type`: 计算类型（llm-gpu-memory, token-counter, token-generation-speed）
- `model`: 使用的模型名称
- `precision`: 精度类型（fp16, fp32, int8, int4）
- `gpu`: GPU 型号
- `locale`: 用户语言设置

## 4. 开发和调试

### 本地开发

在本地开发时，如果没有配置 Datadog Client Token，系统会：

1. 在控制台显示警告信息
2. 将所有日志输出到浏览器控制台
3. 不会影响应用的正常功能

### 日志级别

系统支持以下日志级别：

- `DEBUG`: 详细的调试信息
- `INFO`: 一般信息日志
- `WARN`: 警告信息
- `ERROR`: 错误信息

### 测试配置

要测试 Datadog 集成是否正常工作：

1. **检查配置**：运行配置检查脚本
   \`\`\`bash
   pnpm test:datadog
   \`\`\`

2. **启动开发服务器**
   \`\`\`bash
   pnpm dev
   \`\`\`

3. **测试日志功能**：
   - 在浏览器中打开应用
   - 使用 LLM GPU 内存计算器进行一次计算
   - 检查服务器控制台输出
   - 在 Datadog 控制台中查看日志是否出现

## 5. 生产环境配置

### Vercel 部署

如果使用 Vercel 部署，在 Vercel 控制台中添加环境变量：

1. 进入项目设置
2. 导航到 **Environment Variables**
3. 添加以下变量：
   - `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN`
   - `NEXT_PUBLIC_DATADOG_SITE`
   - `NEXT_PUBLIC_APP_VERSION`

### 其他部署平台

对于其他部署平台，确保在构建和运行时都能访问到这些环境变量。

## 6. 故障排除

### 常见问题

1. **日志没有出现在 Datadog 中**
   - 检查 Client Token 是否正确
   - 确认站点配置是否匹配你的 Datadog 账户
   - 查看浏览器控制台是否有错误信息

2. **初始化失败**
   - 确保环境变量名称正确（包含 `NEXT_PUBLIC_` 前缀）
   - 重启开发服务器
   - 检查网络连接

3. **日志格式问题**
   - 确保传递给日志函数的数据结构正确
   - 检查是否有循环引用或不可序列化的对象

### 调试模式

要启用详细的调试日志，可以在浏览器控制台中设置：

\`\`\`javascript
localStorage.setItem('datadog-debug', 'true')
\`\`\`

然后刷新页面，系统会输出更详细的调试信息。

## 7. 性能考虑

- Datadog 日志是异步发送的，不会阻塞主要功能
- 如果 Datadog 服务不可用，系统会自动回退到控制台日志
- 日志采样率可以在配置中调整以控制发送频率

## 8. 隐私和安全

- 不要在日志中包含敏感信息（如用户密码、API 密钥等）
- Client Token 应该保密，不要提交到公共代码仓库
- 考虑在生产环境中使用更严格的日志级别过滤

## 9. 相关文档

- [Datadog Browser Logs 官方文档](https://docs.datadoghq.com/logs/log_collection/javascript/)
- [Datadog Client Token 管理](https://docs.datadoghq.com/account_management/api-app-keys/#client-tokens)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
